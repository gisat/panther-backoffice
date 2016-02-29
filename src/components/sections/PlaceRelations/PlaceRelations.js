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

var initialState = {
	savedState: {},
	place: null,
	scopes: [],
	vectorLayerTemplates: [],
	rasterLayerTemplates: [],
	auLevels: [],
	attributes: [],
	periods: []
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
		onSetScreenData: PropTypes.func.isRequired,
		openScreen: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}

	store2state(props) {
		if(!props){
			props = this.props;
		}
		return {
			scopes: ScopeStore.getAll(),
			//vectorLayerTemplates: VectorLayerStore.getAll(),
			//rasterLayerTemplates: RasterLayerStore.getAll(),
			//auLevels: AULevelStore.getAll(),
			//attributeSets: AttributeSetStore.getAll(),
			//attributes: AttributeStore.getAll(),
			//periods: PeriodStore.getAll(),
			place: PlaceStore.getById(props.selectorValue),
			placeRelations: ObjectRelationStore.getFiltered({placeKey: props.selectorValue}) // todo rewrite after getFiltered can filter by nested key
			//dataLayerColumns: DataLayerColumnsStore.getByDataSource(props.selectorValue)
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
		//if(!keys || keys.indexOf("place")!=-1) {
		//	store2state.place.then(function(relations) {
		//		thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.relations2state(relations));
		//	});
		//}
		//if(!keys || keys.indexOf("attributeSets")!=-1) {
		//	store2state.attributeSets.then(function(attributeSets) {
		//		thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.atts2state(attributeSets));
		//	});
		//}
		//if(!keys || keys.indexOf("layerRelations")!=-1 || keys.indexOf("dataLayerColumns")!=-1) {
		//	Promise.all([store2state.layerRelations, store2state.dataLayerColumns]).then(function([relations, columns]) {
		//		thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.columns2state(columns, relations));
		//	});
		//}
		if(!keys || keys.indexOf("placeRelations")!=-1) {
			store2state.placeRelations.then(function(relations){
				thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.relations2state(relations));
			});
		}
	}

	_onStoreChange(keys) {
		//console.log("_onStoreChange() ===============");
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		//ScopeStore.addChangeListener(this._onStoreChange.bind(this,["scopes"]));
		//ScopeStore.addResponseListener(this._onStoreResponse.bind(this));
		//PlaceStore.addChangeListener(this._onStoreChange.bind(this,["places"]));
		//PlaceStore.addResponseListener(this._onStoreResponse.bind(this));
		//VectorLayerStore.addChangeListener(this._onStoreChange.bind(this,["vectorLayerTemplates"]));
		//VectorLayerStore.addResponseListener(this._onStoreResponse.bind(this));
		//RasterLayerStore.addChangeListener(this._onStoreChange.bind(this,["rasterLayerTemplates"]));
		//RasterLayerStore.addResponseListener(this._onStoreResponse.bind(this));
		//AULevelStore.addChangeListener(this._onStoreChange.bind(this,["auLevels"]));
		//AULevelStore.addResponseListener(this._onStoreResponse.bind(this));
		//AttributeSetStore.addChangeListener(this._onStoreChange.bind(this,["attributeSets"]));
		//AttributeStore.addChangeListener(this._onStoreChange.bind(this,["attributes"]));
		//PeriodStore.addChangeListener(this._onStoreChange.bind(this,["periods"]));
		//PeriodStore.addResponseListener(this._onStoreResponse.bind(this));
		//ObjectRelationStore.addChangeListener(this._onStoreChange.bind(this,["layerRelations"]));
		//DataLayerColumnsStore.addChangeListener(this._onStoreChange.bind(this,["dataLayerColumns"]));
		this.setStateFromStores();
	}

	componentWillUnmount() {
		//ScopeStore.removeChangeListener(this._onStoreChange.bind(this,["scopes"]));
		//ScopeStore.removeResponseListener(this._onStoreResponse.bind(this));
		//PlaceStore.removeChangeListener(this._onStoreChange.bind(this,["places"]));
		//PlaceStore.removeResponseListener(this._onStoreResponse.bind(this));
		//VectorLayerStore.removeChangeListener(this._onStoreChange.bind(this,["vectorLayerTemplates"]));
		//VectorLayerStore.removeResponseListener(this._onStoreResponse.bind(this));
		//RasterLayerStore.removeChangeListener(this._onStoreChange.bind(this,["rasterLayerTemplates"]));
		//RasterLayerStore.removeResponseListener(this._onStoreResponse.bind(this));
		//AULevelStore.removeChangeListener(this._onStoreChange.bind(this,["auLevels"]));
		//AULevelStore.removeResponseListener(this._onStoreResponse.bind(this));
		//AttributeSetStore.removeChangeListener(this._onStoreChange.bind(this,["attributeSets"]));
		//AttributeStore.removeChangeListener(this._onStoreChange.bind(this,["attributes"]));
		//PeriodStore.removeChangeListener(this._onStoreChange.bind(this,["periods"]));
		//PeriodStore.removeResponseListener(this._onStoreResponse.bind(this));
		//ObjectRelationStore.removeChangeListener(this._onStoreChange.bind(this,["layerRelations"]));
		//DataLayerColumnsStore.removeChangeListener(this._onStoreChange.bind(this,["dataLayerColumns"]));
	}

	componentWillReceiveProps(newProps) {
		if(newProps.selectorValue!=this.props.selectorValue) {
			this.setStateFromStores(newProps,["place","placeRelations"]);
			this.updateStateHash(newProps);
		}
	}


	/**
	 * Prepare options for data table selects
	 * Called in store2state().
	 * @param attributeSets
	 * @returns {{layerType: (null|*|layerType|{serverName}|{serverName, transformForLocal})}}
	 */
	atts2state(attributeSets) {
		var ret = {
			destinationsVL: null,
			destinationsAU: null
		};
		let attsetatts = [];
		if (attributeSets) {
			for (let attset of attributeSets) {
				if(attset.attributes) {
					for (let att of attset.attributes) {
						let object = {
							key: attset.key + "-" + att.key,
							name: attset.name + " " + att.name,
							attributeName: att.name,
							attributeSetName: attset.name,
							attributeKey: att.key,
							attributeSetKey: attset.key
						};
						attsetatts.push(object);
					}
				}
			}
		}
		ret.destinationsVL = _.union(VLDESTINATIONS,attsetatts);
		ret.destinationsAU = _.union(AUDESTINATIONS,attsetatts);
		return ret;
	}

	/**
	 * Prepare columns and selects relations.
	 * Called in store2state().
	 * @param columns
	 * @param relations
	 * @returns {{columnMaps: {au: {}, vector: {}}}}
	 */
	columns2state(columns, relations) {
		let ret = {
			columnMaps: {
				au: {},
				vector: {}
			}
		};

		// create empty columns structure
		delete columns.ready;
		_.each(columns, function(value){
			let columnRelation = {
				valueUseAs: [],
				valuesPeriods: []
			};
			ret.columnMaps.au[value.name] = columnRelation;
			ret.columnMaps.vector[value.name] = columnRelation;
		});

		// fill it with relations (valueUseAs's and valuesPeriods')
		_.each(relations, function(relation){
			if(relation.hasOwnProperty("fidColumn") && relation.fidColumn && relation.fidColumn.length){
				this.addRelationToColumnMap(ret, relation.fidColumn, "I");
			}
			if(relation.hasOwnProperty("nameColumn") && relation.nameColumn && relation.nameColumn.length){
				this.addRelationToColumnMap(ret, relation.nameColumn, "N");
			}
			if(relation.hasOwnProperty("parentColumn") && relation.parentColumn && relation.parentColumn.length){
				this.addRelationToColumnMap(ret, relation.parentColumn, "P");
			}

			if(relation.hasOwnProperty("columnMap") && relation.isOfAttributeSet){
				_.each(relation.columnMap, function(column){
					let keyString = relation.attributeSet.key + "-" + column.attribute.key;
					this.addRelationToColumnMap(ret, column.column, keyString, relation);
				}, this);
			}
		}, this);

		//console.log("_________ columns2state returns _________:\n", ret);

		let savedState = {};
		_.assign(savedState, ret);
		this.context.setStateDeep.call(this, {savedState: {$merge: savedState}}); // save store state for comparison with changed local
		return ret;
		//return mock;
	}

	/**
	 * Adds column / attribute relation to columnMap
	 * @param columnMap
	 * @param column
	 * @param value
	 * @param relation
	 */
	addRelationToColumnMap(columnMap, column, value, relation){
		var period = null;
		if(relation && relation.hasOwnProperty("period") && relation.period!==null) {
			period = relation.period.key;
		}else if(relation){
			console.log("======================================\n====== RELATION.period IS MISSING ======\n======================================");
		}
		columnMap.columnMaps.au[column].valueUseAs =
			_.union(columnMap.columnMaps.au[column].valueUseAs, [value]);
		if(period) columnMap.columnMaps.au[column].valuesPeriods =
			_.union(columnMap.columnMaps.au[column].valuesPeriods, [period]);

		if(value != "P") {
			columnMap.columnMaps.vector[column].valueUseAs =
				_.union(columnMap.columnMaps.vector[column].valueUseAs, [value]);
			if(period) columnMap.columnMaps.vector[column].valuesPeriods =
				_.union(columnMap.columnMaps.vector[column].valuesPeriods, [period]);
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


	onOpenScopeConfig() {
		this.context.onInteraction().call();
		if(this.state.place) {
			let itemType = ObjectTypes.SCOPE;
			var screenName = this.props.screenKey + "-ScreenMetadata" + itemType;
			this.context.openScreen(screenName,ScreenMetadataObject,this.props.parentUrl,{size:40},{objectType: itemType,objectKey:this.state.place.scope.key});
		}
	}


	onObjectClick (itemType, value, event) {
		console.log("yay! " + value.key);
		this.context.onInteraction().call();
		var screenName = this.props.screenKey + "-ScreenMetadata" + itemType;
		this.context.openScreen(screenName,ScreenMetadataObject,this.props.parentUrl,{size:40},{objectType: itemType,objectKey:value.key});
	}


	render() {


		return (
			<div>
				<h1 className="fit-after">{this.state.place ? this.state.place.name : " "}</h1>
				<div className="heading-sub">
					Scope:&nbsp;
					<UIScreenButton
						onClick={this.onOpenScopeConfig.bind(this)}
					>
						Local
					</UIScreenButton>
				</div>
				{/* <p>disable pass test: <b>{isParentScreenDisabled}</b></p> */}
				<h2>Attribute sets</h2>
				<LinkTableByScopePlace/>

				<h2>Vector layers</h2>
				<LinkTableVectorByScopePlace/>

				<h2>Raster layers</h2>
				<LinkTableRasterByScopePlace/>

			</div>
		);

	}
}

export default PlaceRelations;
