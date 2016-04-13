import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import AttributeSetModel from '../models/AttributeSetModel';

//import UserStore from './UserStore';
import AttributeStore from './AttributeStore';
import VectorLayerStore from './VectorLayerStore';
import TopicStore from './TopicStore';


class AttributeSetStore extends Store {

	getApiUrl(){
		return "/rest/attributeset";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
		this.changeListener.add(AttributeStore);
		this.changeListener.add(VectorLayerStore);
		this.changeListener.add(TopicStore);
	}

	getInstance(options,data){
		return new AttributeSetModel(options,data);
	}
}

let storeInstance = new AttributeSetStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.ATTRIBUTE_SET_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.ATTRIBUTE_SET_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
