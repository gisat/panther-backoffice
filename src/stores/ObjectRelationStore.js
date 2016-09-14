import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import ObjectRelationModel from '../models/ObjectRelationModel';

//import UserStore from './UserStore';
import GeneralLayerStore from './GeneralLayerStore';
import AttributeSetStore from './AttributeSetStore';
//import DataLayerStore from './DataLayerStore';
import PlaceStore from './PlaceStore';
import PeriodStore from './PeriodStore';
import AttributeStore from './AttributeStore';
import AnalysisRunStore from './AnalysisRunStore';

import logger from '../core/Logger';

class ObjectRelationStore extends ApiStore {

	getApiUrl(){
		return "/rest/layerref";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
		this.changeListener.add(GeneralLayerStore);
		this.changeListener.add(AttributeSetStore);
		//this.changeListener.add(DataLayerStore); // loop - todo solve
		this.changeListener.add(PlaceStore);
		this.changeListener.add(PeriodStore);
		this.changeListener.add(AttributeStore);
		this.changeListener.add(AnalysisRunStore);
	}

	getInstance(options,data){
		return new ObjectRelationModel(options,data);
	}

	getByDataSource(dataSourceKey){
		// cannot search in isPromise fields
		return this.getFiltered({dataSourceString: dataSourceKey});
	}
}

let storeInstance = new ObjectRelationStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	logger.info("ObjectRelationStore# dispatchToken(), Action:", action);

	switch(action.type) {
		case ActionTypes.OBJECT_RELATION_CREATE:
			storeInstance.create(action.model);
			// todo something like this:
			// let req = storeInstance.create(action.objectData);
			//req.then(function(whateverRequestReturns){
			//	storeInstance.load();
			//	storeInstance.emitChange(); // ??
			//});
			break;
		case ActionTypes.OBJECT_RELATION_UPDATE:
			storeInstance.update(action.model);
			break;
		case ActionTypes.OBJECT_RELATION_DELETE:
			storeInstance.delete(action.model);
			break;
		case ActionTypes.OBJECT_RELATION_HANDLE:
			//storeInstance.handle(action.data);
			storeInstance.handle(action.data, action.operationId);
			break;
		default:
			return;
	}

});

export default storeInstance;
