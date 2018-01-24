import ObjectTypes from '../constants/ObjectTypes';

/**
 * Static model. It is specific throughout the application and not loaded from the server.
 */
class PermissionModel {
	constructor(key, type, name){
		this._key = key;
		this._type = type;
		this._name = name;
	}

	getType(){
		return ObjectTypes.PERMISSION;
	}

	get key() {
		return this._key;
	}

	get type() {
		return this._type;
	}

	get name(){
		return this._name;
	}
}

export default PermissionModel;
