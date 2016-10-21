import superagent from 'superagent';
import path from 'path';
import EventEmitter from 'events';
import EventTypes from '../constants/EventTypes';

import { apiPath, apiProtocol, apiHost} from '../config';

class User extends EventEmitter {
	constructor() {
		super();
		this.logged = false;
	}

	isLogged() {
		return this.logged;
	}

	login() {
		this.logged = true;
		this.emit(EventTypes.USER_LOGGED_IN);
	}

	addLoginListener(callback) {
		this.on(EventTypes.USER_LOGGED_IN, callback);
	}

	removeLoginListener(callback) {
		this.removeListener(EventTypes.USER_LOGGED_IN, callback);
	}
}

let logged = new User();
export default logged;

export function login(username, password, callback) {
	superagent("POST", apiProtocol + apiHost + path.join(apiPath, "/api/login/login"))
		.send({
			username: username,
			password: password
		})
		.withCredentials()
		.set('Access-Control-Allow-Origin', 'true')
		.set('Accept', 'application/json')
		.set('Access-Control-Allow-Credentials', 'true')
		.end(function(err, res){
			if(err) {
				callback({
					err: err
				});
			} else {
				// ssid
				// sessionid
				// csrftoken
				logged.login();
				callback({
					success: res
				});
			}
		});
}
