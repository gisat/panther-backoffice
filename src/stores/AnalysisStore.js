import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import AnalysisModel from '../models/AnalysisModel';

//import UserStore from './UserStore';
import TopicStore from './TopicStore';
import GeneralLayerStore from './GeneralLayerStore';
import AttributeSetStore from './AttributeSetStore';
import AttributeStore from './AttributeStore';


class AnalysisStore extends Store {

	getApiUrl(){
		return "/rest/analysis";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
		this.changeListener.add(TopicStore);
		this.changeListener.add(GeneralLayerStore);
		this.changeListener.add(AttributeSetStore);
		this.changeListener.add(AttributeStore);
	}

	getInstance(options,data){
		return new AnalysisModel(options,data);
	}

}

let storeInstance = new AnalysisStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.ANALYSIS_SPATIAL_CREATE_RESPOND:
		case ActionTypes.ANALYSIS_LEVEL_CREATE_RESPOND:
		case ActionTypes.ANALYSIS_MATH_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.ANALYSIS_SPATIAL_HANDLE:
		case ActionTypes.ANALYSIS_LEVEL_HANDLE:
		case ActionTypes.ANALYSIS_MATH_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

	//storeInstance.emitChange();

});

export default storeInstance;
