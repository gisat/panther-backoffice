/**
 * CONFIG
 *
 * Per-instance values, development values & features.
 * Versions/variants managed in github.com/gisat/docker/
 */
import _ from 'underscore';

/**
 * DEFAULT VALUES (fallback)
 * Used if not specified in rewrites.
 */
import defaults from './configDefaults';

/**
 * CONFIG
 */
let rewrites = {

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

/**
 * getter
 * todo review usage
 */
let methods = {
	get: function(key) {
		if (rewrites.hasOwnProperty(key)) {
			return rewrites[key];
		}
		else if (defaults.hasOwnProperty(key)) {
			// log use of default?
			return defaults[key];
		}
		else {
			throw 'Invalid config key requested';
		}
	}
};

let config = _.assign({}, defaults, rewrites, methods);
export default config;


/**
 * legacy exports - to be removed
 */
export const googleAnalyticsId = config.googleAnalyticsId;
export const publicPath = config.publicPath;
export const serverPort = config.serverPort;
export const apiProtocol = config.apiProtocol;
export const apiHost = config.apiHost;
export const apiPath = config.apiPath;
export const geonodeProtocol = config.geonodeProtocol;
export const geonodeAddress = config.geonodeAddress;
export const geoserverProtocol = config.geoserverProtocol;
export const geoserverAddress = config.geoserverAddress;
export const frontOfficeProtocol = config.frontOfficeProtocol;
export const frontOfficeAddress = config.frontOfficeAddress;
export const frontOfficeExplorationPath = config.frontOfficeExplorationPath;
export const loggingLevel = config.loggingLevel;
