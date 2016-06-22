/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

export const googleAnalyticsId = 'UA-XXXXX-X'; // edit this on deploy
export const publicPath = ""; ///// don't forget leading slash. like this: /backoffice
export const serverPort = 5555;

export const apiProtocol = "http://";
export const apiHost = "localhost:4000"; //host + port
export const apiPath = "/";

export const geonodeProtocol = "http://";
export const geonodeAddress = "localhost"; //address - host + port + base path

export const geoserverProtocol = "http://";
export const geoserverAddress = "localhost/geoserver"; //address - host + port + base path

export const frontOfficeProtocol = "http://";
export const frontOfficeAddress = "localhost"; //address - host + port + base path
export const frontOfficeExplorationPath = "tool/";

// 0 means TRACE and higher. Use when you want to see all messages.
// 1 means INFO and higher
// 2 means WARN and higher
// 3 means ERROR only
// 4 means nothing from our application will be displayed. This should be default for production use.
// Any other or none means INFO as this is default logging level.
export const loggingLevel = 0;
