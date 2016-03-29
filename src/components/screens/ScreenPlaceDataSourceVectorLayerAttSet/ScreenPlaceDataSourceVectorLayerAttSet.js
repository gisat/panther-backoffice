import React, { PropTypes, Component } from 'react';

import path from "path";
import _ from 'underscore';

import utils from '../../../utils/utils';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import ActionCreator from '../../../actions/ActionCreator';
import VectorLayerStore from '../../../stores/VectorLayerStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import PlaceStore from '../../../stores/PlaceStore';
import ScopeStore from '../../../stores/ScopeStore';

import SelectorPlaceVectorLayerAttSet from '../../sections/SelectorPlaceVectorLayerAttSet';
import ConfigPlaceDataSource from '../../sections/ConfigPlaceDataSource';

import ListenerHandler from '../../../core/ListenerHandler';


var initialState = {
	scope: null,
	places: [],
	attributeSets: [],
	layers: [],
	selectorValuePlace: null,
	selectorValueLayer: null,
	selectorValueAttSet: null
};


class ScreenPlaceDataSourceVectorLayerAttSet extends Component {

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
		this.changeListener = new ListenerHandler(this, this._onStoreChange, "addChangeListener", "removeChangeListener");

		if(this.props.data) {
			if (this.props.data.placeKey) {
				this.state.selectorValuePlace = this.props.data.placeKey;
			}
			if (this.props.data.layerKey) {
				this.state.selectorValueLayer = this.props.data.layerKey;
			}
			if (this.props.data.attSetKey) {
				this.state.selectorValueAttSet = this.props.data.attSetKey;
			}
		}
	}

	getUrl() {
		return path.join(this.props.parentUrl, "links/" + this.state.selectorValuePlace + "-" + this.state.selectorValueLayer + "-" + this.state.selectorValueAttSet); // todo
	}

	store2state(props) {
		if (!props) {
			props = this.props;
		}
		return {
			//places: PlaceStore.getAll(),
			scope: ScopeStore.getById(props.data.scopeKey),
			attributeSets: utils.getAttSetsForLayers(props.data.layerKey)
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
			let setStatePromise = this.context.setStateFromStores.call(this, store2state, keys);

			setStatePromise.then(function () {
				let next2state = {
					places: PlaceStore.getFiltered({scope: thisComponent.state.scope}),
					layers: utils.getLayerTemplatesForScope(thisComponent.state.scope, "vector")
				};
				thisComponent.context.setStateFromStores.call(thisComponent, next2state);
			});
		}
	}

	_onStoreChange(keys) {
		//this.context.setStateFromStores.call(this, this.store2state(), keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		this.changeListener.add(PlaceStore, ["places"]);
		this.changeListener.add(VectorLayerStore, ["layers"]);
		this.changeListener.add(AttributeSetStore, ["attributeSets"]);

		//this.context.setStateFromStores.call(this, this.store2state());
		this.setStateFromStores();
	}

	componentWillUnmount() {
		this.changeListener.clean();
	}

	componentWillReceiveProps(newProps) {
		if(newProps.data.placeKey && (this.props.data.placeKey != newProps.data.placeKey)) {
			this.setState({
				selectorValuePlace: newProps.data.placeKey
			});
		}
		if(newProps.data.layerKey && (this.props.data.layerKey != newProps.data.layerKey)) {
			this.setState({
				selectorValueLayer: newProps.data.layerKey
			});
		}
		if(newProps.data.attSetKey && (this.props.data.attSetKey != newProps.data.attSetKey)) {
			this.setState({
				selectorValueAttSet: newProps.data.attSetKey
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
		this._stateHash = utils.stringHash(state.selectorValuePlace + state.selectorValueLayer + state.selectorValueAttSet);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}


	onSelectorChange (select, value) {
		switch(select) {
			case "place":
				this.setState({
					selectorValuePlace: value
				});
				break;
			case "attSet":
				this.setState({
					selectorValueAttSet: value
				});
				break;
			case "layer":
				this.onChangeLayer(select, value)
				break;
		}
	}

	onChangeLayer (select, value) {
		var thisComponent = this;
		//var layer = _.findWhere(this.state.layers,{key: value});
		//var layerAttSetsPromise = utils.getAttSetsForLayers(layer);
		var layerAttSetsPromise = utils.getAttSetsForLayers(value);
		layerAttSetsPromise.then( function (layerAttSets) {

			let selectorValueAttSet = null;
			if (layerAttSets.length == 1) {
				selectorValueAttSet = layerAttSets[0].key;
			}
			console.log(layerAttSets);
			thisComponent.setState({
				selectorValueLayer: value,
				attributeSets: layerAttSets,
				selectorValueAttSet: selectorValueAttSet
			});
		});
	}

	render() {

		if (this.state.layers.hasOwnProperty("models")) {
			var selectorDataPlace = utils.deepClone(this.state.places);
			selectorDataPlace.sort(function (a, b) {
				if (!a.scope && b.scope) return 1;
				if (a.scope && !b.scope) return -1;
				if (a.key > b.key) return 1;
				if (a.key < b.key) return -1;
				return 0;
			});

			return (
				<div>
					<div className="screen-setter">
						<div>
							<h2>Data source selection: Vector layer attribute set</h2>
							<SelectorPlaceVectorLayerAttSet
								disabled={this.props.disabled}
								dataPlace={selectorDataPlace}
								dataLayer={this.state.layers.models}
								dataAttSet={this.state.attributeSets}
								valuePlace={this.state.selectorValuePlace}
								valueLayer={this.state.selectorValueLayer}
								valueAttSet={this.state.selectorValueAttSet}
								onChange={this.onSelectorChange.bind(this)}
							/>
						</div>
					</div>
					<div className="screen-content">
						<div>
							<ConfigPlaceDataSource
								disabled={this.props.disabled}
								screenKey={this.props.screenKey}
								relationsContext="VectorAttSet"
								selectorValuePlace={this.state.selectorValuePlace}
								selectorValueLayer={this.state.selectorValueLayer}
								selectorValueAttSet={this.state.selectorValueAttSet}
							/>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default ScreenPlaceDataSourceVectorLayerAttSet;
