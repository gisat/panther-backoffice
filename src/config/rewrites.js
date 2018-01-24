/**
 * CONFIG
 *
 * Per-instance values, development values & features.
 * See documentation in ./defaults.js
 * Versions/variants managed in github.com/gisat/docker/
 */

export default {
	publicPath: "/",

	apiHost: "localhost:4000",
	apiPath: "/",

	geonodeProtocol: "http://",
	geonodeAddress: "10.0.75.2",

	geoserverProtocol: "http://",
	geoserverAddress: "10.0.75.2/geoserver",

	frontOfficeProtocol: "http://",
	frontOfficeAddress: "10.0.75.2",
	frontOfficeExplorationPath: "tool/",

	baseUrl: "http://localhost:5000"

};
