import _ from 'underscore';

class Model {
	/**
	 * returns promise of this model.
	 */
	constructor(options,data) {
		if(data){
			return this.resolveForLocal(data); // todo do we ever need both options and data?
		}
		_.assign(this,options);
	}

	/**
	 * Prepare promise for all the properties, which are actual domain objects.
	 * @param data Object with data from the API.
	 */
	resolveForLocal(data) {
		var self = this;
		var promises = [];
		_.each(self.data(), function (value, key) {
			var internalKey = key;
			if (value.isPromise) {
				//if (value.isArray) {
				//	self[internalKey] = value.transformForLocal({id: data[value.serverName]});
				//} else {
				//	self[internalKey] = value.transformForLocal(data[value.serverName]);
				//}
				let promise = value.transformForLocal(data[value.serverName]);
				promise.then(function(transformedData){
					self[internalKey] = transformedData;
				});
				promises.push(promise);
			} else {
				if (value.transformForLocal) {
					self[internalKey] = value.transformForLocal(data[value.serverName]);
				} else {
					self[internalKey] = data[value.serverName];
				}
			}
		});

		return Promise.all(promises);
	}

	/**
	 * Transform self for server
	 */
	serialize() {
		var serializedObject = {};
		var model = this.data();
		_.each(this, function (value, key) {
			if(model[key].sendToServer) {
				if(model[key].hasOwnProperty("transformForServer")){
					value = model[key].transformForServer(value);
				}
				key = model[key].serverName;
				serializedObject[key] = value;
			}
		});
		return serializedObject;
	}

	// todo static?
	transformDate(dateString) {
		return Date(dateString);
	}

	getKey(model) {
		return model.key;
	}

	getKeys(models) {
		let keys = [];
		for (model of models) {
			keys.push(model.key);
		}
		return keys;
	}

}

export default Model;
