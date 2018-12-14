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
		this.responseListeners = [];
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

	// TODO: This shouldn't work
	reload(operationId) {
		let models = [];
		return superagent
			.get(this.groupUrl)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(response => {
				models = response.body.data.map(group => new GroupModel(null, group));
				return Promise.all(models.map(model => model.ready));
			}).then(() => {
				this.cache = models;
				logger.info('GroupStore#reload Loaded groups: ', this.cache);
				this.emitChange();
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

	update(groupId, group, operationId) {
		logger.info('GroupStore#update Update group started');
		let response;
		return superagent
			.put(this.groupUrl + '/' + groupId)
			.send({group: group})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(pResponse => {
				response = pResponse;
				logger.info('GroupStore#update Group Updates. Body: ', response.body);
				return this.reload(operationId);
			}).then(() => {
				this.emitChange();
				return response;
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('GroupStore#update Error: ',err);
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

	addResponseListener(responseFunction) {
		this.responseListeners.push(responseFunction);
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
		case ActionTypes.GROUP_UPDATE:
			storeInstance.update(action.data.id, action.data.group, action.data.operationId);
			break;
		case ActionTypes.GROUP_DELETE:
			storeInstance.delete(action.data.id, action.data.operationId);
			break;
	}
});

export default storeInstance;
