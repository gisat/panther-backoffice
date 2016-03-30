import superagent from 'superagent';
import path from 'path';

import { publicPath, apiProtocol, apiHost, apiPath} from '../config';

class User {

}

let logged = null;
export default User;

export function loggedUser(){
	return logged;
}

export function isLogged() {
	return logged != null;
}

export function login(username, password) {
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
			console.log(err);
			console.log(res);
		});
}
