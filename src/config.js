/**
 * CONFIG LOGIC - NOT FOR CONFIGURATION VALUES
 */

import _ from 'lodash';

/**
 * DEFAULT VALUES (fallback)
 * Used if not specified in rewrites.
 */
import defaults from './config/defaults';
/**
 * CONFIG PROPER
 * Per-instance values, development values & features.
 */
import rewrites from './config/rewrites';


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

let config = _.merge({}, defaults, rewrites, methods);
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
export const allowDuplication = config.allowDuplication;
export const allowInvitation = config.allowInvitation;
