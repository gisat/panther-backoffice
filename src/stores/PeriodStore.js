import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import PeriodModel from '../models/PeriodModel';


class PeriodStore extends Store {

	getApiUrl(){
		return "/rest/year";
	}
	getInstance(data){
		return new PeriodModel(data);
	}

	createObject(objectData,responseStateKey,responseStateHash) {
		//console.log("PeriodStore createObject objectData",objectData);
		// todo ? Model.resolveForServer ?
		var object = {
			name: objectData.name,
			active: false
		};

		this.create(object);

		storeInstance.emit(EventTypes.OBJECT_CREATED,responseStateKey,responseStateHash);
	}

}

let storeInstance = new PeriodStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.PERIOD_CREATE:
			//console.log("PeriodStore PERIOD_CREATE action");
			storeInstance.createObject(action.objectData, action.stateKey, action.stateHash);
			break;
		default:
			return;
	}

	//storeInstance.emitChange();

});

export default storeInstance;
