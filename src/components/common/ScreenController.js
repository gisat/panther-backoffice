/**
 * Components extending ScreenController are responsible for loading data from stores.
 *
 */
import React, { PropTypes, Component } from 'react';
import PantherComponent from "./PantherComponent";

import utils from '../../utils/utils';
import logger from '../../core/Logger';

import ListenerHandler from '../../core/ListenerHandler';
import ScopeModel from '../../models/ScopeModel';
import ScopeStore from '../../stores/ScopeStore';

/**
 * STATE:
 * store: data loaded from stores
 * built: bool - data state is ready
 */

var initialState = {
	store: {},
	ready: false
};

class ScreenController extends PantherComponent {

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
		let nextStatePromise = this.loadState(null, null, limitKeys);
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
	 * @param options - options object (internal props)
	 * @param limitKeys - string array - limit loads object to specified keys
	 * @returns Promise of state object (second level)
	 */
	loadState(props, options, limitKeys) {
		let thisComponent = this;
		if (!props) {
			props = this.props;
		}
		let statePromise = this.getStateFromStores(this._getStoreLoads(props, options), limitKeys);
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
	 * @param options - options object (internal props)
	 * @returns object of functions, which will return data on execution
	 * @private
	 */
	_getStoreLoads(props, options) {
		return {};
	}

	/**
	 * Returns function, returning promise of data from store.
	 * @param store
	 * @returns {Function}
	 * @private
	 */
	_load(store) {
		if (
			this.props.scope &&
			this.props.scope instanceof ScopeModel &&
			!(store instanceof ScopeStore)
		) {
			return function(){return store.getFiltered({scope: this.props.scope})};
		}
		else {
			return function(){return store.getAll()};
		}
	}

	/**
	 * Returns function, returning promise of data from store.
	 * @param store
	 * @param filter - object of keys and values to find
	 * @returns {Function}
	 * @private
	 */
	_loadWhere(store, filter) {
		if (
			this.props.scope &&
			this.props.scope instanceof ScopeModel &&
			!(store instanceof ScopeStore)
		) {
			filter = _.assign(filter,{scope: this.props.scope});
		}
		return function(){return store.getFiltered(filter)};
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


	// RENDERING ////////////////////////////////////////////////////

	///**
	// * render - will mostly be overriden
	// * @returns {*}
	// */
	//render() {
	//	let ret = null;
	//	if (this.state.ready) {
	//		let children = React.Children.map(this.props.children,
	//			(child) => {
	//				return React.cloneElement(child, {
	//					disabled: this.props.disabled || child.props.disabled,
	//					store: this.state.store
	//				})
	//			}
	//		);
	//		ret = (
	//			<div>
	//				{children}
	//			</div>
	//		);
	//	}
	//	else {
	//		ret = (
	//			<div className="component-loading"></div>
	//		);
	//	}
	//	return ret;
	//}

}

export default ScreenController;
