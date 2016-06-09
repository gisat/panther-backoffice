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

	setStateFromStores(props, keys) {
		logger.info("PantherComponent# setStateFromStores(), Props: ", props, ", keys:", keys);

		var setAll = false;
		if(!keys){
			keys = [];
			setAll = true;
		}
		var component = this;
		var storeLoads = [];
		var storeNames = [];
		for(var name in props){
			if(setAll || (keys.indexOf(name)!=-1)) {
				storeLoads.push(props[name]);
				// todo to clone or not to clone, that is the question
				//storeLoads.push(utils.deepClone(store2state[name]));
				storeNames.push(name);
			}
		}
		return Promise.all(storeLoads).then(function(data){
			var storeObject = {};
			for(var i in storeNames){
				storeObject[storeNames[i]] = data[i];
			}
			if(component.mounted) {
				logger.trace("PantherComponent# setStateFromStores(), Stores to set: ", storeObject, ", Current Component: ", component);
				component.setState(storeObject);
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
