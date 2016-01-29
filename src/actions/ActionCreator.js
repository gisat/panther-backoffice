import AppDispatcher from '../dispatcher/AppDispatcher'
import ActionTypes from '../constants/ActionTypes'
import ObjectTypes from '../constants/ObjectTypes'

export default {

	createObjectAndSetState: function(objectData,objectType,stateKey,stateHash) {
		var action = {
			type: null,
			objectData: objectData,
			stateKey: stateKey,
			stateHash: stateHash
		};
		switch (objectType) {
			case ObjectTypes.PERIOD:
				action.type = ActionTypes.PERIOD_CREATE;
				break;
			default:
				return;
		}
		AppDispatcher.dispatch(action);
	},

	createObject: function(objectData,objectType) {
		var action = {
			type: null,
			objectData: objectData
		};
		console.log("ActionCreator createObject()");
		switch (objectType) {
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_CREATE;
				console.log("action type",action.type);
				break;
			default:
				return;
		}
		AppDispatcher.dispatch(action);
	},

	updateObject: function(objectData,objectType) {
		var action = {
			type: null,
			objectData: objectData
		};
		console.log("ActionCreator updateObject()");
		switch (objectType) {
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_UPDATE;
				console.log("action type",action.type);
				break;
			default:
				return;
		}
		AppDispatcher.dispatch(action);
	},

	deleteObject: function(objectData,objectType) {
		var action = {
			type: null,
			objectData: objectData
		};
		console.log("ActionCreator deleteObject()");
		switch (objectType) {
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_DELETE;
				console.log("action type",action.type);
				break;
			default:
				return;
		}
		AppDispatcher.dispatch(action);
	}

};
