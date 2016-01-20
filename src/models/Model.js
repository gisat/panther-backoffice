class Model {
	/**
	 * returns promise of this model.
	 */
	constructor(options) {
		return this.resolveForLocal(options.data);
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
				if (value.isArray) {
					self[internalKey] = value.transformForLocal({id: data[value.serverName]});
				} else {
					self[internalKey] = value.transformForLocal(data[value.serverName]);
				}

				promises.push(self[internalKey]);
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

	transformDate(dateString) {
		return Date(dateString);
	}

}

export default Model;
