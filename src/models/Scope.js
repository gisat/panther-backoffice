define([
	'../api/DataSource',
	'./Model'
], function (DataSource,
						 Model) {
	/**
	 *
	 * @param scopeData
	 * @constructor
	 * @augments Model
	 */
	var Scope = function (scopeData) {
		Model.apply(this, arguments);
	};

	Scope.prototype = Object.create(Model.prototype);

	Scope.prototype.data = function () {
		return {
			key: {
				serverName: '_id' //number
			},
			name: {
				serverName: 'name' //string
			},
			active: {
				serverName: 'active' //boolean
			},
			changed: {
				serverName: 'changed', //date
				transformForLocal: function () {
					Scope.transformDate.apply(this, arguments)
				}
			},
			changedBy: {
				serverName: 'changedBy', //id
				transformForLocal: function (options) {
					return DataSource.retrieve('user').filter(options)
				},
				isPromise: true
			},
			created: {
				serverName: 'created', //date
				transformForLocal: function () {
					Scope.transformDate.apply(this, arguments)
				}
			},
			createdBy: {
				serverName: 'createdBy', //id
				transformForLocal: function (options) {
					return DataSource.retrieve('user').filter(options)
				},
				isPromise: true
			},
			levels: {
				serverName: 'featureLayers', //ids
				transformForLocal: function (options) {
					return DataSource.retrieve('noIdeaIfLocalOrServerNameHere').filter(options)
				},
				isPromise: true,
				isArray: true
			}
		};
	};

	// todo move outside of Scope (universal)
	Scope.transformDate = function (dateString) {
		return Date(dateString);
	};

	return Scope;
});
