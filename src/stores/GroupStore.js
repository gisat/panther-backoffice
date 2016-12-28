import path from 'path';
import superagent from 'superagent';

import AppDispatcher from '../dispatcher/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import ActionTypes from '../constants/ActionTypes';

import logger from '../core/Logger';
import { apiProtocol, apiHost, apiPath } from '../config';
import GroupModel from '../models/GroupModel';
import Store from './Store';

class GroupStore extends Store {
	constructor() {
		super();

		this.cache = null;
		this.groupUrl = this.urlFor('/rest/group');
		this.membersUrl = this.urlFor('/rest/member/group');
		this.permissionGroupUrl = this.urlFor('/rest/permission/group');
	}

	urlFor(serverPath) {
		return apiProtocol + apiHost + path.join(apiPath, serverPath).replace(/\\/g, "/");
	}

	load(operationId) {
		if(!this.cache) {
			return this.reload(operationId);
		} else {
			return Promise.resolve(this.cache);
		}
	}

	reload(operationId) {
		return superagent
			.get(this.groupUrl)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(response => {
				this.cache = response.body.data.map(group => new GroupModel(null, group));
				logger.info('GroupStore#reload Loaded groups: ', this.cache);
				this.emitChange();
				console.log(this.cache);
				return this.cache;
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('GroupStore#reload Error: ',err);
			});
	}

	add(name, operationId) {
		logger.info('GroupStore#add Add group started');
		let response;
		return superagent
			.post(this.groupUrl)
			.send({name: name})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(pResponse => {
				response = pResponse;
				logger.info('GroupStore#add Group Added. Body: ', response.body);
				return this.reload(operationId);
			}).then(() => {
				return response;
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('GroupStore#add Error: ',err);
			});
	}

	delete(groupId, operationId) {
		logger.info('GroupStore#delete Delete group started');
		return superagent
			.delete(this.groupUrl + '/' + groupId)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(response => {
				logger.info('GroupStore#delete Group Deleted. Body: ', response.body);
				return this.reload(operationId);
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('GroupStore#delete Error: ',err);
			});
	}

	addMember(groupId, userId, operationId) {
		logger.info('GroupStore#addMember Add member to group started');
		return superagent
			.post(this.membersUrl)
			.send({groupId: groupId, userId: userId})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(response => {
				logger.info('GroupStore#addMember Add member to group deleted. Body: ', response.body);
				return this.reload(operationId);
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('GroupStore#addMember Error: ',err);
			});
	}

	removeMember(groupId, userId, operationId) {
		logger.info('GroupStore#removeMember Remove member from group started');
		return superagent
			.delete(this.membersUrl)
			.send({groupId: groupId, userId: userId})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(response => {
				logger.info('GroupStore#removeMember Member removed from the group. Body: ', response.body);
				return this.reload(operationId);
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('GroupStore#removeMember Error: ',err);
			});
	}

	addPermission(groupId, permission, operationId) {
		logger.info('GroupStore#addPermission Add permission to group started.');
		return superagent
			.post(this.permissionGroupUrl)
			.send({groupId: groupId, resourceType: permission.resourceType, resourceId: permission.resourceId, permission: permission.permission})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(response => {
				logger.info('GroupStore#addPermission Add permission to group finished. Body: ', response.body);
				return this.reload(operationId);
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('GroupStore#addPermission Error: ',err);
			});
	}

	removePermission(groupId, permission, operationId) {
		logger.info('GroupStore#removePermission Remove permission from group started');
		return superagent
			.delete(this.permissionGroupUrl)
			.send({groupId: groupId, resourceType: permission.resourceType, resourceId: permission.resourceId, permission: permission.permission})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(response => {
				logger.info('GroupStore#removePermission Remove permission from group finished. Body: ', response.body);
				return this.reload(operationId);
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('GroupStore#removePermission Error: ',err);
			});
	}

	all() {
		return this.load();
	}

	byId(id) {
		return this.load().then(all => {
			return all.filter(group => group.id == id);
		});
	}

	getFiltered() {
		return this.load();
	}

	getAll() {
		return this.all();
	}
}

let storeInstance = new GroupStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	switch(action.type) {
		case ActionTypes.GROUP_CREATE_RESPOND:
			storeInstance.add(action.model.name || '', action.instanceId).then(group => {
				let groupModel = new GroupModel(null, group);
				storeInstance.emit(EventTypes.OBJECT_CREATED,groupModel,action.responseData,action.stateHash, action.instanceId);
			});
			break;
		case ActionTypes.GROUP_LOAD:
			storeInstance.load(action.data.operationId);
			break;
		case ActionTypes.GROUP_ADD:
			storeInstance.add(action.data.name, action.data.operationId);
			break;
		case ActionTypes.GROUP_DELETE:
			storeInstance.delete(action.data.id, action.data.operationId);
			break;
		case ActionTypes.GROUP_ADD_MEMBER:
			storeInstance.addMember(action.data.groupId, action.data.userId, action.data.operationId);
			break;
		case ActionTypes.GROUP_REMOVE_MEMBER:
			storeInstance.removeMember(action.data.groupId, action.data.userId, action.data.operationId);
			break;
		case ActionTypes.GROUP_ADD_PERMISSION:
			storeInstance.addPermission(action.data.groupId, action.data.permission, action.data.operationId);
			break;
		case ActionTypes.GROUP_REMOVE_PERMISSION:
			storeInstance.removePermission(action.data.groupId, action.data.permission, action.data.operationId);
			break;
	}
});

export default storeInstance;
