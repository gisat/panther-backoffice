import React, { PropTypes, Component } from 'react';

import logger from '../../core/Logger';
import update from 'react-addons-update';

import ListenerHandler from '../../core/ListenerHandler';

class PantherComponent extends Component {
	constructor(props) {
		super(props);

		this.acceptChange = true;
		logger.info("PantherComponent# constructor(), Props: ", props);

		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
		this.responseListener = new ListenerHandler(this, this._onStoreResponse, 'addResponseListener', 'removeResponseListener');
		this.focusListener = new ListenerHandler(this, this._focusScreen, 'addFocusListener', 'removeFocusListener');
	}

	componentDidMount() {
		this.mounted = true;
		let statePromise = this.getStateFromStores();
		statePromise.then(function(newState){
			this.setState({
				current: newState,
				saved: newState
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



	setStateFromStores(map, limitKeys) {
		this.setStateFromPromise(this.getStateFromStores(map, limitKeys));
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

	setStateFromPromise(promise) {
		var component = this;
		promise.then(function(map){
			if(component.mounted) {
				logger.trace("PantherComponent# setStateFromStores(), Data to set: ", map, ", Current Component: ", component);
				component.setState(map);
			} else {
				logger.info("PantherComponent# setStateFromStores(), Component is already unmounted." + component);
				component.render();
			}
		});
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
	 * Helper for setting 'current' (=one level deep) state same way as setState is used.
	 * @param map
	 * @param callback
	 */
	setCurrentState(map,callback) {
		let updatePath = {
			current: {}
		};
		for (var key in map) {
			updatePath.current[key] = {$set: map[key]};
		}
		this.setStateDeep(updatePath,callback);
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
	 * Hook. This method is called whenever any change occur to store, which this component listens to.
	 * To be overridden by descendants.
	 * @private
	 */
	_onStoreChange(limitKeys) {
		let newState = this.getStateFromStores(null, limitKeys);
		if (this._equalStates(this.state.current,this.state.saved,limitKeys)) {
			//state was not changed from saved - can be replaced with new
			this.setState({
				current: newState,
				saved: newState
			});
		}
		else {
			//state was changed - todo what to do?
			//for now, set invalid state flag and save next state
			//todo next state doesn't need to be in state, but since we need to trigger render with 'invalid' anyway, why not
			this.setState({
				next: newState,
				invalid: true
			});
		}
	}

	/**
	 * Hook. This method is called whenever store responds to action, which this component listens to.
	 * To be overridden by descendants.
	 * @private
	 */
	_onStoreResponse() {}


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
