import path from 'path';
import superagent from 'superagent';
import _ from 'lodash';

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

import logger from '../core/Logger';
import {apiProtocol, apiHost, apiPath} from '../config';
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
		this.responseListeners = [];
	}

	urlFor(serverPath) {
		return apiProtocol + apiHost + path.join(apiPath, serverPath).replace(/\\/g, "/");
	}

	load(operationId) {
		if (!this.cache) {
			return this.reload(operationId);
		} else {
			return Promise.resolve(this.cache);
		}
	}

	reload(operationId) {
		return superagent
			.get(this.userUrl)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(response => {
				let data = JSON.parse(response.body);
				this.cache = data.data.map(user => new UserModel(null, user));
				logger.info('UserStore#reload Loaded users: ', this.cache);
				this.emitChange();
				return this.cache;
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('UserStore#reload Error: ', err);
			});
	}

	addPermission(userId, permission, operationId) {
		return superagent
			.post(this.permissionUserUrl)
			.send({
				userId: userId,
				resourceType: permission.resourceType,
				resourceId: permission.resourceId,
				permission: permission.permission
			})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(() => {
				logger.info('UserStore#reload Permission added');
				return this.reload(operationId);
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('UserStore#reload Error: ', err);
			});
	}

	removePermission(userId, permission, operationId) {
		return superagent
			.delete(this.permissionUserUrl)
			.send({
				userId: userId,
				resourceType: permission.resourceType,
				resourceId: permission.resourceId,
				permission: permission.permission
			})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(() => {
				logger.info('UserStore#removePermission Permission removed');
				return this.reload(operationId);
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('UserStore#reload Error: ', err);
			});
	}

	login(username, password, operationId) {
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
				return this.getLogged();
			}).then(logged => {
				if(logged == null) {
					return null;
				}

				return logged;
			}).catch(error => {
				logger.error('UserStore#login Error: ', error);
				this.emitError(error, operationId);
			})
	}

	async getLogged() {
		return superagent
			.get(this.urlFor('/rest/logged'))
			.withCredentials()
			.set('Access-Control-Allow-Origin', 'true')
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Credentials', 'true')
			.then((response) => {
				if (response.body._id == 0) {
					return null;
				}
				this.logged = new UserModel(null, response.body);
				this.loginListeners.forEach((listener) => {
					listener(this.logged);
				});
				return this.logged;
			});
	}

	byId(id) {
		return this.load().then(all => {
			return all.filter(user => user.id == id);
		});
	}

	all() {
		return this.load();
	}

	getFiltered() {
		return this.load();
	}

	getAll() {
		return this.all();
	}

	loggedIn() {
		return this.logged;
	}

	async getCurrentUser() {
		//let logged = this.logged || await this.getLogged(); // would not respect outside logout
		let logged = await this.getLogged();
		if (logged) {
			let models = await this.load();
			return _.find(models, {key: logged.key});
		}
		return null;
	}

	addLoginListener(loginFunction) {
		this.loginListeners.push(loginFunction);
	}

	addResponseListener(responseFunction) {
		this.responseListeners.push(responseFunction);
	}
}

let storeInstance = new UserStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	switch (action.type) {
		case ActionTypes.USER_LOAD:
			storeInstance.load(action.data.operationId);
			break;
		case ActionTypes.USER_ADD_PERMISSION:
			storeInstance.addPermission(action.data.userId, action.data.permission, action.data.operationId);
			break;
		case ActionTypes.USER_REMOVE_PERMISSION:
			storeInstance.removePermission(action.data.userId, action.data.permission, action.data.operationId);
			break;
		case ActionTypes.LOGIN:
			storeInstance.login(action.data.username, action.data.password, action.data.operationId);
			break;
	}
});

export default storeInstance;
