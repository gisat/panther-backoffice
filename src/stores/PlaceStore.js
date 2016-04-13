import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import PlaceModel from '../models/PlaceModel';

//import UserStore from './UserStore';
import ScopeStore from './ScopeStore';


class PlaceStore extends Store {

	getApiUrl(){
		return "/rest/location";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
		this.changeListener.add(ScopeStore);
	}

	getInstance(options,data){
		return new PlaceModel(options,data);
	}
}

let storeInstance = new PlaceStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.PLACE_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.PLACE_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
