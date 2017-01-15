import keyMirror from 'fbjs/lib/keyMirror';

import WmsStore from '../stores/WmsStore';
import GeonodeStore from '../stores/GeonodeStore';



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
	OBJECT_RELATION: ObjectRelationStore,
	ANALYSIS: AnalysisStore,
	ANALYSIS_SPATIAL: AnalysisStore,
	ANALYSIS_LEVEL: AnalysisStore,
	ANALYSIS_MATH: AnalysisStore,
	ANALYSIS_RUN: AnalysisRunStore,
	GROUP: GroupStore,
	USER: UserStore
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
	OBJECT_RELATION: ObjectRelationModel,
	ANALYSIS: AnalysisModel,
	ANALYSIS_SPATIAL: AnalysisModel,
	ANALYSIS_LEVEL: AnalysisModel,
	ANALYSIS_MATH: AnalysisModel,
	ANALYSIS_RUN: AnalysisRunModel,
	GROUP: GroupModel,
	USER: UserModel
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
	},
	ANALYSIS: {
		name: null,
		url: null
	},
	ANALYSIS_SPATIAL: {
		name: "Spatial",
		url: "spatial"
	},
	ANALYSIS_LEVEL: {
		name: "Level aggregation",
		url: "level-aggregation"
	},
	ANALYSIS_MATH: {
		name: "Math",
		url: "math"
	},
	ANALYSIS_RUN: {
		name: null,
		url: null
	},
	USER: {
		name: "User",
		url: "user"
	},
	GROUP: {
		name: "Group",
		url: "group"
	}
};
