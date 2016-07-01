import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataObject.css';
import withStyles from '../../../decorators/withStyles';

import path from "path";

import utils from '../../../utils/utils';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import ActionCreator from '../../../actions/ActionCreator';

import AttributeSetStore from '../../../stores/AttributeSetStore';
import AttributeStore from '../../../stores/AttributeStore';
import AULevelStore from '../../../stores/AULevelStore';
import LayerGroupStore from '../../../stores/LayerGroupStore';
import ObjectRelationStore from '../../../stores/ObjectRelationStore';
import PeriodStore from '../../../stores/PeriodStore';
import PlaceStore from '../../../stores/PlaceStore';
import RasterLayerStore from '../../../stores/RasterLayerStore';
import ScopeStore from '../../../stores/ScopeStore';
import StyleStore from '../../../stores/StyleStore';
import ThemeStore from '../../../stores/ThemeStore';
import TopicStore from '../../../stores/TopicStore';
import VectorLayerStore from '../../../stores/VectorLayerStore';

import SelectorMetadataObject from '../../sections/SelectorMetadataObject';
import ConfigMetadataScope from '../../sections/ConfigMetadataScope';
import ConfigMetadataPlace from '../../sections/ConfigMetadataPlace';
import ConfigMetadataPeriod from '../../sections/ConfigMetadataPeriod';
import ConfigMetadataLayerVector from '../../sections/ConfigMetadataLayerVector';
import ConfigMetadataLayerRaster from '../../sections/ConfigMetadataLayerRaster';
import ConfigMetadataAULevel from '../../sections/ConfigMetadataAULevel';
import ConfigMetadataAttribute from '../../sections/ConfigMetadataAttribute';
import ConfigMetadataAttributeSet from '../../sections/ConfigMetadataAttributeSet';
import ConfigMetadataTopic from '../../sections/ConfigMetadataTopic';
import ConfigMetadataTheme from '../../sections/ConfigMetadataTheme';
import ConfigMetadataLayerGroup from '../../sections/ConfigMetadataLayerGroup';
import ConfigMetadataStyle from '../../sections/ConfigMetadataStyle';
import ListenerHandler from '../../../core/ListenerHandler';

import logger from '../../../core/Logger';
import ScreenController from "../../common/ScreenController";

import ScreenMetadataObjectController from "../ScreenMetadataObjectController";

@withStyles(styles)
class ScreenMetadataObject extends ScreenController {


	_getStoreLoads(props) {
		let storeloads = {};
		switch (props.data.objectType) {
			case ObjectTypes.SCOPE:
				storeloads = {
					//scope: function(){return ScopeStore.getById(props.selectorValue)},
					scopes: function(){return ScopeStore.getAll()},
					auLevels: function(){return AULevelStore.getAll()},
					periods: function(){return PeriodStore.getAll()}
				};
				break;
			case ObjectTypes.PLACE:
				storeloads = {
					//place: function(){return PlaceStore.getById(props.selectorValue)},
					places: function(){return PlaceStore.getAll()},
					scopes: function(){return ScopeStore.getAll()}
				};
				break;
			case ObjectTypes.PERIOD:
				storeloads = {
					//period: function(){return PeriodStore.getById(props.selectorValue)},
					periods: function(){return PeriodStore.getAll()}
				};
				break;
			case ObjectTypes.VECTOR_LAYER_TEMPLATE:
				storeloads = {
					//layer: function(){return VectorLayerStore.getById(props.selectorValue)},
					layers: function(){return VectorLayerStore.getAll()},
					topics: function(){return TopicStore.getAll()},
					layerGroups: function(){return LayerGroupStore.getAll()},
					styles: function(){return StyleStore.getAll()},
					attributeSets: function(){return AttributeSetStore.getAll()}
				};
				break;
			case ObjectTypes.RASTER_LAYER_TEMPLATE:
				storeloads = {
					//layer: function(){return RasterLayerStore.getById(props.selectorValue)},
					layers: function(){return RasterLayerStore.getAll()},
					topics: function(){return TopicStore.getAll()},
					layerGroups: function(){return LayerGroupStore.getAll()},
					styles: function(){return StyleStore.getAll()}
				};
				break;
			case ObjectTypes.AU_LEVEL:
				storeloads = {
					//layer: function(){return AULevelStore.getById(props.selectorValue)},
					layers: function(){return AULevelStore.getAll()}
				};
				break;
			case ObjectTypes.ATTRIBUTE:
				storeloads = {
					//attribute: function(){return AttributeStore.getById(props.selectorValue)},
					attributes: function(){return AttributeStore.getAll()}
				};
				break;
			case ObjectTypes.ATTRIBUTE_SET:
				storeloads = {
					//attributeSet: function(){return AttributeSetStore.getById(props.selectorValue)},
					attributeSets: function(){return AttributeSetStore.getAll()},
					topics: function(){return TopicStore.getAll()},
					attributes: function(){return AttributeStore.getAll()}
				};
				break;
			case ObjectTypes.TOPIC:
				storeloads = {
					//topic: function(){return TopicStore.getById(props.selectorValue)},
					topics: function(){return TopicStore.getAll()}
				};
				break;
			case ObjectTypes.THEME:
				storeloads = {
					//theme: function(){return ThemeStore.getById(props.selectorValue)},
					themes: function(){return ThemeStore.getAll()},
					scopes: function(){return ScopeStore.getAll()},
					topics: function(){return TopicStore.getAll()}
				};
				break;
			case ObjectTypes.LAYER_GROUP:
				storeloads = {
					//layerGroup: function(){return LayerGroupStore.getById(props.selectorValue)},
					layerGroups: function(){return LayerGroupStore.getAll()}
				};
				break;
			case ObjectTypes.STYLE:
				storeloads = {
					//style: function(){return StyleStore.getById(props.selectorValue)},
					styles: function(){return StyleStore.getAll()}
				};
				break;
		}
		storeloads.selectorData = function(){return Store[props.data.objectType].getAll()};
		return storeloads;
	}

	//getUrl() {
	//	return path.join(this.props.parentUrl, "metadata/" + this.state.selectorValue); // todo
	//}

	componentDidMount() {
		super.componentDidMount();

		if(this.props.data.objectType) {
			this.addListeners();
		}
	}

	addListeners(props) {
		if(!props) {
			props = this.props;
		}
		this.changeListener.add(Store[props.data.objectType]);
	}
	removeListeners() {
		this.changeListener.clean();
	}

	render() {

		if (this.state.ready) {
			//return (
			//	<div>
			//		<ScreenMetadataObjectController store={this.state.store} {...this.props} />
			//	</div>
			//);
			let props = utils.clone(this.props);
			//let props = {};
			props.store = this.state.store;
			return React.createElement(ScreenMetadataObjectController, props);
		}
		else {
			return (
				<div className="component-loading"></div>
			);
		}

	}
}

export default ScreenMetadataObject;
