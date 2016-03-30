import superagent from 'superagent';
import path from 'path';

import { publicPath, apiProtocol, apiHost} from '../config';

class User {
	constructor() {
		this.logged = false;
	}

	isLogged() {
		return this.logged;
	}

	login() {
		this.logged = true;
	}
}

let logged = new User();
console.log(logged);
export default logged;

export function login(username, password, callback) {
	superagent("POST", apiProtocol + apiHost + path.resolve(publicPath, "/api/login/login"))
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
				console.log(res);
				// ssid
				// sessionid
				// csrftoken
				logged.login();
				console.log(logged);
				callback({
					success: res
				});
			}
		});
}
