import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import ThemeModel from '../models/ThemeModel';

//import UserStore from './UserStore';
import ScopeStore from './ScopeStore';
import PeriodStore from './PeriodStore';
import TopicStore from './TopicStore';
import logger from '../core/Logger';

class ThemeStore extends ApiStore {

	getApiUrl(){
		return "/rest/theme";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
		this.changeListener.add(ScopeStore);
		this.changeListener.add(PeriodStore);
		this.changeListener.add(TopicStore);
	}

	getInstance(options,data){
		return new ThemeModel(options,data);
	}
}

let storeInstance = new ThemeStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	logger.trace("ThemeStore# received(), Action: ", action);

	switch(action.type) {
		case ActionTypes.THEME_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.THEME_HANDLE:
			storeInstance.handle(action.data, action.operationId);
			break;
		default:
			return;
	}

});

export default storeInstance;
