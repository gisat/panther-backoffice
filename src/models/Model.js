import _ from 'underscore';

class Model {
	/**
	 * returns promise of this model.
	 */
	constructor(options) {
		return this.resolveForLocal(options);
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

	// todo static?
	transformDate(dateString) {
		return Date(dateString);
	}

}

export default Model;
