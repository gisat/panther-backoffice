import Model from './Model';

class DataLayerColumnsModel extends Model {

	resolveForLocal(data) {
		return new Promise(function (resolve, reject) {
			resolve(data);
		});
	}
}

export default DataLayerColumnsModel;
