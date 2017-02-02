import keyMirror from 'fbjs/lib/keyMirror';

import WmsStore from '../stores/WmsStore';
import GeonodeStore from '../stores/GeonodeStore';

import WmsLayerModel from '../models/WmsLayerModel';
import GeonodeLayerModel from '../models/GeonodeLayerModel';

export const Store = {
	WMS_LAYER: WmsStore,
	GEONODE_LAYER: GeonodeStore
};

export const Model = {
	WMS_LAYER: WmsLayerModel,
	GEONODE_LAYER: GeonodeLayerModel
};

export default keyMirror(Model);

export const objectTypesMetadata = {
	GEONODE_LAYER: {
		name: "Geonode Layer",
		url: "geonode_layer"
	},
	WMS_LAYER: {
		name: "WMS Layer",
		url: "wms_layer"
	}
};
