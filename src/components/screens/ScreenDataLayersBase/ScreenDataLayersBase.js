import React, { PropTypes, Component } from 'react';
import ScreenController from "../../common/ScreenController";
import styles from './ScreenDataLayersBase.css';
import withStyles from '../../../decorators/withStyles';
import { Input } from '../../SEUI/elements';

import utils from '../../../utils/utils';
import logger from '../../../core/Logger';

import { allowDuplication } from '../../../config';

import ListenerHandler from '../../../core/ListenerHandler';

import path from "path";
import _ from "underscore";

import ActionCreator from '../../../actions/ActionCreator';

import DataLayerStore from '../../../stores/DataLayerStore';
import ObjectRelationStore from '../../../stores/ObjectRelationStore';
import ScopeStore from '../../../stores/ScopeStore';
import PlaceStore from '../../../stores/PlaceStore';
import VectorLayerStore from '../../../stores/VectorLayerStore';
import RasterLayerStore from '../../../stores/RasterLayerStore';
import AULevelStore from '../../../stores/AULevelStore';
import AttributeStore from '../../../stores/AttributeStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import PeriodStore from '../../../stores/PeriodStore';
import DataLayerColumnsStore from '../../../stores/DataLayerColumnsStore';

import SelectorDataLayer from '../../sections/SelectorDataLayer';
import ConfigDataLayer from '../../sections/ConfigDataLayer';

import Loader from '../../atoms/Loader';

var initialState = {
	selectorValue: null,
	valueNewLayerName: ""
};


@withStyles(styles)
class ScreenDataLayersBase extends ScreenController {

	constructor(props) {
		super(props);
		this.state = _.assign(this.state, utils.deepClone(initialState));
	}

	//getUrl() {
	//	return path.join(this.props.parentUrl, "datalayers/" + this.state.selectorValue);
	//}

	_getStoreLoads() {
		let selectorValue = this.state.selectorValue;
		if(this.state.store.dataLayers) {
			let layerToFilter = this.state.store.dataLayers.filter(dataLayer => dataLayer.key == this.state.selectorValue);
		}
		return {
			dataLayers: this._load(DataLayerStore),
			dataLayer: this._loadWhere(DataLayerStore,{key: selectorValue}),
			relations: this._loadWhere(ObjectRelationStore,{dataSourceString: layerToFilter.path}),
			dataLayerColumns: function(){return DataLayerColumnsStore.getByDataSource(selectorValue)},
			scopes: this._load(ScopeStore),
			places: this._load(PlaceStore),
			vectorLayerTemplates: this._load(VectorLayerStore),
			rasterLayerTemplates: this._load(RasterLayerStore),
			auLevels: this._load(AULevelStore),
			attributeSets: this._load(AttributeSetStore),
			attributes: this._load(AttributeStore),
			periods: this._load(PeriodStore)
		};
	}

	componentDidMount() {
		super.componentDidMount();

		this.changeListener.add(DataLayerStore);
		this.changeListener.add(ScopeStore, ["scopes"]);
		this.changeListener.add(VectorLayerStore, ["vectorLayerTemplates"]);
		this.changeListener.add(RasterLayerStore, ["rasterLayerTemplates"]);
		this.changeListener.add(AULevelStore, ["auLevels"]);
		this.changeListener.add(AttributeSetStore, ["attributeSets"]);
		this.changeListener.add(AttributeStore, ["attributes"]);
		this.changeListener.add(PlaceStore, ["places"]);
		this.changeListener.add(PeriodStore, ["periods"]);
		this.changeListener.add(ObjectRelationStore,["relations"]);
		this.changeListener.add(DataLayerColumnsStore,["dataLayerColumns"]);
	}

	onSelectorFocus(){
		logger.trace("ScreenDataLayersBase# onSelectorFocus()");
		DataLayerStore.reload();
	}

	onSelectorChange (value) {
		logger.trace("ScreenDataLayersBase# onSelectorChange(), Value: ", value);

		this.setState({
			selectorValue: value,
			ready: false
		},this.loadState);
	}

	duplicate() {
		if(!this.state.selectorValue) {
			return;
		}
		let layerToFilter = this.state.store.dataLayers.filter(dataLayer => dataLayer.key == this.state.selectorValue);
		if(layerToFilter.length == 0) {
			return;
		}
		ActionCreator.duplicateLayer(layerToFilter[0].path, this.state.valueNewLayerName)
	}

	onChangeNewLayerName(e) {
		this.setState({
			valueNewLayerName: e.target.value
		})
	}

	render() {
		logger.trace("ScreenDataLayersBase# render(), This state: ", this.state);

		let ret = null;
		let configInsert = (
			<div className="component-loading">
				<Loader />
			</div>
		);

		if (this.state.ready) {
			configInsert = (
				<ConfigDataLayer
					disabled={this.props.disabled}
					store={this.state.store}
					selectorValue={this.state.selectorValue}
					dataLayers={this.state.store.dataLayers} // todo remove
					screenKey={this.props.screenKey}
					//parentUrl={this.getUrl()}
				/>
			);
		}

		let duplicateLayer = "";
		if(allowDuplication) {
			duplicateLayer = (
				<div className="float">
					<div>
						<Input
							type="text"
							name="Name of duplicated layer"
							placeholder=" "
							value={this.state.valueNewLayerName}
							onChange={this.onChangeNewLayerName.bind(this)}
						/>
					</div>
					<div className="button" onClick={this.duplicate.bind(this)}>
						Duplicate layer
					</div>
				</div>
			);
		}

		if (this.state.initialized) {
			ret = (
				<div>
					<div className="screen-setter">
						<div>
							<SelectorDataLayer
								disabled={this.props.disabled}
								store={this.state.store}
								data={this.state.store.dataLayers}
								value={this.state.selectorValue}
								onChange={this.onSelectorChange.bind(this)}
								onFocus={this.onSelectorFocus.bind(this)}
							/>
						</div>

						{duplicateLayer}
					</div>
					<div className="screen-content">
						<div>
							{configInsert}
						</div>
					</div>
				</div>
			);
		}

		return ret;

	}
}

export default ScreenDataLayersBase;
