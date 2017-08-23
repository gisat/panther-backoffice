import path from 'path';
import superagent from 'superagent';
import _ from 'lodash';

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';

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
		this.logoutUrl = this.urlFor('/api/login/logout');

		this.logged = null;
		this.loginListeners = [];
		this.responseListeners = [];
	}

	/**
	 * TOTALLY TEMPORARY until we update ListenerHandler to newer version - todo
	 * @param callback
	 */
	addLogoutListener(callback) {
		this.addEventListener(EventTypes.USER_LOGGED_OUT, callback);
	}
	removeLogoutListener(callback) {
		this.removeEventListener(EventTypes.USER_LOGGED_OUT, callback);
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

	logout(operationId) {
		return superagent
			.post(this.logoutUrl)
			.withCredentials()
			.set('Access-Control-Allow-Origin', 'true')
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(() => {
				this.logged = null;
				this.emit(EventTypes.USER_LOGGED_OUT);
			}).catch(error => {
				logger.error('UserStore#logout Error: ', error);
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
				let oldUserKey = this.logged && this.logged.key;
				this.logged = new UserModel(null, response.body);
				this.logged.ready.then(() => {
					if (this.logged.key != oldUserKey) {
						this.loginListeners.forEach((listener) => {
							listener(this.logged);
						});
					}
				});
				return this.logged;
			});
	}

	/**
	 * It mails invitation to the user with given email.
	 * @param email {String} Email of the user to send the email to.
	 * @param callback {Function} Function to be called back once the operation finishes.
	 */
	inviteUser(email, callback) {
		superagent
			.get(this.urlFor('/rest/invitation/user'))
			.send({
				email: email
			})
			.withCredentials()
			.set('Access-Control-Allow-Origin', 'true')
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(response => {
				callback({
					message: response
				});
			})
			.catch(error => {
				callback({
					error: error
				})
			})
	}

	/**
	 * It seriously creates new user on the server. The rights to do so are verified by the hash.
	 * @param hash {String} The valid hash is necessary in order to create the user.
	 * @param name {String} Name of the new user
	 * @param password {String} Password of the new user. It will be hashed on the backend
	 * @param username {String} Username used to log in the system.
	 * @param callback {Function} Function to be called when the operation finishes.
	 */
	createUser(hash, name, password, username, callback) {
		superagent
			.post(this.urlFor('/rest/user'))
			.send({
				hash: hash,
				name: name,
				password: password,
				username: username
			})
			.withCredentials()
			.set('Access-Control-Allow-Origin', 'true')
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(response => {
				callback({
					message: response
				});
			})
			.catch(error => {
				callback({
					error: error
				})
			})
	}

	updateUser(id, name, password, username, callback) {
		superagent
			.put(this.urlFor('/rest/user'))
			.send({
				id: id,
				name: name,
				password: password,
				username: username
			})
			.withCredentials()
			.set('Access-Control-Allow-Origin', 'true')
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(response => {
				callback({
					message: response
				});
			})
			.catch(error => {
				callback({
					error: error
				})
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
		case ActionTypes.LOGOUT:
			storeInstance.logout(action.operationId);
			break;
		case ActionTypes.INVITE_USER:
			storeInstance.inviteUser(action.data.email, action.data.callback);
			break;
		case ActionTypes.CREATE_USER:
			storeInstance.createUser(action.data.hash, action.data.name, action.data.password, action.data.username, action.data.callback);
			break;
		case ActionTypes.UPDATE_USER:
			storeInstance.updateUser(action.data.id, action.data.name, action.data.password, action.data.username, action.data.callback);
			break;
	}
});

export default storeInstance;
