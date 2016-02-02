import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import ObjectRelationModel from '../models/ObjectRelationModel';

class ObjectRelationStore extends Store {

	getApiUrl(){
		return "/rest/layerref";
	}
	getInstance(data){
		return new ObjectRelationModel(data);
	}

	getByDataSource(dataSourceKey){
		// cannot search in isPromise fields
		return this.getFiltered({dataSourceString: dataSourceKey});
	}
}

let storeInstance = new ObjectRelationStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.OBJECT_RELATION_CREATE:
			console.log("ObjectRelationStore OBJECT_RELATION_CREATE action");
			storeInstance.create(action.objectData);
			// todo something like this:
			// let req = storeInstance.create(action.objectData);
			//req.then(function(whateverRequestReturns){
			//	storeInstance.load();
			//	storeInstance.emitChange(); // ??
			//});
			break;
		case ActionTypes.OBJECT_RELATION_UPDATE:
			console.log("ObjectRelationStore OBJECT_RELATION_UPDATE action");
			storeInstance.update(action.objectData);
			break;
		case ActionTypes.OBJECT_RELATION_DELETE:
			console.log("ObjectRelationStore OBJECT_RELATION_DELETE action");
			storeInstance.delete(action.objectData);
			break;
		case ActionTypes.OBJECT_RELATION_HANDLE:
			console.log("ObjectRelationStore OBJECT_RELATION_HANDLE action");
			storeInstance.handle(action.actionData);
			break;
		default:
			return;
	}

	//storeInstance.emitChange();

});

export default storeInstance;
