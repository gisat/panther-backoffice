import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import _ from 'underscore';

import styles from './ConfigPermissionsUser.css';
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
	valuesEmail: '',
	valuesName: '',
	valuesPassword: '',
	valuesPasswordAgain: '',
	valuesPhone: '',
	valuesResources: [],

	valuesUsersRead: [],
	valuesGroupsRead: [],
	valuesUsersUpdate: [],
	valuesGroupsUpdate: [],
	valuesUsersDelete: [],
	valuesGroupsDelete: []
};

@withStyles(styles)
class ConfigPermissionsUser extends ControllerComponent {
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
			let user = _.findWhere(props.store.users, {key: props.selectorValue});
			if (user) {
				nextState = {
					valuesUsersRead: [],
					valuesGroupsRead: [],
					valuesUsersUpdate: [],
					valuesGroupsUpdate: [],
					valuesUsersDelete: [],
					valuesGroupsDelete: [],
					valuesEmail: user.email,
					valuesName: user.name,
					valuesPhone: user.phone,
					valuesPassword: '',
					valuesPasswordAgain: '',
					valuesResources: []
				};
				if(user.permissionsGroups) {
					user.permissionsGroups.forEach(permission => {
						if (permission.permission === 'GET') {
							nextState.valuesGroupsRead.push(permission.group_id);
						} else if (permission.permission === 'DELETE') {
							nextState.valuesGroupsDelete.push(permission.group_id);
						} else if (permission.permission === 'PUT') {
							nextState.valuesGroupsUpdate.push(permission.group_id);
						}
					});
				}
				if(user.permissionsUsers) {
					user.permissionsUsers.forEach(permission => {
						if (permission.permission === 'GET') {
							nextState.valuesUsersRead.push(permission.user_id);
						} else if (permission.permission === 'DELETE') {
							nextState.valuesUsersDelete.push(permission.user_id);
						} else if (permission.permission === 'PUT') {
							nextState.valuesUsersUpdate.push(permission.user_id);
						}
					});
				}

				if(user.permissionsTowards) {
					user.permissionsTowards.forEach(permission => {
						nextState.valuesResources.push(permission.key);
					})
				}
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

	onChangeMultiple(stateKey, objectType, value, values) {
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

	onChangeName(e) {
		this.setCurrentState({
			valuesName: e.target.value
		});
	}

	onChangeEmail(e) {
		this.setCurrentState({
			valuesEmail: e.target.value
		});
	}

	onChangePhone(e) {
		this.setCurrentState({
			valuesPhone: e.target.value
		})
	}

	onChangePassword(e) {
		this.setCurrentState({
			valuesPassword: e.target.value
		});
	}

	onChangePasswordAgain(e) {
		this.setCurrentState({
			valuesPasswordAgain: e.target.value
		});
	}

	saveForm() {
		let operationId = super.saveForm();

		let permissions = this.props.store.permissions;
		let resources = this.state.current.valuesResources.map(resource => {
			return _.find(permissions, permission => resource === permission.key).type
		});
		let user = {
			id: this.props.selectorValue,
			name: this.state.current.valuesName,
			email: this.state.current.valuesEmail,
			password: this.state.current.valuesPassword,
			phone: this.state.current.valuesPhone,

			permissions: resources,

			users: {
				read: this.state.current.valuesUsersRead,
				update: this.state.current.valuesUsersUpdate,
				delete: this.state.current.valuesUsersDelete
			},

			groups: {
				read: this.state.current.valuesGroupsRead,
				update: this.state.current.valuesGroupsUpdate,
				delete: this.state.current.valuesGroupsDelete
			}
		};

		ActionCreator.updateUser(operationId, user);
	}

	deleteObject(key) {
		ActionCreator.deleteUser(this.instance, key);
		if (key == this.props.selectorValue) {
			ActionCreator.closeScreen(this.props.screenKey); //todo close after confirmed
		}
	}

	render() {
		let ret = null;

		if(this.state.built) {
			ret = (
				<div>
					<div className="frame-input-wrapper required">
						<label className="container">
							E-mail (Login)
							<Input
								type="text"
								name="email"
								placeholder=" "
								value={this.state.current.valuesEmail}
								onChange={this.onChangeEmail.bind(this)}
							/>
						</label>
					</div>
					
					<div className="frame-input-wrapper required">
						<label className="container">
							Name
							<Input
								type="text"
								name="name"
								placeholder=" "
								value={this.state.current.valuesName}
								onChange={this.onChangeName.bind(this)}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper required">
						<label className="container">
							Phone
							<Input
								type="text"
								name="phone"
								placeholder=" "
								value={this.state.current.valuesPhone}
								onChange={this.onChangePhone.bind(this)}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper required">
						<label className="container">
							Password
							<Input
								type="password"
								name="password"
								placeholder=" "
								value={this.state.current.valuesPassword}
								onChange={this.onChangePassword.bind(this)}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper required">
						<label className="container">
							Password (repeat)
							<Input
								type="password"
								name="passwordAgain"
								placeholder=" "
								value={this.state.current.valuesPasswordAgain}
								onChange={this.onChangePasswordAgain.bind(this)}
							/>
						</label>
					</div>

					<div><h2>Permissions for creation of types</h2></div>
					<div className="frame-input-wrapper">
						<label className="container">
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeMultiple.bind(this, "valuesResources", ObjectTypes.PERMISSIONS)}
								options={this.props.store.permissions}
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
							Users with permission to see this user
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeMultiple.bind(this, "valuesUsersRead", ObjectTypes.USERS)}
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
							Users with permission to update this user
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeMultiple.bind(this, "valuesUsersUpdate", ObjectTypes.USERS)}
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
							Users with permission to delete this user
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeMultiple.bind(this, "valuesUsersDelete", ObjectTypes.USERS)}
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
							Groups with permission to see this user
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeMultiple.bind(this, "valuesGroupsRead", ObjectTypes.GROUPS)}
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
							Groups with permission to update this user
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeMultiple.bind(this, "valuesGroupsUpdate", ObjectTypes.GROUPS)}
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
							Groups with permission to delete this user
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangeMultiple.bind(this, "valuesGroupsDelete", ObjectTypes.GROUPS)}
								options={this.props.store.groups}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuesGroupsDelete}
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
				</div>
			);
		}

		return ret;
	}
}

export default ConfigPermissionsUser;
