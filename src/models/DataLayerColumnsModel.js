import Model from './Model';

class DataLayerColumnsModel extends Model {

	resolveForLocal(data) {
		return new Promise(function (resolve, reject) {
			//OpenaLyers is imported in html (/src/components/Html/Html.js) due to absence of npm in version 2
			//todo upgrade to OpenLayers 3 - it has different api for Format
			var format = new OpenLayers.Format.WFSDescribeFeatureType();
			data = format.read(data);
			if(!data.hasOwnProperty("featureTypes") || !data.featureTypes.length) {
				resolve([]);
				// Don't continue.
				return;
			}
			if(!data.featureTypes[0].hasOwnProperty("properties")) {
				reject("featureTypes[0] has no properties in WFS response");
			}
			let columns = data.featureTypes[0].properties;
			resolve(columns);
		});
	}
}

export default DataLayerColumnsModel;
