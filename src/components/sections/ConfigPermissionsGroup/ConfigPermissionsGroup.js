import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import _ from 'underscore';

import styles from './ConfigPermissionsGroup.css';
import withStyles from '../../../decorators/withStyles';

import ObjectTypes from '../../../constants/ObjectTypes';

import UIObjectSelect from '../../atoms/UIObjectSelect';
import utils from '../../../utils/utils';

import UserModel from '../../../models/UserModel';
import GroupModel from '../../../models/GroupModel';

import UserStore from '../../../stores/UserStore';
import GroupStore from '../../../stores/GroupStore';

import ActionCreator from '../../../actions/ActionCreator';
import ConfigControls from '../../atoms/ConfigControls';
import { Input } from '../../SEUI/elements';

var initialState = {
	valuesUsersRead: [],
	valuesGroupsRead: [],
	valuesUsersUpdate: [],
	valuesGroupsUpdate: [],
	valuesUsersDelete: [],
	valuesGroupsDelete: [],
	valuesMembers: [],
	valuesName: '',
	valuesResources: []
};

@withStyles(styles)
class ConfigPermissionsGroup extends ControllerComponent {
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
			let groups = _.findWhere(props.store.groups, {key: props.selectorValue});
			if (groups) {
				nextState = {
					valuesUsersRead: [],
					valuesGroupsRead: [],
					valuesUsersUpdate: [],
					valuesGroupsUpdate: [],
					valuesUsersDelete: [],
					valuesGroupsDelete: [],
					valuesMembers: _.pluck(groups.members, "key"),
					valuesName: groups.name,
					valuesResources: []
				};
				groups.permissions.group.forEach(permission => {
					if(permission.permission == 'GET') {
						nextState.valuesGroupsRead.push(permission.id);
					} else if(permission.permission == 'DELETE') {
						nextState.valuesGroupsDelete.push(permission.id);
					} else if(permission.permission == 'PUT') {
						nextState.valuesGroupsUpdate.push(permission.id);
					}
				});
				groups.permissions.user.forEach(permission => {
					if(permission.permission == 'GET') {
						nextState.valuesUsersRead.push(permission.id);
					} else if(permission.permission == 'DELETE') {
						nextState.valuesUsersDelete.push(permission.id);
					} else if(permission.permission == 'PUT') {
						nextState.valuesUsersUpdate.push(permission.id);
					}
				});
				//TODO: Refactor. Currently the whole permission for BackOffice are in two categories. One for the creation types and one for the rest.
				groups.permissionsTowards.forEach(permission => {
					nextState.valuesResources.push(permission.resourceType);
				})

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
		let group = _.findWhere(this.props.store.groups, {key: this.props.selectorValue});
		let current = this.state.current[stateKey];
		let newOnes = _.pluck(values, "key");
		// Find added ones
		let permission = {
			resourceType: 'group',
			resourceId: this.props.selectorValue,
			permission: operationType
		};
		if(current.length < newOnes.length) {
			let toAdd = _.difference(newOnes, current);
			toAdd.forEach(id => {
				group.addPermission(ObjectTypes.USER, id, permission);
				ActionCreator.addPermissionUser(this.instance, id, permission);
			});
		} else if(current.length > newOnes.length) {
			let toRemove = _.difference(current, newOnes);
			toRemove.forEach(id => {
				group.removePermission(ObjectTypes.USER, id, permission);
				ActionCreator.removePermissionFromUser(this.instance, id, permission);
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
		let group = _.findWhere(this.props.store.groups, {key: this.props.selectorValue});
		let current = this.state.current[stateKey];
		let newOnes = _.pluck(values, "key");
		// Find added ones
		let permission = {
			resourceType: 'group',
			resourceId: this.props.selectorValue,
			permission: operationType
		};
		if(current.length < newOnes.length) {
			let toAdd = _.difference(newOnes, current);
			toAdd.forEach(id => {
				group.addPermission(ObjectTypes.GROUP, id, permission);
				ActionCreator.addPermission(this.instance, id, permission);
			});
		} else if(current.length > newOnes.length) {
			let toRemove = _.difference(current, newOnes);
			toRemove.forEach(id => {
				group.removePermission(ObjectTypes.GROUP, id, permission);
				ActionCreator.removePermission(this.instance, id, permission);
			});
		} else {
			console.log("This should never happen");
		}

		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		let newState = {};
		newState[stateKey] = newValues;
		this.setCurrentState(newState);
	}

	onChangeObjectMember(stateKey, objectType, value, values) {
		let group = _.findWhere(this.props.store.groups, {key: this.props.selectorValue});
		let current = this.state.current[stateKey];
		let newOnes = _.pluck(values, "key");
		// Find added ones
		if(current.length < newOnes.length) {
			let toAdd = _.difference(newOnes, current);
			toAdd.forEach(id => {
				group.users.push(_.findWhere(this.props.store.users, {key: id}));
				ActionCreator.addMemberToGroup(this.instance, group.key, id);
			});
		} else if(current.length > newOnes.length) {
			let toRemove = _.difference(current, newOnes);
			toRemove.forEach(id => {
				group.users = _.without(group.users, id);
				ActionCreator.removeMemberFromGroup(this.instance, group.key, id);
			});
		} else {
			console.log("This should never happen");
		}

		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		let newState = {};
		newState[stateKey] = newValues;
		this.setCurrentState(newState);
	}

	onChangePermissions(value, values) {
		let group = _.findWhere(this.props.store.groups, {key: this.props.selectorValue});
		let current = this.state.current.valuesResources;
		let newOnes = _.pluck(values, 'key');

		if(current.length < newOnes.length) {
			let toAdd = _.difference(newOnes, current);
			toAdd.forEach(resourceType => {
				ActionCreator.addPermission(this.instance, group.key, {
					resourceType: resourceType,
					resourceId: null,
					permission: 'POST'
				});
			});
		} else if(current.length > newOnes.length) {
			let toRemove = _.difference(current, newOnes);
			toRemove.forEach(resourceType => {
				ActionCreator.removePermission(this.instance, group.key, {
					resourceType: resourceType,
					resourceId: null,
					permission: 'POST'
				});
			});
		} else {
			console.log('This should never happen');
		}
	}

	/**
	 * Differentiate between states
	 * - when receiving response for asynchronous action, ensure state has not changed in the meantime
	 */
	updateStateHash() {
		// todo hash influenced by screen/page instance / active screen (unique every time it is active)
		this._stateHash = utils.stringHash(this.props.selectorValue);
	}

	onChangeName(e) {
		this.setCurrentState({
			valuesName: e.target.value
		});
	}

	saveForm() {
		let operationId = super.saveForm();

		ActionCreator.updateGroup(operationId, this.props.selectorValue, this.state.current.valuesName);
	}

	deleteObject(key) {
		ActionCreator.deleteGroup(this.instance, key);
		if (key == this.props.selectorValue) {
			ActionCreator.closeScreen(this.props.screenKey); //todo close after confirmed
		}
	}

	render() {
		let ret = null;

		let availableTypesForPermissions = [{
			key: 'dataset',
			name: 'Scope'
		}, {
			key: 'location',
			name: 'Place'
		}, {
			key: 'topic',
			name: 'Topic'
		}, {
			key: 'group',
			name: 'Group'
		}];

		if(this.state.built) {
			ret = (
				<div>
					<div className="frame-input-wrapper required">
						<label className="container">
							Name
							<Input
								type="text"
								name="name"
								placeholder=" "
								value={this.state.current.valueName}
								onChange={this.onChangeName.bind(this)}
							/>
						</label>
					</div>

					<ConfigControls
						key={"ConfigControls" + this.props.selectorValue}
						disabled={this.props.disabled}
						saved={this.equalStates(this.state.current,this.state.saved)}
						saving={this.state.saving}
						onSave={this.saveForm.bind(this)}
						onDelete={this.deleteObject.bind(this, this.props.selectorValue)}
					/>

					<div></div>

					<div><h2>Members of this group</h2></div>
					<div className="frame-input-wrapper">
						<label className="container">
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeObjectMember.bind(this, "valuesMembers", ObjectTypes.USERS)}
								options={this.props.store.users}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuesMembers}
							/>
						</label>
					</div>

					<div><h2>Permissions for creation of types</h2></div>
					<div className="frame-input-wrapper">
						<label className="container">
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangePermissions.bind(this)}
								options={availableTypesForPermissions}
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuesResources}
							/>
						</label>
					</div>

					<div><h2>Specify the permissions towards the group</h2></div>

					<div className="frame-input-wrapper">
						<label className="container">
							Users with permission to see this group
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeObjectSelectUser.bind(this, "valuesUsersRead", ObjectTypes.USERS, "GET")}
								options={this.props.store.users}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuesUsersRead}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Users with permission to update this group
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeObjectSelectUser.bind(this, "valuesUsersUpdate", ObjectTypes.USERS, "PUT")}
								options={this.props.store.users}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuesUsersUpdate}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Users with permission to delete this group
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeObjectSelectUser.bind(this, "valuesUsersDelete", ObjectTypes.USERS, "DELETE")}
								options={this.props.store.users}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuesUsersDelete}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Groups with permission to see this group
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
							Groups with permission to update this group
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
							Groups with permission to delete this group
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

export default ConfigPermissionsGroup;
