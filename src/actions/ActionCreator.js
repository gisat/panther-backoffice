import AppDispatcher from '../dispatcher/AppDispatcher'
import ActionTypes from '../constants/ActionTypes'
import ObjectTypes from '../constants/ObjectTypes'
import logger from '../core/Logger'

let actionCreator = {

	createObjectAndRespond: function(model,objectType,responseData,stateHash,instanceId) {
		var action = {
			type: null,
			model: model,
			responseData: responseData,
			stateHash: stateHash,
			instanceId: instanceId
		};
		logger.trace("ActionCreator# createObjectAndRespond(), Object type:", objectType, ", model: ", model);
		let actionType = objectType+"_CREATE_RESPOND";
		if(ActionTypes[actionType]) {
			action.type = ActionTypes[actionType];
			AppDispatcher.dispatch(action);
		} else {
			logger.error("ActionCreator# createObjectAndRespond(), Unknown action types",actionType);
		}
		//switch (objectType) {
		//	case ObjectTypes.SCOPE:
		//		action.type = ActionTypes.SCOPE_CREATE_RESPOND;
		//		break;
		//	case ObjectTypes.PERIOD:
		//		action.type = ActionTypes.PERIOD_CREATE_RESPOND;
		//		break;
		//}
		//AppDispatcher.dispatch(action);
	},

	createObject: function(model,objectType) {
		var action = {
			type: null,
			model: model
		};
		logger.trace("ActionCreator# createObject(), Object type:", objectType);
		switch (objectType) {
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_CREATE;
				break;
			default:
				return;
		}
		AppDispatcher.dispatch(action);
	},

	updateObject: function(model,objectType) {
		var action = {
			type: null,
			model: model
		};
		logger.trace("ActionCreator# updateObject(), Object type:", objectType);
		switch (objectType) {
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_UPDATE;
				break;
			default:
				return;
		}
		AppDispatcher.dispatch(action);
	},

	deleteObject: function(model,objectType) {
		var action = {
			type: null,
			model: model
		};
		logger.trace("ActionCreator# deleteObject(), Object type:", objectType);
		switch (objectType) {
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_DELETE;
				break;
			default:
				return;
		}
		AppDispatcher.dispatch(action);
	},

	handleObjects: function(data, objectType, operationId) {
		var action = {
			type: null,
			data: data,
			operationId: operationId
		};
		logger.trace("ActionCreator# handleObjects(), Object type:", objectType);
		switch (objectType) {
			case ObjectTypes.SCOPE:
				action.type = ActionTypes.SCOPE_HANDLE;
				break;
			case ObjectTypes.PLACE:
				action.type = ActionTypes.PLACE_HANDLE;
				break;
			case ObjectTypes.PERIOD:
				action.type = ActionTypes.PERIOD_HANDLE;
				break;
			case ObjectTypes.VECTOR_LAYER_TEMPLATE:
				action.type = ActionTypes.VECTOR_LAYER_TEMPLATE_HANDLE;
				break;
			case ObjectTypes.RASTER_LAYER_TEMPLATE:
				action.type = ActionTypes.RASTER_LAYER_TEMPLATE_HANDLE;
				break;
			case ObjectTypes.AU_LEVEL:
				action.type = ActionTypes.AU_LEVEL_HANDLE;
				break;
			case ObjectTypes.ATTRIBUTE:
				action.type = ActionTypes.ATTRIBUTE_HANDLE;
				break;
			case ObjectTypes.ATTRIBUTE_SET:
				action.type = ActionTypes.ATTRIBUTE_SET_HANDLE;
				break;
			case ObjectTypes.TOPIC:
				action.type = ActionTypes.TOPIC_HANDLE;
				break;
			case ObjectTypes.THEME:
				action.type = ActionTypes.THEME_HANDLE;
				break;
			case ObjectTypes.LAYER_GROUP:
				action.type = ActionTypes.LAYER_GROUP_HANDLE;
				break;
			case ObjectTypes.STYLE:
				action.type = ActionTypes.STYLE_HANDLE;
				break;
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_HANDLE;
				break;
			case ObjectTypes.ANALYSIS_SPATIAL:
				action.type = ActionTypes.ANALYSIS_SPATIAL_HANDLE;
				break;
			case ObjectTypes.ANALYSIS_LEVEL:
				action.type = ActionTypes.ANALYSIS_LEVEL_HANDLE;
				break;
			case ObjectTypes.ANALYSIS_MATH:
				action.type = ActionTypes.ANALYSIS_MATH_HANDLE;
				break;
			case ObjectTypes.ANALYSIS_RUN:
				action.type = ActionTypes.ANALYSIS_RUN_HANDLE;
				break;
			default:
				return;
		}
		AppDispatcher.dispatch(action);
	},


	createOpenScreen(screenKey, screenSetKey, options, responseData, responseHash) {
		var action = {
			type: ActionTypes.SCREEN_CREATE_OPEN,
			screenKey: screenKey,
			screenSetKey: screenSetKey,
			options: options,
			resposeData: responseData,
			responseHash: responseHash
		};
		AppDispatcher.dispatch(action);
	},

	openScreen(screenKey, data) {
		data = data || {};
		var action = {
			type: ActionTypes.SCREEN_OPEN,
			screenKey: screenKey,
			data: data
		};
		AppDispatcher.dispatch(action);
	},

	retractScreen(screenKey) {
		var action = {
			type: ActionTypes.SCREEN_RETRACT,
			screenKey: screenKey
		};
		AppDispatcher.dispatch(action);
	},

	closeScreen(screenKey) {
		var action = {
			type: ActionTypes.SCREEN_CLOSE,
			screenKey: screenKey
		};
		AppDispatcher.dispatch(action);
	},

	logScreenActivity(screenKey) {
		var action = {
			type: ActionTypes.SCREEN_LOG_ACTIVITY,
			screenKey: screenKey
		};
		AppDispatcher.dispatch(action);
	},

	addOperation(id, operation) {
		var action = {
			type: ActionTypes.ADD_OPERATION,
			id: id,
			operation: operation
		};
		AppDispatcher.dispatch(action);
	},

	removeOperation(id) {
		var action = {
			type: ActionTypes.REMOVE_OPERATION,
			id: id
		};
		AppDispatcher.dispatch(action);
	},

	addGroup(operationId, name){
		let action = {
			type: ActionTypes.GROUP_ADD,
			data: {
				name: name,
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	updateGroup(operationId, groupId, name) {
		let action = {
			type: ActionTypes.GROUP_UPDATE,
			data: {
				name: name,
				id: groupId,
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	loadGroups(operationId) {
		let action = {
			type: ActionTypes.GROUP_LOAD,
			data: {
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	deleteGroup(operationId, groupId) {
		let action = {
			type: ActionTypes.GROUP_DELETE,
			data: {
				id: groupId,
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	addMemberToGroup(operationId, groupId, userId) {
		let action = {
			type: ActionTypes.GROUP_ADD_MEMBER,
			data: {
				groupId: groupId,
				userId: userId,
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	removeMemberFromGroup(operationId, groupId, userId) {
		let action = {
			type: ActionTypes.GROUP_REMOVE_MEMBER,
			data: {
				groupId: groupId,
				userId: userId,
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	addPermission(operationId, groupId, permission) {
		let action = {
			type: ActionTypes.GROUP_ADD_PERMISSION,
			data: {
				groupId: groupId,
				permission: permission,
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	removePermission(operationId, groupId, permission) {
		let action = {
			type: ActionTypes.GROUP_REMOVE_PERMISSION,
			data: {
				groupId: groupId,
				permission: permission,
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	loadUsers(operationId) {
		let action = {
			type: ActionTypes.USER_LOAD,
			data: {
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	addPermissionUser(operationId, userId, permission) {
		let action = {
			type: ActionTypes.USER_ADD_PERMISSION,
			data: {
				userId: userId,
				permission: permission,
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	removePermissionFromUser(operationId, userId, permission) {
		let action = {
			type: ActionTypes.USER_REMOVE_PERMISSION,
			data: {
				userId: userId,
				permission: permission,
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	login(username, password, operationId) {
		let action = {
			type: ActionTypes.LOGIN,
			data: {
				username: username,
				password: password,
				operationId: operationId
			}
		};
		AppDispatcher.dispatch(action);
	},

	logout(operationId) {
		let action = {
			type: ActionTypes.LOGOUT,
			operationId: operationId
		};
		AppDispatcher.dispatch(action);
	},

	duplicateLayer(name, newName) {
		let action = {
			type: ActionTypes.DUPLICATE_LAYER,
			data: {
				name: name,
				newName: newName
			}
		};
		AppDispatcher.dispatch(action);
	}
};


export default actionCreator;
