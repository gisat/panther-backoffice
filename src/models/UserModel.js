/**
 * Created by jbalhar on 30. 3. 2016.
 */
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
	superagent("POST", url)
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
