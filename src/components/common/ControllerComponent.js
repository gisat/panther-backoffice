import React, { PropTypes, Component } from 'react';
import PantherComponent from "./PantherComponent";

import utils from '../../utils/utils';
import logger from '../../core/Logger';
import _ from 'underscore';

import ListenerHandler from '../../core/ListenerHandler';

/**
 * STATE:
 * current: (data) current data state as changed by the component
 * saved: (data) saved data state loaded on mount - current before being changed by the component
 * next: (data) saved data state changed outside of component after mount
 * ui: interface state not determined by data (rather by user actions)
 * invalid: bool - if data state was changed outside of component after mount
 * built: bool - some current data state is ready
 * updated: bool - current data state was updated automatically to reflect outside changes
 * saving: bool - saving underway
 */

var initialState = {
	current: {},
	saved: {},
	next: {},
	ui: {},
	invalid: false,
	built: false,
	updated: false,
	saving: false,
	saveOperation: null
};

class ControllerComponent extends PantherComponent {

	// LIFECYCLE / HOOKS /////////////////////////////////////////////

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState); //descendants MUST NOT set state (only merge) in constructor

		this.acceptChange = true; // todo is this still needed? (what does it do?)
		logger.info("ControllerComponent# constructor(), Props: ", props);

		this.responseListener = new ListenerHandler(this, this._onStoreResponse, 'addResponseListener', 'removeResponseListener');
		this.errorListener = new ListenerHandler(this, this._onStoreError, 'addErrorListener', 'removeErrorListener');
	}

	componentDidMount() {
		this.mounted = true;
		let state = this.buildState();
		this.setStateDeep({
			current: {$merge: state},
			saved: {$merge: state},
			built: {$set: true}
		});
	}

	componentWillReceiveProps(nextProps) {
		let nextState = this.buildState(nextProps);

		if (this.mounted) {
			if (this.equalStates(this.state.current, nextState)) {
				//new state is the same as current, can be used (we probably saved)
				this.setStateDeep({
					current: {$merge: nextState},
					saved: {$merge: nextState},
					built: {$set: true},
					saving: {$set: false}
				});
			} else if (this.equalStates(this.state.current, this.state.saved)) {
				//state was not changed from saved - can be replaced with new
				this.setStateDeep({
					current: {$merge: nextState},
					saved: {$merge: nextState},
					built: {$set: true},
					updated: {$set: true},
					saving: {$set: false}
				});
			} else {
				//state was changed - todo what to do?
				//for now, set invalid state flag and save next state
				//todo next state doesn't need to be in state, but since we need to trigger render with 'invalid' anyway, why not
				this.setStateDeep({
					next: {$merge: nextState},
					invalid: {$set: true}
				});
				logger.error(this.constructor.name + ":ControllerComponent# invalid state set");
			}
		}
		else {
			//component not mounted
		}

	}

	/**
	 * Hook. This method is called whenever store, which this component listens to, responds to action.
	 * To be overridden by descendants.
	 * @private
	 */
	_onStoreResponse() {}

	/**
	 * This method is called whenever store, which this component listens to, emits error.
	 * @private
	 */
	_onStoreError(error, operationId, data) {
		if (operationId==this.state.saveOperation) {
			logger.trace(this.constructor.name + ":ControllerComponent# _onStoreError()");
			this.setState({
				saving: false,
				saveOperation: null
			});
		}
	}

	componentWillUpdate() {
		this.mounted = true;
		this.updateStateHash();
	}

	componentWillUnmount() {
		this.mounted = false;

		this.responseListener.clean();
		this.errorListener.clean();
	}


	// ON-DEMAND / HELPERS //////////////////////////////////////////

	/**
	 * Reload state to reflect outside changes. To be run on demand.
	 * @param props - props object to pass to buildState (optional in buildState)
	 * @param reloadCurrent - bool - replace current data state too (discard user changes)
	 * 	- if not true, only saved state is reloaded
	 */
	reloadState(props, reloadCurrent) {
		if (this.mounted) {
			let newState = this.buildState(props);
			if (reloadCurrent) {
				this.setStateDeep({
					current: {$merge: newState},
					saved: {$merge: newState},
					built: {$set: true}
				});
			}
			else {
				this.setStateDeep({
					saved: {$merge: newState},
					built: {$set: true}
				});
			}
		}
		else {
			logger.info(this.constructor.name + ":ControllerComponent# reloadState(), Component is already unmounted." + this);
		}
	}

	/**
	 * Hook. Build data state structure.
	 * @param props - props object to use
	 * @returns {{}} state object (second level)
	 */
	buildState(props) {
		if (!props) {
			props = this.props;
		}
		return {};
	}

	/**
	 * Helpers for setting second level state same way as setState is used.
	 * @param map - data to save into state
	 * @param callback
	 */
	setCurrentState(map,callback) {
		this.setSecondLevelState('current',map,callback);
	}
	setUIState(map,callback) {
		this.setSecondLevelState('ui',map,callback);
	}

	/**
	 * compare states (e.g. current with saved)
	 * @param firstState
	 * @param secondState
	 * @param limitKeys
	 */
	equalStates(firstState,secondState,limitKeys) {
		let one = {}, two = {};
		if(limitKeys) {
			for (var keyOne in firstState) {
				if(firstState.hasOwnProperty(keyOne) && limitKeys.indexOf(keyOne)!=-1) {
					one[keyOne] = firstState[keyOne];
				}
			}
			for (var keyTwo in secondState) {
				if(secondState.hasOwnProperty(keyTwo) && limitKeys.indexOf(keyTwo)!=-1) {
					two[keyTwo] = secondState[keyTwo];
				}
			}
		}
		else {
			one = firstState;
			two = secondState;
		}
		return _.isEqual(one,two);
	}

	/**
	 * Differentiate between states
	 * - when receiving response for asynchronous action, ensure state has not changed in the meantime
	 */
	updateStateHash(props){}

	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}


	saveForm() {
		let guid = utils.guid();
		this.setState({
			saving: true,
			saveOperation: guid
		});
		this.acceptChange = true;
		return guid;
	}
}

export default ControllerComponent;
