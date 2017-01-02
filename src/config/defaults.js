/**
 * DEFAULT CONFIG VALUES FOR ALL INSTANCES
 *
 * Default values only.
 * Do not use this file for development, per-instance config, etc.
 */

export default {

	googleAnalyticsId: 'UA-XXXXX-X',

	// todo documentation
	// don't forget leading slash. like this: /backoffice
	publicPath: "/backoffice",
	serverPort: 5000,

	/**
	 * backend API config
	 */
	apiProtocol: "http://",
	apiHost: "localhost", //host + port
	apiPath: "/backend",

	/**
	 * other Panther components' location
	 */
	//address: host + port + base path
	geonodeProtocol: "http://",
	geonodeAddress: "localhost",

	geoserverProtocol: "http://",
	geoserverAddress: "localhost/geoserver",

	frontOfficeProtocol: "http://",
	frontOfficeAddress: "localhost",
	frontOfficeExplorationPath: "tool/",


	/**
	 * Logger
	 */
	// 0 means TRACE and higher. Use when you want to see all messages.
	// 1 means INFO and higher
	// 2 means WARN and higher
	// 3 means ERROR only
	// 4 means nothing from our application will be displayed. This should be default for production use.
	// Any other or none means INFO as this is default logging level.
	loggingLevel: 4,


	/**
	 * Data models - types & properties
	 *
	 * DO NOT DISABLE OLD (PRE-2016) PROPERTIES
	 * the system is not yet ready for that
	 */
	models: {
		common: {
			key: true,
			name: true,
			active: true,
			changed: true,
			changedBy: true,
			created: true,
			createdBy: true,
			scope: false
		},
		SCOPE: {
			levels: true,
			periods: true
		},
		PLACE: {
			scope: true,
			boundingBox: true,
			center: true,
			description: false,
			geometry: false
		},
		PERIOD: {
			date: false
		},
		VECTOR_LAYER_TEMPLATE: {
			layerType: true,
			layerGroup: true,
			styles: true,
			topic: true,
			attributeSets: true
		},
		RASTER_LAYER_TEMPLATE: {
			layerType: true,
			layerGroup: true,
			styles: true,
			topic: true,
			justVisualization: true
		},
		AU_LEVEL: {
			layerType: true,
			layerGroup: true,
			styles: true,
			topic: true
		},
		ATTRIBUTE: {
			type: true,
			code: true,
			standardUnits: true,
			customUnits: true,
			color: true,
			description: false
		},
		ATTRIBUTE_SET: {
			attributes: true,
			vectorLayers: true,
			topic: true,
			description: false
		},
		TOPIC: {
			requiresFullRef: true
		},
		THEME: {
			scope: true,
			periods: true,
			topics: true,
			topicsPreferential: true,
			visualizations: true
		},
		LAYER_GROUP: {
			order: true
		},
		STYLE: {
			source: true,
			serverName: true,
			definition: true
		},
		OBJECT_RELATION: {
			layerObject: true,
			attributeSet: true,
			isOfAttributeSet: true,
			dataSource: true,
			dataSourceString: true,
			dataSourceOrigin: true,
			place: true,
			placeKey: true,
			period: true,
			implicit: true,
			fidColumn: true,
			nameColumn: true,
			parentColumn: true,
			columnMap: true
		},
		ANALYSIS: {
			active: false,
			analysisType: true,
			layerObject: true,
			attributeSet: true,
			attributeSets: true,
			filterAttribute: true,
			filterAttributeSet: true,
			useSum: true,
			attributeMap: true
		},
		ANALYSIS_RUN: {
			active: false,
			finished: true,
			analysis: true,
			scope: true,
			place: true,
			period: true,
			levels: true,
			status: true
		}
	},

};
