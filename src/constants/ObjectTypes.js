import keyMirror from 'fbjs/lib/keyMirror';

import ScopeModel from '../models/ScopeModel';
import PlaceModel from '../models/PlaceModel';
import PeriodModel from '../models/PeriodModel';
import VectorLayerModel from '../models/VectorLayerModel';
import RasterLayerModel from '../models/RasterLayerModel';
import AULevelModel from '../models/AULevelModel';
import AttributeModel from '../models/AttributeModel';
import AttributeSetModel from '../models/AttributeSetModel';
import TopicModel from '../models/TopicModel';
import ThemeModel from '../models/ThemeModel';
import LayerGroupModel from '../models/LayerGroupModel';
import StyleModel from '../models/StyleModel';
import ObjectRelationModel from '../models/ObjectRelationModel';

import ScopeStore from '../stores/ScopeStore';
import PlaceStore from '../stores/PlaceStore';
import PeriodStore from '../stores/PeriodStore';
import VectorLayerStore from '../stores/VectorLayerStore';
import RasterLayerStore from '../stores/RasterLayerStore';
import AULevelStore from '../stores/AULevelStore';
import GeneralLayerStore from '../stores/GeneralLayerStore';
import AttributeStore from '../stores/AttributeStore';
import AttributeSetStore from '../stores/AttributeSetStore';
import TopicStore from '../stores/TopicStore';
import ThemeStore from '../stores/ThemeStore';
import LayerGroupStore from '../stores/LayerGroupStore';
import StyleStore from '../stores/StyleStore';
import ObjectRelationStore from '../stores/ObjectRelationStore';

export const Store = {
	SCOPE: ScopeStore,
	PLACE: PlaceStore,
	PERIOD: PeriodStore,
	VECTOR_LAYER_TEMPLATE: VectorLayerStore,
	RASTER_LAYER_TEMPLATE: RasterLayerStore,
	AU_LEVEL: AULevelStore,
	GENERAL_LAYER: GeneralLayerStore,
	ATTRIBUTE: AttributeStore,
	ATTRIBUTE_SET: AttributeSetStore,
	TOPIC: TopicStore,
	THEME: ThemeStore,
	LAYER_GROUP: LayerGroupStore,
	STYLE: StyleStore,
	OBJECT_RELATION: ObjectRelationStore
};

export const Model = {
	SCOPE: ScopeModel,
	PLACE: PlaceModel,
	PERIOD: PeriodModel,
	VECTOR_LAYER_TEMPLATE: VectorLayerModel,
	RASTER_LAYER_TEMPLATE: RasterLayerModel,
	AU_LEVEL: AULevelModel,
	GENERAL_LAYER: null,
	ATTRIBUTE: AttributeModel,
	ATTRIBUTE_SET: AttributeSetModel,
	TOPIC: TopicModel,
	THEME: ThemeModel,
	LAYER_GROUP: LayerGroupModel,
	STYLE: StyleModel,
	OBJECT_RELATION: ObjectRelationModel
};

export default keyMirror(Model);

export const objectTypesMetadata = {
	SCOPE: {
		name: "Scope",
		url: "scope"
	},
	PLACE: {
		name: "Place",
		url: "place"
	},
	PERIOD: {
		name: "Imaging/reference period",
		url: "period"
	},
	VECTOR_LAYER_TEMPLATE: {
		name: "Vector layer",
		url: "vector-layer",
		isTemplate: true
	},
	RASTER_LAYER_TEMPLATE: {
		name: "Raster layer",
		url: "raster-layer",
		isTemplate: true
	},
	AU_LEVEL: {
		name: "Analytical units level",
		url: "au-level",
		isTemplate: true
	},
	GENERAL_LAYER: {
		name: null,
		url: null
	},
	ATTRIBUTE: {
		name: "Attribute",
		url: "attribute",
		isTemplate: true
	},
	ATTRIBUTE_SET: {
		name: "Attribute set",
		url: "attribute-set",
		isTemplate: true
	},
	TOPIC: {
		name: "Topic",
		url: "topic"
	},
	THEME: {
		name: "Theme",
		url: "theme"
	},
	LAYER_GROUP: {
		name: "Layer group",
		url: "layer-group"
	},
	STYLE: {
		name: "Style",
		url: "style"
	},
	OBJECT_RELATION: {
		name: null,
		url: null
	}
};
