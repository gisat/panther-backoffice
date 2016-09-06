import React, { PropTypes, Component } from 'react';

import utils from '../../utils/utils';
import logger from '../../core/Logger';
import update from 'react-addons-update';

import ListenerHandler from '../../core/ListenerHandler';


class BaseComponent extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUpdate() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}


	/**
	 * Checks if component mounted and sets state using react-addons-update
	 * @param updatePath
	 * @param callback
	 */
	setStateDeep(updatePath, callback) {
		logger.trace("BaseComponent# setStateDeep(), Current this: ", this, ", updatePath: ", updatePath);
		if(this.mounted) {
			this.setState(update(this.state, updatePath), callback);
		} else {
			logger.warn("BaseComponent# setStateDeep(), Tries to update deep state of unmounted component.", updatePath);
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

export default BaseComponent;
