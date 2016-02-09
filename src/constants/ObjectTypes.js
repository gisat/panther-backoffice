import keyMirror from 'fbjs/lib/keyMirror';

import ScopeModel from '../models/ScopeModel';
import PlaceModel from '../models/PlaceModel';
import PeriodModel from '../models/PeriodModel';
import VectorLayerModel from '../models/VectorLayerModel';
import RasterLayerModel from '../models/RasterLayerModel';
import AULevelModel from '../models/AULevelModel';
import AttributeModel from '../models/AttributeModel';
import AttributeSetModel from '../models/AttributeSetModel';
//import TopicModel from '../models/TopicModel';
//import ThemeModel from '../models/ThemeModel';
//import LayerGroupModel from '../models/LayerGroupModel';
//import StyleModel from '../models/StyleModel';
import ObjectRelationModel from '../models/ObjectRelationModel';

export const model = {
	SCOPE: ScopeModel,
	PLACE: PlaceModel,
	PERIOD: PeriodModel,
	VECTOR_LAYER_TEMPLATE: VectorLayerModel,
	RASTER_LAYER_TEMPLATE: RasterLayerModel,
	AU_LEVEL: AULevelModel,
	ATTRIBUTE: AttributeModel,
	ATTRIBUTE_SET: AttributeSetModel,
	//TOPIC: TopicModel,
	//THEME: ThemeModel,
	//LAYER_GROUP: LayerGroupModel,
	//STYLE: StyleModel,
	OBJECT_RELATION: ObjectRelationModel
};

export default keyMirror(model);

//export default keyMirror({
//	SCOPE: null,
//	PLACE: null,
//	PERIOD: null,
//	VECTOR_LAYER_TEMPLATE: null,
//	RASTER_LAYER_TEMPLATE: null,
//	AU_LEVEL: null,
//	ATTRIBUTE: null,
//	ATTRIBUTE_SET: null,
//	TOPIC: null,
//	THEME: null,
//	LAYER_GROUP: null,
//	STYLE: null,
//	OBJECT_RELATION: null
//});
