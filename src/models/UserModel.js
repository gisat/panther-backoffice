import ObjectTypes from '../constants/ObjectTypes';
import Model from './Model';
import UserStore from '../stores/UserStore';
import GroupStore from '../stores/GroupStore';

class UserModel extends Model {
	getType() {
		return ObjectTypes.USER;
	}

	data() {
		return {
			key: {
				serverName: '_id',
				sendToServer: true
			},
			username: {
				serverName: 'username',
				sendToServer: true
			},
			name: {
				serverName: 'username', //for now copy username
				sendToServer: false
			},
			permissions: {
				serverName: 'permissions',
				sendToServer: false
			}
		}
	}
}

export default UserModel;
