import React, { PropTypes, Component } from 'react';
import ScreenController from '../../common/ScreenController';

import withStyles from '../../../decorators/withStyles';
import styles from './ScreenPermissionsObject.css';

import utils from '../../../utils/utils';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import UserStore from '../../../stores/UserStore';
import GroupStore from '../../../stores/GroupStore';
import ScopeStore from '../../../stores/ScopeStore';
import PlaceStore from '../../../stores/PlaceStore';
import TopicStore from '../../../stores/TopicStore';

import ScreenPermissionsObjectController from '../ScreenPermissionsObjectController';

@withStyles(styles)
class ScreenPermissionsObject extends ScreenController {
	_getStoreLoads(props) {
		let storeloads = {};
		switch (props.data.objectType) {
			case ObjectTypes.SCOPE:
				storeloads = {
					scopes: this._load(ScopeStore),
					users: this._load(UserStore),
					groups: this._load(GroupStore)
				};
				break;
			case ObjectTypes.PLACE:
				storeloads = {
					places: this._load(PlaceStore),
					users: this._load(UserStore),
					groups: this._load(GroupStore)
				};
				break;
			case ObjectTypes.TOPIC:
				storeloads = {
					topics: this._load(TopicStore),
					users: this._load(UserStore),
					groups: this._load(GroupStore)
				};
				break;
			case ObjectTypes.GROUP:
				storeloads = {
					topics: this._load(TopicStore),
					places: this._load(PlaceStore),
					scopes: this._load(ScopeStore),
					users: this._load(UserStore),
					groups: this._load(GroupStore)
				};
				break;
			case ObjectTypes.USER:
				storeloads = {
					topics: this._load(TopicStore),
					places: this._load(PlaceStore),
					scopes: this._load(ScopeStore),
					users: this._load(UserStore)
				};
				break;
		}
		storeloads.selectorData = this._load(Store[props.data.objectType]);
		return storeloads;
	}

	componentDidMount() {
		super.componentDidMount();

		if(this.props.data.objectType) {
			this.addListeners();
		}
	}

	addListeners(props) {
		if(!props) {
			props = this.props;
		}
		this.changeListener.add(Store[props.data.objectType]);
	}

	removeListeners() {
		this.changeListener.clean();
	}

	render() {

		if (this.state.ready) {
			let props = utils.clone(this.props);
			//let props = {};
			props.store = this.state.store;
			return React.createElement(ScreenPermissionsObjectController, props);
		}
		else {
			return (
				<div className="component-loading"></div>
			);
		}

	}
}

export default ScreenPermissionsObject;
