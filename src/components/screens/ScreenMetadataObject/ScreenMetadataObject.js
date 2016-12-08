import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataObject.css';
import withStyles from '../../../decorators/withStyles';

import path from "path";

import utils from '../../../utils/utils';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import ActionCreator from '../../../actions/ActionCreator';

import ScopeModel from '../../../models/ScopeModel';

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
					scopes: this._load(ScopeStore),
					auLevels: this._load(AULevelStore),
					periods: this._load(PeriodStore)
				};
				break;
			case ObjectTypes.PLACE:
				storeloads = {
					places: this._load(PlaceStore),
					scopes: this._load(ScopeStore)
				};
				break;
			case ObjectTypes.PERIOD:
				storeloads = {
					periods: this._load(PeriodStore)
				};
				break;
			case ObjectTypes.VECTOR_LAYER_TEMPLATE:
				storeloads = {
					layers: this._load(VectorLayerStore),
					scopes: this._load(ScopeStore),
					topics: this._load(TopicStore),
					layerGroups: this._load(LayerGroupStore),
					styles: this._load(StyleStore),
					attributeSets: this._load(AttributeSetStore)
				};
				break;
			case ObjectTypes.RASTER_LAYER_TEMPLATE:
				storeloads = {
					layers: this._load(RasterLayerStore),
					scopes: this._load(ScopeStore),
					topics: this._load(TopicStore),
					layerGroups: this._load(LayerGroupStore),
					styles: this._load(StyleStore)
				};
				break;
			case ObjectTypes.AU_LEVEL:
				storeloads = {
					levels: this._load(AULevelStore)
				};
				break;
			case ObjectTypes.ATTRIBUTE:
				storeloads = {
					attributes: this._load(AttributeStore),
					scopes: this._load(ScopeStore)
				};
				break;
			case ObjectTypes.ATTRIBUTE_SET:
				storeloads = {
					attributeSets: this._load(AttributeSetStore),
					scopes: this._load(ScopeStore),
					topics: this._load(TopicStore),
					attributes: this._load(AttributeStore)
				};
				break;
			case ObjectTypes.TOPIC:
				storeloads = {
					topics: this._load(TopicStore)
				};
				break;
			case ObjectTypes.THEME:
				storeloads = {
					themes: this._load(ThemeStore),
					scopes: this._load(ScopeStore),
					topics: this._load(TopicStore)
				};
				break;
			case ObjectTypes.LAYER_GROUP:
				storeloads = {
					layerGroups: this._load(LayerGroupStore)
				};
				break;
			case ObjectTypes.STYLE:
				storeloads = {
					styles: this._load(StyleStore),
					attributeSets: this._load(AttributeSetStore)
				};
				break;
		}
		storeloads.selectorData = this._load(Store[props.data.objectType]);
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
