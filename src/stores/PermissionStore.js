import logger from "../core/Logger";

import superagent from 'superagent';

import config from '../config';

import AppDispatcher from "../dispatcher/AppDispatcher";
import ActionTypes from "../constants/ActionTypes";

/**
 * This class provides available types of permissions. By type we mean stuff such as topic.
 */
class PermissionStore {
	constructor() {
		this.permissions = [
			{
				key: 'permissions-dataset',
				type: 'dataset',
				name: 'Scope'
			}, {
				key: 'permissions-location',
				type: 'location',
				name: 'Place'
			}, {
				key: 'permissions-topic',
				type: 'topic',
				name: 'Topic'
			}, {
				key: 'permissions-layer_wms',
				type: 'layer_wms',
				name: 'Custom WMS Layers'
			}, {
				key: 'permissions-group',
				type: 'group',
				name: 'Group'
			},
			{
				key: 'permission-user',
				type: 'user',
				name: 'User'
			},
			{
				key: 'permission-view',
				type: 'dataview',
				name: 'View'
			},
			{
				key: 'permission-lpis-case',
				type: 'lpis_case',
				name: 'LPIS Case'
			},
			{
				key: 'permission-scenario',
				type: 'scenario',
				name: 'Scenario'
			},
			{
				key: 'permission-scenario-case',
				type: 'scenario_case',
				name: 'Scenario case'
			},
			{
				key: 'permission-attributeset',
				type: 'attributeset',
				name: 'Attribute set'
			},
			{
				key: 'permission-layer',
				type: 'layer',
				name: 'Layer'
			},
			{
				key: 'permission-attribute',
				type: 'attribute',
				name: 'Attribute'
			},
			{
				key: 'permission-areatemplate',
				type: 'areatemplate',
				name: 'Layer templates'
			},
			{
				key: 'permission-theme',
				type: 'theme',
				name: 'Theme'
			},
			{
				key: 'permission-analysis',
				type: 'analysis',
				name: 'Analysis'
			},
			{
				key: 'permission-layergroup',
				type: 'layergroup',
				name: 'Layer group'
			},
			{
				key: 'permission-period',
				type: 'year',
				name: 'Period'
			},
			{
				key: 'permission-spatial-relation',
				type: 'spatial_relation',
				name: 'Spatial relation'
			},
			{
				key: 'permission-permission',
				type: 'permission',
				name: 'Permission'
			}
		]
	}

	getByType(type) {
		return this.permissions.filter(permission => permission.type === type)[0];
	}

	getAll() {
		return this.permissions;
	}

	getFiltered() {
		return this.permissions;
	}

	addPermissionUser(userId, permission) {
		return this.postRequest(userId, undefined, permission);
	}

	removePermissionUser(userId, permission) {
		return this.deleteRequest(userId, undefined, permission)
	}

	addPermissionGroup(groupId, permission) {
		return this.postRequest(undefined, groupId, permission);
	}

	removePermissionGroup(groupId, permission) {
		return this.deleteRequest(undefined, groupId, permission);
	}

	postRequest(userId, groupId, permission) {
		return superagent
			.post(`${config.apiProtocol}${config.apiHost}${config.apiPath}/rest/permission`)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.send({
				data: {
					resource_id: String(permission.resourceId),
					resource_type: permission.resourceType,
					permission: permission.permission,
					user_id: userId,
					group_id: groupId
				}
			})
			.then((result) => {
				return result;
			})
	}

	deleteRequest(userId, groupId, permission) {
		return superagent
			.delete(`${config.apiProtocol}${config.apiHost}${config.apiPath}/rest/permission`)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.send({
				data: {
					resource_id: String(permission.resourceId),
					resource_type: permission.resourceType,
					permission: permission.permission,
					user_id: userId,
					group_id: groupId
				}
			})
			.then((result) => {
				return result;
			})
	}
}

let storeInstance = new PermissionStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	switch (action.type) {
		case ActionTypes.USER_ADD_PERMISSION:
			storeInstance.addPermissionUser(action.data.userId, action.data.permission);
			break;
		case ActionTypes.USER_REMOVE_PERMISSION:
			storeInstance.removePermissionUser(action.data.userId, action.data.permission);
			break;
		case ActionTypes.GROUP_ADD_PERMISSION:
			storeInstance.addPermissionGroup(action.data.groupId, action.data.permission);
			break;
		case ActionTypes.GROUP_REMOVE_PERMISSION:
			storeInstance.removePermissionGroup(action.data.groupId, action.data.permission);
			break;
	}
});

export default storeInstance;
