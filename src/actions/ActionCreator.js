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
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_HANDLE;
				//console.log("action type",action.type);
				break;
			case ObjectTypes.PERIOD:
				action.type = ActionTypes.PERIOD_HANDLE;
				//console.log("action type",action.type);
				break;
			default:
				return;
		}
		AppDispatcher.dispatch(action);
	}

};
