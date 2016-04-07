import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import StyleModel from '../models/StyleModel';

//import UserStore from './UserStore';
import TopicStore from './TopicStore';


class StyleStore extends Store {

	getApiUrl(){
		return "/rest/symbology";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
		this.changeListener.add(TopicStore);
	}

	getInstance(options,data){
		return new StyleModel(options,data);
	}
}

let storeInstance = new StyleStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.STYLE_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.STYLE_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
