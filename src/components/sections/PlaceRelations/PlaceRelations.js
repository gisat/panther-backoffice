import React, { PropTypes, Component } from 'react';
import styles from './PlaceRelations.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';
import path from "path";

import utils from '../../../utils/utils';
import {apiProtocol,apiHost} from '../../../config';

import UIScreenButton from '../../atoms/UIScreenButton';

import LinkTableByScopePlace from '../../elements/LinkTableByScopePlace';
import LinkTableVectorByScopePlace from '../../elements/LinkTableVectorByScopePlace';
import LinkTableRasterByScopePlace from '../../elements/LinkTableRasterByScopePlace';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';
import ScreenPlaceDataSourceAttSet from '../../screens/ScreenPlaceDataSourceAttSet';
//import ScreenPlaceDataSourceVectorAttSet from '../../screens/ScreenPlaceDataSourceVectorAttSet';
import ScreenPlaceDataSourceLayer from '../../screens/ScreenPlaceDataSourceLayer';

import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';
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

import ListenerHandler from '../../../core/ListenerHandler';

var initialState = {
	place: null,
	placeRelations: [],
	scopes: []
};


@withStyles(styles)
class PlaceRelations extends Component {

	static propTypes = {
		disabled: React.PropTypes.bool,
		selectorValue: React.PropTypes.any,
		places: React.PropTypes.array
	};

