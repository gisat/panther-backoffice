import AppDispatcher from '../dispatcher/AppDispatcher'
import ActionTypes from '../constants/ActionTypes'

export default {

	createPeriodAndSetState: function(objectData,stateKey) {
		AppDispatcher.dispatch({
			type: ActionTypes.PERIOD_CREATE,
			objectData: objectData,
			stateKey: stateKey
		});
	}

};
