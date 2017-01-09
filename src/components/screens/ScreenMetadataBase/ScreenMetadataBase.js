import React, { PropTypes, Component } from 'react';
import ScreenController from "../../common/ScreenController";

import styles from './ScreenMetadataBase.css';
import withStyles from '../../../decorators/withStyles';

import utils from '../../../utils/utils';

import ScreenMetadataBaseController from '../ScreenMetadataBaseController'

import ScopeStore from '../../../stores/ScopeStore';
import VectorLayerStore from '../../../stores/VectorLayerStore';
import RasterLayerStore from '../../../stores/RasterLayerStore';
import AULevelStore from '../../../stores/AULevelStore';
import AttributeStore from '../../../stores/AttributeStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import PlaceStore from '../../../stores/PlaceStore';
import PeriodStore from '../../../stores/PeriodStore';
import ThemeStore from '../../../stores/ThemeStore';
import TopicStore from '../../../stores/TopicStore';
import LayerGroupStore from '../../../stores/LayerGroupStore';
import StyleStore from '../../../stores/StyleStore';

import logger from '../../../core/Logger';

// TODO: Add possibility to manage layers.
// TODO: Add permissions towards custom layers.
@withStyles(styles)
class ScreenMetadataBase extends ScreenController {

	static propTypes = {
		disabled: PropTypes.bool,
		screenKey: PropTypes.string.isRequired
	};

	static defaultProps = {
		disabled: false
	};

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	_getStoreLoads(props){
		return {
			scopes: this._load(ScopeStore),
			vectorLayerTemplates: this._load(VectorLayerStore),
			rasterLayerTemplates: this._load(RasterLayerStore),
			auLevels: this._load(AULevelStore),
			attributeSets: this._load(AttributeSetStore),
			attributes: this._load(AttributeStore),
			places: this._load(PlaceStore),
			periods: this._load(PeriodStore),
			themes: this._load(ThemeStore),
			topics: this._load(TopicStore),
			layerGroups: this._load(LayerGroupStore),
			styles: this._load(StyleStore)
		};
	}

	componentDidMount() {
		super.componentDidMount();

		this.changeListener.add(ScopeStore, ["scopes"]);
		this.changeListener.add(VectorLayerStore, ["vectorLayerTemplates"]);
		this.changeListener.add(RasterLayerStore, ["rasterLayerTemplates"]);
		this.changeListener.add(AULevelStore, ["auLevels"]);
		this.changeListener.add(AttributeSetStore, ["attributeSets"]);
		this.changeListener.add(AttributeStore, ["attributes"]);
		this.changeListener.add(PlaceStore, ["places"]);
		this.changeListener.add(PeriodStore, ["periods"]);
		this.changeListener.add(ThemeStore, ["themes"]);
		this.changeListener.add(TopicStore, ["topics"]);
		this.changeListener.add(LayerGroupStore, ["layerGroups"]);
		this.changeListener.add(StyleStore, ["styles"]);
	}


	getUrl() {
		return path.join(this.props.parentUrl, "metadata/" + this.state.activeMenuItem);
	}

	render() {
		if (this.state.ready) {
			let props = utils.clone(this.props);
			props.store = this.state.store;
			return React.createElement(ScreenMetadataBaseController, props);
		} else {
			return (
				<div className="component-loading"></div>
			);
		}

	}
}

export default ScreenMetadataBase;
