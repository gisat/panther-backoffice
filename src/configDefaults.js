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
	loggingLevel: 0,


	/**
	 * Data models - extra types or properties
	 */
	models: {
		place: {
			description: false
		}
	},

};
