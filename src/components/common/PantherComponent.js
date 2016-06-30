import React, { PropTypes, Component } from 'react';

import utils from '../../utils/utils';
import logger from '../../core/Logger';
import update from 'react-addons-update';

import ListenerHandler from '../../core/ListenerHandler';


class PantherComponent extends Component {

	constructor(props) {
		super(props);

		// todo legacy
		this.acceptChange = true;
		logger.info("PantherComponent# constructor(), Props: ", props);

		// todo legacy, remove after all components moved to ScreenController or ControllerComponent
		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
		this.responseListener = new ListenerHandler(this, this._onStoreResponse, 'addResponseListener', 'removeResponseListener');
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUpdate() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;

		// todo legacy
		this.changeListener.clean();
		this.responseListener.clean();
	}

	// todo legacy
	/**
	 * Hook. This method is called whenever any change occur to store, which this component listens to.
	 * To be overridden by descendants.
	 * @private
	 */
	_onStoreChange() {}

	// todo legacy
	/**
	 * Hook. This method is called whenever store responds to action, which this component listens to.
	 * To be overridden by descendants.
	 * @private
	 */
	_onStoreResponse() {}



	// todo legacy
	/**
	 * legacy setting (first-level state)
	 * @param map
	 * @param limitKeys
	 */
	setStateFromStores(map, limitKeys) {
		// default loads - todo will we need any other?
		if (!map) {
			map = this.store2state();
		}
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

	// todo legacy
	/**
	 * Load data from stores. Actually limits loads to specified keys.
	 * @param map
	 * @param limitKeys
	 * @returns {Promise} of (possibly partial) state object
	 */
	getStateFromStores(map, limitKeys) {
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
				if(map.hasOwnProperty(key) && (setAll || (limitKeys.indexOf(key)!=-1))) {
					loads.push(map[key]);
					// todo to clone or not to clone, that is the question
					//loads.push(utils.deepClone(store2state[key]));
					keys.push(key);
				}
			}
			Promise.all(loads).then(function(data){
				var ret = {};
				for(var i in keys){
					if (keys.hasOwnProperty(i)) {
						ret[keys[i]] = data[i];
					}
				}
				resolve(ret);
			});
		});
	}

	/**
	 * Checks if component mounted and sets state using react-addons-update
	 * @param updatePath
	 * @param callback
	 */
	setStateDeep(updatePath, callback) {
		logger.trace("PantherComponent# setStateDeep(), Current this: ", this, ", updatePath: ", updatePath);
		if(this.mounted) {
			this.setState(update(this.state, updatePath), callback);
		} else {
			logger.warn("PantherComponent# setStateDeep(), Tries to update deep state of unmounted component.", updatePath);
		}
	}

	/**
	 * Helper for setting second level state same way as setState is used.
	 * @param subState - key under which the second level state is stored
	 * @param map - data to save into state
	 * @param callback
	 */
	setSecondLevelState(subState,map,callback) {
		let updatePath = {
			[subState]: {}
		};
		for (var key in map) {
			if (map.hasOwnProperty(key)) {
				updatePath[subState][key] = {$set: map[key]};
			}
		}
		this.setStateDeep(updatePath,callback);
	}

}

export default PantherComponent;
