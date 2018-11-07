import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import _ from 'underscore';

import ObjectTypes from '../../../constants/ObjectTypes';

import UIObjectSelect from '../../atoms/UIObjectSelect';
import utils from '../../../utils/utils';

import UserModel from '../../../models/UserModel';
import GroupModel from '../../../models/GroupModel';

import UserStore from '../../../stores/UserStore';
import GroupStore from '../../../stores/GroupStore';

import ActionCreator from '../../../actions/ActionCreator';


var initialState = {
	valuesUsersRead: [],
	valuesGroupsRead: [],
	valuesUsersUpdate: [],
	valuesGroupsUpdate: [],
	valuesUsersDelete: [],
	valuesGroupsDelete: []
};

class ConfigPermissionsPlace extends ControllerComponent {
	static propTypes = {
		disabled: React.PropTypes.bool,
		store: PropTypes.shape({
			users: PropTypes.arrayOf(PropTypes.instanceOf(UserModel)),
			groups: PropTypes.arrayOf(PropTypes.instanceOf(GroupModel))
		}).isRequired,
		selectorValue: React.PropTypes.any
	};

	static defaultProps = {
		disabled: false,
		selectorValue: null
	};

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);

		Object.assign(this.state.current, utils.deepClone(initialState));
		this.state.saved = utils.clone(this.state.current);
	}

	buildState(props) {
		if(!props){
			props = this.props;
		}
		let nextState = {};
		if(props.selectorValue) {
			let place = _.findWhere(props.store.places, {key: props.selectorValue});
			if (place) {
				nextState = {
					valuesUsersRead: [],
					valuesGroupsRead: [],
					valuesUsersUpdate: [],
					valuesGroupsUpdate: [],
					valuesUsersDelete: [],
					valuesGroupsDelete: []
				};
				place.permissions.group.forEach(permission => {
					if(permission.permission == 'GET') {
						nextState.valuesGroupsRead.push(permission.id);
					} else if(permission.permission == 'DELETE') {
						nextState.valuesGroupsDelete.push(permission.id);
					} else if(permission.permission == 'PUT') {
						nextState.valuesGroupsUpdate.push(permission.id);
					}
				});
				place.permissions.user.forEach(permission => {
					if(permission.permission == 'GET') {
						nextState.valuesUsersRead.push(permission.id);
					} else if(permission.permission == 'DELETE') {
						nextState.valuesUsersDelete.push(permission.id);
					} else if(permission.permission == 'PUT') {
						nextState.valuesUsersUpdate.push(permission.id);
					}
				});
			}
		}
		return nextState;
	}

	componentDidMount() {
		super.componentDidMount();

		this.responseListener.add(UserStore);
		this.responseListener.add(GroupStore);
		this.errorListener.add(UserStore);
		this.errorListener.add(GroupStore);
	}

	// TODO: refactor.
	onChangeObjectSelectUser(stateKey, objectType, operationType, value, values) {
		let place = _.findWhere(this.props.store.places, {key: this.props.selectorValue});
		let current = this.state.current[stateKey];
		let newOnes = _.pluck(values, "key");
		// Find added ones
		let permission = {
			resourceType: 'location',
			resourceId: this.props.selectorValue,
			permission: operationType
		};
		if(current.length < newOnes.length) {
			let toAdd = _.difference(newOnes, current);
			toAdd.forEach(id => {
				place.addPermission(ObjectTypes.USER, id, permission);
				ActionCreator.addPermissionUser(this.instance, id, permission);
			});
		} else if(current.length > newOnes.length) {
			let toRemove = _.difference(current, newOnes);
			toRemove.forEach(id => {
				place.removePermission(ObjectTypes.USER, id, permission);
				ActionCreator.removePermissionUser(this.instance, id, permission);
			});
		} else {
			console.log("This should never happen");
		}

		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		let newState = {};
		newState[stateKey] = newValues;
		this.setCurrentState(newState);
	}

	onChangeObjectSelectGroup(stateKey, objectType, operationType, value, values) {
		let place = _.findWhere(this.props.store.places, {key: this.props.selectorValue});
		let current = this.state.current[stateKey];
		let newOnes = _.pluck(values, "key");
		// Find added ones
		let permission = {
			resourceType: 'location',
			resourceId: this.props.selectorValue,
			permission: operationType
		};
		if(current.length < newOnes.length) {
			let toAdd = _.difference(newOnes, current);
			toAdd.forEach(id => {
				place.addPermission(ObjectTypes.GROUP, id, permission);
				ActionCreator.addPermission(this.instance, id, permission);
			});
		} else if(current.length > newOnes.length) {
			let toRemove = _.difference(current, newOnes);
			toRemove.forEach(id => {
				place.addPermission(ObjectTypes.GROUP, id, permission);
				ActionCreator.addPermission(this.instance, id, permission);
			});
		} else {
			console.log("This should never happen");
		}

		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		let newState = {};
		newState[stateKey] = newValues;
		this.setCurrentState(newState);
	}

	/**
	 * Differentiate between states
	 * - when receiving response for asynchronous action, ensure state has not changed in the meantime
	 */
	updateStateHash() {
		// todo hash influenced by screen/page instance / active screen (unique every time it is active)
		this._stateHash = utils.stringHash(this.props.selectorValue);
	}

	render() {
		let ret = null;

		if(this.state.built) {
			ret = (
				<div>
					<div><h2>Specify the permissions towards the place</h2></div>

					<div className="frame-input-wrapper">
						<label className="container">
							Users with permission to see this place
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeObjectSelectUser.bind(this, "valuesUsersRead", ObjectTypes.USERS, "GET")}
								options={this.props.store.users}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="email"
								value={this.state.current.valuesUsersRead}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Users with permission to update this place
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeObjectSelectUser.bind(this, "valuesUsersUpdate", ObjectTypes.USERS, "PUT")}
								options={this.props.store.users}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="email"
								value={this.state.current.valuesUsersUpdate}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Users with permission to delete this place
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeObjectSelectUser.bind(this, "valuesUsersDelete", ObjectTypes.USERS, "DELETE")}
								options={this.props.store.users}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="email"
								value={this.state.current.valuesUsersDelete}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Groups with permission to see this place
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeObjectSelectGroup.bind(this, "valuesGroupsRead", ObjectTypes.GROUPS, "GET")}
								options={this.props.store.groups}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuesGroupsRead}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Groups with permission to update this place
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeObjectSelectGroup.bind(this, "valuesGroupsUpdate", ObjectTypes.GROUPS, "PUT")}
								options={this.props.store.groups}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuesGroupsUpdate}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Groups with permission to delete this place
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeObjectSelectGroup.bind(this, "valuesGroupsDelete", ObjectTypes.GROUPS, "DELETE")}
								options={this.props.store.groups}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuesGroupsDelete}
							/>
						</label>
					</div>
				</div>
			);
		}

		return ret;
	}
}

export default ConfigPermissionsPlace;
