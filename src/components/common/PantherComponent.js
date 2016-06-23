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

	setStateFromStores(map, limitKeys) {
		this.setStateFromPromise(this.getStateFromStores(map, limitKeys));
	}

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

	setStateDeep(updatePath) {
		logger.trace("context# setStateDeep(), Current this: ", this, ", updatePath: ", updatePath);
		if(this.mounted) {
			this.setState(update(this.state, updatePath));
		} else {
			logger.warn("context# setStateDeep(), Tries to update deep state of unmounted component.", updatePath);
		}
	}

	componentDidMount() {
		this.mounted = true;
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
	_onStoreChange() {}

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
