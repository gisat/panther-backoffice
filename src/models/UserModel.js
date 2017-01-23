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
			name: {
				serverName: 'username',
				sendToServer: true
			},
			permissions: {
				serverName: 'permissions',
				sendToServer: false
			}
		}
	}
}

export default UserModel;
