import _ from 'underscore';

import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import utils from '../../../utils/utils';
import ActionCreator from '../../../actions/ActionCreator';
import UIObjectSelect from '../../atoms/UIObjectSelect';

import UserStore from '../../../stores/UserStore';
import GroupStore from '../../../stores/GroupStore';

import UserModel from '../../../models/UserModel';
import GroupModel from '../../../models/GroupModel';

let initialState = {
	valuesResources: []
};

class ConfigPermissionsUser extends ControllerComponent {
	static propTypes = {
		disabled: React.PropTypes.bool,
		store: PropTypes.shape({
			users: PropTypes.arrayOf(PropTypes.instanceOf(UserModel)),
			groups: PropTypes.arrayOf(PropTypes.instanceOf(GroupModel))
		}).isRequired,
		selectorValue: React.PropTypes.any
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
					valuesResources: []
				};
				user.permissions.forEach(permission => {
					if(permission.permission == 'POST') {
						nextState.valuesResources.push(permission.resourceType);
					}
				});
			}
		}
		return nextState;
	}

	onChangePermissions(value, values) {
		let current = this.state.current.valuesResources;
		let newOnes = _.pluck(values, 'key');
		let user = _.findWhere(this.props.store.users, {key: this.props.selectorValue});

		if(current.length < newOnes.length) {
			let toAdd = _.difference(newOnes, current);
			toAdd.forEach(resourceType => {
				ActionCreator.addPermissionUser(this.instance, user.key, {
					resourceType: resourceType,
					resourceId: null,
					permission: 'POST'
				});
			});
		} else if(current.length > newOnes.length) {
			let toRemove = _.difference(current, newOnes);
			toRemove.forEach(resourceType => {
				ActionCreator.removePermissionFromUser(this.instance, user.key, {
					resourceType: resourceType,
					resourceId: null,
					permission: 'POST'
				});
			});
		} else {
			console.log('This should never happen');
		}
	}

	componentDidMount() {
		super.componentDidMount();

		this.responseListener.add(UserStore);
		this.responseListener.add(GroupStore);
		this.errorListener.add(UserStore);
		this.errorListener.add(GroupStore);
	}

	render() {
		let options = [{
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

		return (
			<div>
				<div><h2>Permissions for creation of types</h2></div>
				<div className="frame-input-wrapper">
					<label className="container">
						<UIObjectSelect
							multi
							className="template"
							onChange={this.onChangePermissions.bind(this)}
							options={options}
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.current.valuesResources}
						/>
					</label>
				</div>
			</div>
		);
	}
}

export default ConfigPermissionsUser;
