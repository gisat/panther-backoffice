/**
 * Components extending ScreenController are responsible for loading data from stores.
 *
 */
import React, { PropTypes, Component } from 'react';

import utils from '../../utils/utils';
import logger from '../../core/Logger';
import update from 'react-addons-update';

import ListenerHandler from '../../core/ListenerHandler';

/**
 * STATE:
 * store: data loaded from stores
 * built: bool - data state is ready
 */

var initialState = {
	store: {},
	ready: false
};

class ScreenController extends Component {

	// LIFECYCLE / HOOKS /////////////////////////////////////////////

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState); //descendants MUST NOT set state (only merge) in constructor

		logger.info("ScreenController# constructor(), Props: ", props);

		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
	}

	componentDidMount() {
		this.mounted = true;
		let statePromise = this.loadState();
	}

	componentWillReceiveProps(nextProps) {
		let nextStatePromise = this.loadState(nextProps);
	}

	/**
	 * Called whenever any change occur to store, which this component listens to.
	 * @private
	 */
	_onStoreChange(limitKeys) {
		let nextStatePromise = this.loadState(null, limitKeys);
	}

	componentWillUpdate() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
		this.changeListener.clean();
	}


	// ON-DEMAND / HELPERS //////////////////////////////////////////

	/**
	 * Build data state structure.
	 * @param props - props object to use
	 * @param limitKeys - string array - limit loads object to specified keys
	 * @returns Promise of state object (second level)
	 */
	loadState(props, limitKeys) {
		let thisComponent = this;
		if (!props) {
			props = this.props;
		}
		let statePromise = this.getStateFromStores(this._getStoreLoads(props), limitKeys);
		statePromise.then(function(newState){
			if (thisComponent.mounted) {
				thisComponent.setStateDeep({
					store: {$merge: newState},
					ready: {$set: true}
				});
			}
		});
		return statePromise;
	}

	/**
	 * Hook. This method is called to load data into state by getStateFromStores().
	 * To be overridden by descendants.
	 * @param props - react props - this.props or nextProps
	 * @returns object of functions, which will return data on execution
	 * @private
	 */
	_getStoreLoads(props) {
		return {};
	}

	/**
	 * Load data from stores. Limits loads to specified keys, then loads the data.
	 * @param map
	 * @param limitKeys
	 * @returns {Promise} of (possibly partial) state object
	 */
	getStateFromStores(map, limitKeys) {
		logger.info("ScreenController# getStateFromStores(), Data: ", map, ", limited to keys:", limitKeys);

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
					loads.push(map[key]()); //execute the functions here, not earlier (so only those needed are run)
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
		logger.trace("context# setStateDeep(), Current this: ", this, ", updatePath: ", updatePath);
		if(this.mounted) {
			this.setState(update(this.state, updatePath), callback);
		} else {
			logger.warn("context# setStateDeep(), Tries to update deep state of unmounted component.", updatePath);
		}
	}


	// RENDERING ////////////////////////////////////////////////////

	/**
	 * render - will mostly be overriden
	 * @returns {*}
	 */
	render() {
		let ret = null;
		if (this.state.ready) {
			let children = React.Children.map(this.props.children,
				(child) => {
					return React.cloneElement(child, {
						disabled: this.props.disabled || child.props.disabled,
						store: this.state.store
					})
				}
			);
			ret = (
				<div>
					{children}
				</div>
			);
		}
		else {
			ret = (
				<div class="component-loading"></div>
			);
		}
		return ret;
	}

}

export default ScreenController;
