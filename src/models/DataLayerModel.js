import Model from './Model';


class DataLayerModel extends Model {

	constructor(options) {
		super(options);

	}

	data() {
		return {
			key: {
				serverName: 'name' //string
			},
			referenced: {
				serverName: 'referenced' //boolean
			}
			// todo ? layerref data ?
		};
	}

}

export default DataLayerModel;
