import Model from './Model';

class DataLayerColumnsModel extends Model {

	resolveForLocal(data) {
		return new Promise(function (resolve, reject) {
			var format = new OpenLayers.Format.WFSDescribeFeatureType();
			data = format.read(data);
			if(!data.hasOwnProperty("featureTypes") || !data.featureTypes.length) resolve([]);
			if(!data.featureTypes[0].hasOwnProperty("properties")) reject("featureTypes[0] has no properties in WFS response");
			let columns = data.featureTypes[0].properties;
			resolve(columns);
		});
	}
}

export default DataLayerColumnsModel;
