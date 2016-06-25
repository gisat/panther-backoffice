import React, { PropTypes, Component } from 'react';

import utils from '../../utils/utils';
import logger from '../../core/Logger';
import update from 'react-addons-update';

import ListenerHandler from '../../core/ListenerHandler';

/**
 * STATE:
 * current: (data) current data state as changed by the component
 * saved: (data) saved data state loaded on mount - current before being changed by the component
 * next: (data) saved data state changed outside of component after mount
 * ui: interface state not determined by data (rather by user actions)
 * invalid: bool - if data state was changed outside of component after mount
 * built: bool - some current data state is ready
 */

var initialState = {
	current: {},
	saved: {},
	next: {},
	ui: {},
	invalid: false,
	built: false
};

// todo reload state.saved (when invalid, probably after user prompt)

class PantherComponent extends Component {

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState); //descendants MUST NOT set state (only merge) in constructor

		this.acceptChange = true;
		logger.info("PantherComponent# constructor(), Props: ", props);

		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
		this.responseListener = new ListenerHandler(this, this._onStoreResponse, 'addResponseListener', 'removeResponseListener');
		this.focusListener = new ListenerHandler(this, this._focusScreen, 'addFocusListener', 'removeFocusListener');
	}

	componentDidMount() {
		this.mounted = true;
		let thisComponent = this;
		let statePromise = this.buildState();
		statePromise.then(function(newState){
			thisComponent.setStateDeep({
				current: {$merge: newState},
				saved: {$merge: newState},
				built: {$set: true}
			});
		});
	}

	componentWillUpdate() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;

		this.changeListener.clean();
		this.responseListener.clean();
		this.focusListener.clean();
	}

	/**
	 * Hook. This method is called whenever any change occur to store, which this component listens to.
	 * To be overridden by descendants.
	 * @private
	 */
	_onStoreChange(limitKeys) {
		let newStatePromise = this.buildState(null, limitKeys);
		let thisComponent = this;
		newStatePromise.then(function(newState){
			if (thisComponent.mounted) {
				if (thisComponent._equalStates(thisComponent.state.current, thisComponent.state.saved, limitKeys)) {
					//state was not changed from saved - can be replaced with new
					thisComponent.setStateDeep({
						current: {$merge: newState},
						saved: {$merge: newState}
					});
				}
				else {
					//state was changed - todo what to do?
					//for now, set invalid state flag and save next state
					//todo next state doesn't need to be in state, but since we need to trigger render with 'invalid' anyway, why not
					thisComponent.setStateDeep({
						next: {$merge: newState},
						invalid: {$set: true}
					});
				}
			}
			else {
				//component not mounted
			}
		});
	}

	/**
	 * Hook. This method is called whenever store responds to action, which this component listens to.
	 * To be overridden by descendants.
	 * @private
	 */
	_onStoreResponse() {}




	/**
	 * legacy setting (first-level state)
	 * @param map
	 * @param limitKeys
	 */
	setStateFromStores(map, limitKeys) {
		let statePromise = this.getStateFromStores(map, limitKeys);
		var component = this;
		statePromise.then(function(map){
			if(component.mounted) {
				logger.trace("PantherComponent# setStateFromStores(), Data to set: ", map, ", Current Component: ", component);
				component.setState(map);
			} else {
				logger.info("PantherComponent# setStateFromStores(), Component is already unmounted." + component);
				component.render();
			}
		});
	}

	getStateFromStores(map, limitKeys) {
		// default loads - todo will we need any other?
		if (!map) {
			map = this._getStoreLoads();
		}
		logger.info("PantherComponent# getStateFromStores(), Data: ", map, ", limited to keys:", limitKeys);

		return new Promise ( function (resolve, reject) {
			var setAll = false;
			if(!limitKeys){
				limitKeys = [];
				setAll = true;
			}
			var loads = [];
			var keys = [];
			for(var key in map){
				if(setAll || (limitKeys.indexOf(key)!=-1)) {
					loads.push(map[key]);
					// todo to clone or not to clone, that is the question
					//loads.push(utils.deepClone(store2state[key]));
					keys.push(key);
				}
			}
			Promise.all(loads).then(function(data){
				var ret = {};
				for(var i in keys){
					ret[keys[i]] = data[i];
				}
				resolve(ret);
			});
		});
	}

	/**
	 * Hook. Base version enough for independent loads (single step)
	 * To be overriden by descendants for interdependent loads.
	 * @param map
	 * @param limitKeys
	 * @returns promise of state object (second level)
	 */
	buildState(map, limitKeys) {
		return this.getStateFromStores(map, limitKeys);
	}

	/**
	 * Hook. This method is called to load data into state by getStateFromStores().
	 * To be overridden by descendants.
	 * @private
	 */
	_getStoreLoads() {
		return {};
	}

	setStateDeep(updatePath, callback) {
		logger.trace("context# setStateDeep(), Current this: ", this, ", updatePath: ", updatePath);
		if(this.mounted) {
			this.setState(update(this.state, updatePath), callback);
		} else {
			logger.warn("context# setStateDeep(), Tries to update deep state of unmounted component.", updatePath);
		}
	}

	/**
	 * Helpers for setting second level state same way as setState is used.
	 * @param subState - key under which the second level state is stored
	 * @param map - data to save into state
	 * @param callback
	 */
	setSecondLevelState(subState,map,callback) {
		let updatePath = {
			[subState]: {}
		};
		for (var key in map) {
			updatePath[subState][key] = {$set: map[key]};
		}
		this.setStateDeep(updatePath,callback);
	}
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
	 * @private
	 */
	_equalStates(firstState,secondState,limitKeys) {
		let one = {}, two = {};
		if(limitKeys) {
			for (var key in firstState) {
				if(limitKeys.indexOf(key)!=-1) {
					one[key] = firstState[key];
				}
			}
			for (var key in secondState) {
				if(limitKeys.indexOf(key)!=-1) {
					two[key] = secondState[key];
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
	 * Hook. This method is called whenever focused screen changes.
	 * @private
	 */
	_focusScreen() {}

	saveForm() {
		this.acceptChange = true;
	}
}

export default PantherComponent;
