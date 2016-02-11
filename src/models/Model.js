import _ from 'underscore';

class Model {
	/**
	 * returns promise of this model.
	 */
	constructor(options,data) {
		if(data){
			var self = this;
			var resolvePromise = this.resolveForLocal(data); // todo do we ever need both options and data?
			this.ready = new Promise(function(resolve,reject){
				resolvePromise.then(function(opts){
					_.assign(self,opts);
					resolve();
				});
			});
		} else {
			_.assign(this,options);
			this.ready = Promise.resolve();
		}
	}

	/**
	 * Prepare promise for all the properties, which are actual domain objects.
	 * @param data Object with data from the API.
	 * @param model Optional - model for resolving nested objects
	 * @param self Optional - this (for nested)
	 */
	resolveForLocal(data, model, self) {
		//var self = this;
		var ret = {};
		var promises = [];
		if(!self){
			self = this;
		}
		if(!model) {
			model = self.data();
		}
		_.each(model, function (keyProps, key) {
			if (keyProps.isArrayOfNested) {
				if(data[keyProps.serverName]) {
					let nestedPromises = [];
					for (var nested of data[keyProps.serverName]) {
						let nestedPromise = self.resolveForLocal(nested, model[key].model, self);
						nestedPromises.push(nestedPromise);
					}
					Promise.all(nestedPromises).then(function(arrayOfNested){
						ret[key] = arrayOfNested;
					});
					promises.push(Promise.all(nestedPromises));
				} else {
					ret[key] = [];
				}
			//}	else if (keyProps.isNested) {
			//	let nestedPromise = self.resolveForLocal(data[keyProps.serverName], model[key].model, self);
			//	nestedPromise.then(function(transformedNestedData){
			//		self[key] = transformedNestedData;
			//	});
			//	promises.push(nestedPromise);
			} else {
				if (keyProps.isPromise) {
					let promise = keyProps.transformForLocal(data[keyProps.serverName]);
					promise.then(function(transformedData){
						ret[key] = transformedData;
					});
					promises.push(promise);
				} else {
					if (keyProps.transformForLocal) {
						ret[key] = keyProps.transformForLocal(data[keyProps.serverName]);
					} else {
						ret[key] = data[keyProps.serverName];
					}
				}
			}

		});

		return new Promise(function (resolve, reject) {
			Promise.all(promises).then(function(){
				resolve(ret);
			})
		});
	}

	/**
	 * Transform self for server
	 */
	serialize() {
		var serializedObject = {};
		var model = this.data();
		_.each(this, function (value, key) {
			if(key!=="ready" && model[key].sendToServer) {
				if(model[key].hasOwnProperty("isArrayOfNested") && model[key].isArrayOfNested){
					//value = value.serialize();
					for(var modelIndex in value){
						value[modelIndex].attribute = value[modelIndex].attribute.key;
					}
				}else if(model[key].hasOwnProperty("transformForServer")){
					value = model[key].transformForServer(value);
				}
				key = model[key].serverName;
				serializedObject[key] = value;
			}
		});
		//console.log("serializedObject",serializedObject);
		return serializedObject;
	}

	// todo static?
	transformDate(dateString) {
		return Date(dateString);
	}

	getKey(model) {
		return (model) ? model.key : null;
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
