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
		switch (objectType) {
			case ObjectTypes.OBJECT_RELATION:
				action.type = ActionTypes.OBJECT_RELATION_CREATE;
				break;
			default:
				return;
		}
		AppDispatcher.dispatch(action);
	}

};
