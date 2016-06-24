import React, { PropTypes, Component } from 'react';

import path from "path";

import utils from '../../../utils/utils';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import ActionCreator from '../../../actions/ActionCreator';
import AULevelStore from '../../../stores/AULevelStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import PlaceStore from '../../../stores/PlaceStore';
import ScopeStore from '../../../stores/ScopeStore';

import SelectorPlaceLayer from '../../sections/SelectorPlaceLayer';
import ConfigPlaceDataSource from '../../sections/ConfigPlaceDataSource';

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';
import PantherComponent from "../../common/PantherComponent";

var initialState = {
	scope: null,
	places: [],
	layers: [],
	selectorValuePlace: null,
	selectorValueLayer: null
};


class ScreenPlaceDataSourceLayer extends PantherComponent {

	static propTypes = {
		data: PropTypes.shape({
			objectType: PropTypes.string.isRequired
		})
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		if(this.props.data) {
			if (this.props.data.objectType) {
				this.state.objectType = this.props.data.objectType;
			}
			if (this.props.data.placeKey) {
				this.state.selectorValuePlace = this.props.data.placeKey;
			}
			if (this.props.data.layerKey) {
				this.state.selectorValueLayer = this.props.data.layerKey;
			}
		}
	}

	//getUrl() {
	//	return path.join(this.props.parentUrl, "links/" + this.state.selectorValuePlace + "-" + this.state.selectorValueAttSet + "-" + this.state.selectorValueAULevel); // todo
	//}

	store2state(props) {
		if (!props) {
			props = this.props;
		}
		return {
			scope: ScopeStore.getById(props.data.scopeKey)
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(
			props.data.scopeKey &&
			props.data.placeKey
		) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			let setStatePromise = super.setStateFromStores(store2state, keys);
			setStatePromise.then(function () {
				let next2state = {
					places: PlaceStore.getFiltered({scope: thisComponent.state.scope}),
					layers: utils.getLayerTemplatesForScope(thisComponent.state.scope, thisComponent.props.data.objectType)
				};
				super.setStateFromStores(next2state);
			});
		}
	}

	_onStoreChange(keys) {
		logger.trace("ScreenPlaceDataSourceLayer# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		super.componentDidMount();

		this.changeListener.add(PlaceStore, ["places"]);
		this.changeListener.add(Store[this.props.data.objectType], ["layers"]);

		this.setStateFromStores();
	}

	componentWillReceiveProps(newProps) {
		if(newProps.data.placeKey && (this.props.data.placeKey != newProps.data.placeKey)) {
			this.setState({
				selectorValuePlace: newProps.data.placeKey
			});
		}
		if(newProps.data.layerKey && (this.props.data.layerKey != newProps.data.layerKey)) {
			this.setState({
				selectorValueAttSet: newProps.data.layerKey
			});
		}
	}

	/**
	 * Differentiate between states
	 * - when receiving response for asynchronous action, ensure state has not changed in the meantime
	 */
	updateStateHash(state) {
		if(!state){
			state = this.state;
		}
		// todo hash influenced by screen/page instance / active screen (unique every time it is active)
		this._stateHash = utils.stringHash(state.selectorValuePlace + state.selectorValueLayer);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}


	onSelectorChange (select, value) {
		var stateKey;
		switch(select) {
			case "place":
				stateKey = "selectorValuePlace";
				break;
			case "layer":
				stateKey = "selectorValueLayer";
				break;
		}
		if(stateKey) {
			this.setState({
				[stateKey]: value
			});
		}
	}

	render() {

		var selectorDataPlace = utils.deepClone(this.state.places);
		selectorDataPlace.sort(function(a, b) {
			if(!a.scope && b.scope) return 1;
			if(a.scope && !b.scope) return -1;
			if(a.key > b.key) return 1;
			if(a.key < b.key) return -1;
			return 0;
		});

		var layerTypeInsert = objectTypesMetadata[this.props.data.objectType].name;
		var context;
		switch (this.props.data.objectType) {
			case ObjectTypes.VECTOR_LAYER_TEMPLATE:
				context = "Vector";
				break;
			case ObjectTypes.RASTER_LAYER_TEMPLATE:
				context = "Raster";
				break;
		}

		let ret = null;
		if(this.state.layers.models){
			ret = (
				<div>
					<div className="screen-setter"><div>
						<h2>Data source selection: {layerTypeInsert}</h2>
						<SelectorPlaceLayer
							disabled={this.props.disabled}
							layerType={this.props.data.objectType}
							dataPlace={selectorDataPlace}
							dataLayer={this.state.layers.models} // todo filter by scope of selected place
							valuePlace={this.state.selectorValuePlace}
							valueLayer={this.state.selectorValueLayer}
							onChange={this.onSelectorChange.bind(this)}
						/>
					</div></div>
					<div className="screen-content"><div>
						<ConfigPlaceDataSource
							disabled={this.props.disabled}
							screenKey={this.props.screenKey}
							relationsContext={context}
							selectorValuePlace={this.state.selectorValuePlace}
							selectorValueLayer={this.state.selectorValueLayer}
						/>
					</div></div>
				</div>
			);
		}
		return ret;
	}
}

export default ScreenPlaceDataSourceLayer;
