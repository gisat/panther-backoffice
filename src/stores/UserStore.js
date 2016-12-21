import path from 'path';
import superagent from 'superagent';

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

import logger from '../core/Logger';
import { apiProtocol, apiHost, apiPath } from '../config';
import Store from './Store';
import UserModel from '../models/UserModel';

class UserStore extends Store {
	constructor() {
		super();

		this.cache = null;
		this.userUrl = this.urlFor('/rest/user');
		this.permissionUserUrl = this.urlFor('/rest/permission/user');
		this.loginUrl = this.urlFor('/api/login/login');

		this.logged = null;
		this.loginListeners = [];
	}

	urlFor(serverPath) {
		return apiProtocol + apiHost + path.join(apiPath, serverPath).replace(/\\/g, "/");
	}

	load(){
		if(!this.cache) {
			return this.reload();
		} else {
			return Promise.resolve(this.cache);
		}
	}

	reload() {
		return superagent
			.get(this.userUrl)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(response => {
				this.cache = response.body.data.map(user => new UserModel(null, user));
				logger.info('UserStore#reload Loaded users: ', this.cache);
				return this.cache;
			}).catch(err => {
				logger.error('UserStore#reload Error: ',err);
			});
	}

	addPermission(groupId, permission) {
		return superagent
			.post(this.permissionUserUrl)
			.send({groupId: groupId, resourceType: permission.resourceType, resourceId: permission.resourceId, permission: permission.permission})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(() => {
				logger.info('UserStore#reload Permission added');
				return this.reload();
			}).catch(err => {
				logger.error('UserStore#reload Error: ',err);
			});
	}

	removePermission(groupId, permission) {
		return superagent
			.delete(this.permissionUserUrl)
			.send({groupId: groupId, resourceType: permission.resourceType, resourceId: permission.resourceId, permission: permission.permission})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(() => {
				logger.info('UserStore#removePermission Permission removed');
				return this.reload();
			}).catch(err => {
				logger.error('UserStore#reload Error: ',err);
			});
	}

	login(username, password) {
		return superagent
			.post(this.loginUrl)
			.send({
				username: username,
				password: password
			})
			.withCredentials()
			.set('Access-Control-Allow-Origin', 'true')
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(() => {
				return superagent
					.get(this.urlFor('/rest/logged'))
					.withCredentials()
					.set('Access-Control-Allow-Origin', 'true')
					.set('Accept', 'application/json')
					.set('Access-Control-Allow-Credentials', 'true');
			}).then((response) => {
				this.logged = new UserModel(null, response.body);
				this.loginListeners.forEach((listener) => {
					listener(this.logged);
				});
				// TODO: Store in cookie.
				return this.logged;
		})
	}

	byId(id) {
		return this.load().then(all => {
			return all.filter(user => user.id == id);
		});
	}

	all() {
		return this.load();
	}

	loggedIn() {
		return this.logged;
	}

	addLoginListener(loginFunction) {
		this.loginListeners.push(loginFunction);
	}
}
let storeInstance = new UserStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	switch(action.type) {
		case ActionTypes.USER_LOAD:
			storeInstance.load();
			break;
		case ActionTypes.USER_ADD_PERMISSION:
			storeInstance.addPermission(action.data.userId, action.data.permission);
			break;
		case ActionTypes.USER_REMOVE_PERMISSION:
			storeInstance.removePermission(action.data.userId, action.data.permission);
			break;
		case ActionTypes.LOGIN:
			storeInstance.login(action.data.username, action.data.password);
			break;
	}
});

export default storeInstance;
