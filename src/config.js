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

	loggingLevel: 0,

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
