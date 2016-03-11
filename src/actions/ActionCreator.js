import AppDispatcher from '../dispatcher/AppDispatcher'
import ActionTypes from '../constants/ActionTypes'
import ObjectTypes from '../constants/ObjectTypes'

export default {

	createObjectAndRespond: function(model,objectType,responseData,stateHash) {
		var action = {
			type: null,
			model: model,
			responseData: responseData,
			stateHash: stateHash
		};
		let actionType = objectType+"_CREATE_RESPOND";
		if(ActionTypes[actionType]) {
			action.type = ActionTypes[actionType];
			AppDispatcher.dispatch(action);
		} else {
			console.error("UNKNOWN ACTION TYPE",actionType);
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
		//console.log("ActionCreator createObject()");
		switch (objectType) {
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_CREATE;
				//console.log("action type",action.type);
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
		//console.log("ActionCreator updateObject()");
		switch (objectType) {
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_UPDATE;
				//console.log("action type",action.type);
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
		//console.log("ActionCreator deleteObject()");
		switch (objectType) {
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_DELETE;
				//console.log("action type",action.type);
				break;
			default:
				return;
		}
		AppDispatcher.dispatch(action);
	},

	handleObjects: function(data,objectType) {
		var action = {
			type: null,
			data: data
		};
		//console.log("ActionCreator handleObjects()");
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
	}

};