	static defaultProps = {
		disabled: false,
		selectorValue: null,
		places: []
	};

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
	}

	store2state(props) {
		if(!props){
			props = this.props;
		}
		return {
			scopes: ScopeStore.getAll(),
			place: PlaceStore.getById(props.selectorValue),
			placeRelations: ObjectRelationStore.getFiltered({placeKey: props.selectorValue}) // todo rewrite after getFiltered can filter by nested key
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		var thisComponent = this;
		let store2state = this.store2state(props);
		this.context.setStateFromStores.call(this, store2state, keys);
		// if stores changed, overrides user input - todo fix
		if(!keys || keys.indexOf("placeRelations")!=-1) {
			store2state.placeRelations.then(function(relations){
				thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.relations2state(relations));
			});
		}
	}

	_onStoreChange(keys) {
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		this.changeListener.add(ScopeStore, ["scopes"]);
		this.changeListener.add(PlaceStore, ["place"]);
		this.changeListener.add(ObjectRelationStore, ["placeRelations"]);

		this.setStateFromStores();
	}

	componentWillUnmount() {
		this.changeListener.clean();
	}

	componentWillReceiveProps(newProps) {
		if(newProps.selectorValue!=this.props.selectorValue) {
			this.setStateFromStores(newProps,["place","placeRelations"]);
			this.updateStateHash(newProps);
		}
	}

	/**
	 * Read relations from corresponding ObjectRelation objects.
	 * Called in store2state().
	 * @param relations
	 * @returns {{layerType: (null|*|layerType|{serverName}|{serverName, transformForLocal})}}
	 */
	relations2state(relations) {
		let ret = {
			relationsAttSet: {},
			relationsAULevel: {},
			relationsVector: {},
			relationsRaster: {}
		};

		var addRelationLayer = function(repo,rel) {
			if(!repo[rel.layerObject.key]) {
				repo[rel.layerObject.key] = {
					key: rel.layerObject.key,
					name: rel.layerObject.name,
					periods: {},
					attSets: {}
				};
			}
			if(!rel.isOfAttributeSet) {
				if(!repo[rel.layerObject.key].periods[rel.period.key]) {
					repo[rel.layerObject.key].periods[rel.period.key] = {
						key: rel.period.key,
						name: rel.period.name,
						relations: []
					};
				}
				repo[rel.layerObject.key].periods[rel.period.key].relations.push(rel);
			} else {
				if(!repo[rel.layerObject.key].attSets[rel.attributeSet.key]) {
					repo[rel.layerObject.key].attSets[rel.attributeSet.key] = {
						key: rel.attributeSet.key,
						name: rel.attributeSet.name,
						periods: {}
					};
				}
				if(!repo[rel.layerObject.key].attSets[rel.attributeSet.key].periods[rel.period.key]) {
					repo[rel.layerObject.key].attSets[rel.attributeSet.key].periods[rel.period.key] = {
						key: rel.period.key,
						name: rel.period.name,
						relations: []
					};
				}
				repo[rel.layerObject.key].attSets[rel.attributeSet.key].periods[rel.period.key].relations.push(rel);
			}
		};

		var addRelationAttSet = function(repo,rel) {
			if(!repo[rel.attributeSet.key]) {
				repo[rel.attributeSet.key] = {
					key: rel.attributeSet.key,
					name: rel.attributeSet.name,
					levels: {}
				};
			}
			if(!repo[rel.attributeSet.key].levels[rel.layerObject.key]) {
				repo[rel.attributeSet.key].levels[rel.layerObject.key] = {
					key: rel.layerObject.key,
					name: rel.layerObject.name,
					periods: {}
				};
			}
			if(!repo[rel.attributeSet.key].levels[rel.layerObject.key].periods[rel.period.key]) {
				repo[rel.attributeSet.key].levels[rel.layerObject.key].periods[rel.period.key] = {
					key: rel.period.key,
					name: rel.period.name,
					relations: []
				};
			}
			repo[rel.attributeSet.key].levels[rel.layerObject.key].periods[rel.period.key].relations.push(rel);
		};

		var addRelationLevel = function(repo,rel) {
			if(!repo[rel.layerObject.key]) {
				repo[rel.layerObject.key] = {
					key: rel.layerObject.key,
					name: rel.layerObject.name,
					relations: []
				};
			}
			repo[rel.layerObject.key].relations.push(rel);
		};


		if(relations.length > 0) {
			// separate relations by type
			for(let rel of relations) {
				if(rel.layerObject) {
					switch(rel.layerObject.layerType) {
						case "au":
							if(rel.isOfAttributeSet) {
								addRelationAttSet(ret.relationsAttSet,rel);
							} else {
								addRelationLevel(ret.relationsAULevel,rel);
							}
							break;
						case "vector":
							addRelationLayer(ret.relationsVector,rel);
							break;
						case "raster":
							addRelationLayer(ret.relationsRaster,rel);
							break;
						default:
							console.error("RELATION HAS LAYEROBJECT OF INVALID LAYERTYPE",rel);
					}
				} else {
					console.error("RELATION HAS NO LAYEROBJECT",rel);
				}
			}
		}

		return ret;
	}

	/**
	 * Differentiate between states
	 * - when receiving response for asynchronous action, ensure state has not changed in the meantime
	 */
	updateStateHash(props) {
		if(!props){
			props = this.props;
		}
		// todo hash influenced by screen/page instance / active screen (unique every time it is active)
		this._stateHash = utils.stringHash(props.selectorValue);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}


	onOpenPlaceConfig() {
		this.context.onInteraction().call();
		if(this.state.place) {
			let itemType = ObjectTypes.PLACE;
			var screenName = this.props.screenKey + "-ScreenMetadata" + itemType;
			let options = {
				component: ScreenMetadataObject,
				parentUrl: this.props.parentUrl,
				size: 40,
				data: {
					objectType: itemType,
					objectKey: this.state.place.key
				}
			};
			ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
		}
	}

	onOpenScopeConfig() {
		this.context.onInteraction().call();
		if(this.state.place) {
			let itemType = ObjectTypes.SCOPE;
			var screenName = this.props.screenKey + "-ScreenMetadata" + itemType;
			let options = {
				component: ScreenMetadataObject,
				parentUrl: this.props.parentUrl,
				size: 40,
				data: {
					objectType: itemType,
					objectKey: this.state.place.scope.key
				}
			};
			ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
		}
	}


	onCellClick (table, row, col) {
		this.context.onInteraction().call();
		var screenName = this.props.screenKey + "-ScreenPlaceDataSource" + table;
		var screenComponent, data;
		switch(table){
			case "AttSet":
				if(row==null) {
					screenComponent = ScreenPlaceDataSourceAttSet; // todo replace
				} else {
					screenComponent = ScreenPlaceDataSourceAttSet;
				}
				data = {
					placeKey: this.props.selectorValue,
					attSetKey: row,
					auLevelKey: col
				};
				break;
			case "Vector":
				if(col==null) {
					screenComponent = ScreenPlaceDataSourceLayer;
				} else {
					screenComponent = ScreenPlaceDataSourceAttSet; // todo replace
				}
				data = {
					placeKey: this.props.selectorValue,
					objectType: ObjectTypes.VECTOR_LAYER_TEMPLATE,
					layerKey: row,
					attSetKey: col
				};
				break;
			case "Raster":
				screenComponent = ScreenPlaceDataSourceLayer; // todo replace
				data = {
					placeKey: this.props.selectorValue,
					objectType: ObjectTypes.RASTER_LAYER_TEMPLATE,
					layerKey: row
				};
				break;
		}
		let options = {
			component: screenComponent,
			parentUrl: this.props.parentUrl,
			size: 40,
			data: data
		};
		ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
	}


	render() {

		var headerInsert = null,
			headerInsertChildren = [],
			configInsert = null;

		headerInsertChildren.push(
			<h1
				key="placeHeading"
				className="fit-after"
			>
				{this.state.place ? this.state.place.name : " "}
			</h1>
		);

		var prod = null;
		if (!this.props.selectorValue) {
			prod = "Select place";
		}


		if(this.state.place) {
			if (this.state.place.scope) {

				headerInsertChildren.push(
					<div
						key="placeScopeSettingsButton"
						className="heading-sub"
					>
						Scope:&nbsp;
						<UIScreenButton
							onClick={this.onOpenScopeConfig.bind(this)}
						>
							{this.state.place.scope.name}
						</UIScreenButton>
					</div>
				);

				configInsert = (
					<div>
						<h2>Attribute sets</h2>
						<LinkTableByScopePlace
							disabled={this.props.disabled}
							relationsAttSet={this.state.relationsAttSet}
							relationsAULevel={this.state.relationsAULevel}
							place={this.state.place}
							onCellClick={this.onCellClick.bind(this,"AttSet")}
						/>

						<h2>Vector layers</h2>
						<LinkTableVectorByScopePlace
							disabled={this.props.disabled}
							relations={this.state.relationsVector}
							place={this.state.place}
							onCellClick={this.onCellClick.bind(this,"Vector")}
						/>

						<h2>Raster layers</h2>
						<LinkTableRasterByScopePlace
							disabled={this.props.disabled}
							relations={this.state.relationsRaster}
							place={this.state.place}
							onCellClick={this.onCellClick.bind(this,"Raster")}
						/>
					</div>
				);
			} else {
				headerInsertChildren.push(
					<div className="ui warning message">
						<div className="header">
							No scope assigned
						</div>
						<div>
							Please assign the place to a scope to configure relations.
							<UIScreenButton
								onClick={this.onOpenPlaceConfig.bind(this)}
							>
								Place settings
							</UIScreenButton>
						</div>
					</div>
				);
			}
		}

		headerInsert = React.createElement('div', null, headerInsertChildren);
		var prodInsert =(
			<div className="prod">
				{prod}
			</div>
		);


		return (
			<div>
				{headerInsert}
				{prodInsert}
				{configInsert}
			</div>
		);

	}
}

export default PlaceRelations;
