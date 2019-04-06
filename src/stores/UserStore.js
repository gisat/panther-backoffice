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
import GroupModel from "../models/GroupModel";

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

	async load(operationId) {
		if (!this.cache) {
			return this.reload(operationId);
		} else {
			return Promise.resolve(this.cache);
		}
	}

	async reload(operationId) {
		this.cache = new Promise(() => {});
		return superagent
			.get(this.userUrl)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(response => {
				this.cache = response.body.data.map(user => new UserModel(null, user));
				logger.info('UserStore#reload Loaded users: ', this.cache);
				this.emitChange();
				return this.cache;
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('UserStore#reload Error: ', err);
			});
	}

	login(username, password, operationId, callback) {
		if(!callback) {
			callback = function() {};
		}
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
				return this.getLogged().then((user) => {
					console.log('Retrieved user');
					callback(user);

					return user;
				});
			}).then(logged => {
				if(logged == null) {
					callback(null);
					return null;
				}

				callback(logged);
				return logged;
			}).catch(error => {
				logger.error('UserStore#login Error: ', error);
				callback(error);
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
				console.log(response);
				if (response.body._id == 0) {
					return null;
				}

				console.log(this.logged);
				let oldUserKey = this.logged && this.logged.key;
				this.logged = new UserModel(null, response.body);

				return this.logged.ready.then(() => {
					console.log(this.logged);
					if (this.logged.key != oldUserKey) {
						this.loginListeners.forEach((listener) => {
							listener(this.logged);
						});
					}

					return this.logged;
				});
			});
	}

	/**
	 * It mails invitation to the user with given email.
	 * @param email {String} Email of the user to send the email to.
	 * @param callback {Function} Function to be called back once the operation finishes.
	 */
	inviteUser(email, callback) {
		superagent
			.post(this.urlFor('/rest/invitation/user'))
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
	 * load invitation for hash
	 * @param hash {String} hash
	 * @param callback {Function} Function to be called back once the operation finishes.
	 */
	loadInvitation(hash, callback) {
		superagent
			.get(this.urlFor('/rest/invitation/user') + '/' + hash)
			.withCredentials()
			.set('Access-Control-Allow-Origin', 'true')
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(response => {
				callback({
					ok: response
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
	 * @param phone {String} Phone ot the new user
	 * @param password {String} Password of the new user. It will be hashed on the backend
	 * @param callback {Function} Function to be called when the operation finishes.
	 */
	createUser(hash, name, password, phone, callback) {
		superagent
			.post(this.urlFor('/rest/user'))
			.send({
				hash: hash,
				name: name,
				phone: phone,
				password: password
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

	updateUser(operationId, user) {
		let response;
		return superagent
			.put(this.urlFor('/rest/user'))
			.send(user)
			.withCredentials()
			.set('Access-Control-Allow-Origin', 'true')
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(pResponse => {
				response = pResponse;
				logger.info('GroupStore#update Group Updates. Body: ', response.body);
				return this.reload(operationId);
			}).then(() => {
				this.emitChange();
				return response;
			}).catch(error => {
				this.emitError(error, operationId);
				logger.error('UserStore#updateUser Error: ',err);
			})
	}

	deleteUser(operationId, id) {
		let response;
		return superagent
			.delete(this.urlFor('/rest/user'))
			.send({
				id: id
			})
			.withCredentials()
			.set('Access-Control-Allow-Origin', 'true')
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(pResponse => {
				response = pResponse;
				return this.reload(operationId);
			}).then(() => {
				this.emitChange();
				return response;
			})
			.catch(error => {
				this.emitError(error, operationId);
			})
	}

	async byId(id) {
		let models = await this.load();
		return _.find(models, {key: id});
	}

	all() {
		return this.load();
	}

	getFiltered() {
		return this.load();
	}

	getUpdatable() {
		return this.load().then(users => {
			let usersWithPermissions = [];
			if(this.logged){
				const userRelated = _.pluck(this.logged.permissions.filter(permission => permission.resourceType === 'user' &&
					(permission.permission === 'PUT' || permission.permission === 'DELETE')), 'resourceid');
				usersWithPermissions = users.filter(user => userRelated.indexOf(user.key) !== -1);
			}

			return usersWithPermissions;
		});
	}

	getAll() {
		return this.all();
	}

	loggedIn() {
		return this.logged;
	}

	async getCurrentUser() {
		//let logged = this.logged || await this.getLogged(); // would not respect outside logout
		return await this.getLogged();
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
		case ActionTypes.LOGIN:
			storeInstance.login(action.data.username, action.data.password, action.data.operationId, action.data.callback || function(){});
			break;
		case ActionTypes.LOGOUT:
			storeInstance.logout(action.operationId);
			break;
		case ActionTypes.INVITE_USER:
			storeInstance.inviteUser(action.data.email, action.data.callback);
			break;
		case ActionTypes.USER_LOAD_INVITATION:
			storeInstance.loadInvitation(action.data.hash, action.data.callback);
			break;
		case ActionTypes.CREATE_USER:
			storeInstance.createUser(action.data.hash, action.data.name, action.data.password, action.data.phone, action.data.callback);
			break;
		case ActionTypes.UPDATE_USER:
			storeInstance.updateUser(action.data.id, action.data.user);
			break;
		case ActionTypes.DELETE_USER:
			storeInstance.deleteUser(action.data.operationId, action.data.userId);
			break;
	}
});

export default storeInstance;
