import AppDispatcher from '../dispatcher/AppDispatcher'
import ActionTypes from '../constants/ActionTypes'
import ObjectTypes from '../constants/ObjectTypes'
import logger from '../core/Logger'

export default {

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

	addGroup(name){
		let action = {
			type: ActionTypes.GROUP_ADD,
			data: {
				name: name
			}
		};
		AppDispatcher.dispatch(action);
	},

	loadGroups() {
		let action = {
			type: ActionTypes.GROUP_LOAD
		};
		AppDispatcher.dispatch(action);
	},

	deleteGroup(groupId) {
		let action = {
			type: ActionTypes.GROUP_DELETE,
			data: {
				id: groupId
			}
		};
		AppDispatcher.dispatch(action);
	},

	addMemberToGroup(groupId, userId) {
		let action = {
			type: ActionTypes.GROUP_ADD_MEMBER,
			data: {
				groupId: groupId,
				userId: userId
			}
		};
		AppDispatcher.dispatch(action);
	},

	removeMemberFromGroup(groupId, userId) {
		let action = {
			type: ActionTypes.GROUP_REMOVE_MEMBER,
			data: {
				groupId: groupId,
				userId: userId
			}
		};
		AppDispatcher.dispatch(action);
	},

	addPermission(groupId, permission) {
		let action = {
			type: ActionTypes.GROUP_ADD_PERMISSION,
			data: {
				groupId: groupId,
				permission: permission
			}
		};
		AppDispatcher.dispatch(action);
	},

	removePermission(groupId, permission) {
		let action = {
			type: ActionTypes.GROUP_REMOVE_PERMISSION,
			data: {
				groupId: groupId,
				permission: permission
			}
		};
		AppDispatcher.dispatch(action);
	},

	loadUsers() {
		let action = {
			type: ActionTypes.USER_LOAD
		};
		AppDispatcher.dispatch(action);
	},

	addPermissionUser(userId, permission) {
		let action = {
			type: ActionTypes.USER_ADD_PERMISSION,
			data: {
				userId: userId,
				permission: permission
			}
		};
		AppDispatcher.dispatch(action);
	},

	removePermissionFromUser(userId, permission) {
		let action = {
			type: ActionTypes.USER_REMOVE_PERMISSION,
			data: {
				userId: userId,
				permission: permission
			}
		};
		AppDispatcher.dispatch(action);
	},

	login(username, password, id) {
		let action = {
			type: ActionTypes.LOGIN,
			data: {
				username: username,
				password: password,
				id: id
			}
		};
		AppDispatcher.dispatch(action);
	}
};
