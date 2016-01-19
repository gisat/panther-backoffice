define([], function () {
	/**
	 * It returns promise of this model.
	 * @constructor
	 */
	var Model = function (options) {
		return this.resolve(options.data);
	};

	// todo rename
	/**
	 * Prepare promise for all the properties, which are actual domain objects.
	 * @param data Object with data from the API.
	 */
	Model.prototype.resolve = function (data) {
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
	};

	return Model;
});
