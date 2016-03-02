import React, { PropTypes, Component } from 'react';
import styles from './ConfigDataLayer.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';
import path from "path";

import utils from '../../../utils/utils';
import {apiProtocol,apiHost} from '../../../config';

import Select from 'react-select';
import SaveButton from '../../atoms/SaveButton';

import ConfigDataLayerVector from '../ConfigDataLayerVector';
import ConfigDataLayerRaster from '../ConfigDataLayerRaster';
import ConfigDataLayerAnalytical from '../ConfigDataLayerAnalytical';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
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

const LAYERTYPES = [
	{key: "vector", name: "Vector layer"},
	{key: "raster", name: "Raster layer"},
	{key: "au", name: "Analytical units layer"}
];
const VLDESTINATIONS = [
	{key: "I", special: true, name: 'FID (feature identifier)'},
	{key: "N", special: true, name: 'Feature name'}
];
const AUDESTINATIONS = [
	{key: "I", special: true, name: 'FID (feature identifier)'},
	{key: "N", special: true, name: 'Feature name'},
	{key: "P", special: true, name: 'Parent feature identifier'}
];

var initialState = {
	savedState: {},
	layerType: null,
	scopes: [],
	places: [],
	vectorLayerTemplates: [],
	rasterLayerTemplates: [],
	auLevels: [],
	attributes: [],
	periods: [],
	valueVLTemplate: [],
	valueVLScope: [],
	valuesVLPlaces: [],
	valuesVLPeriods: [],
	valueRLTemplate: [],
	valueRLScope: [],
	valuesRLPlaces: [],
	valuesRLPeriods: [],
	valueAUScope: [],
	valuesAUPlaces: [],
	valueAULevel: [],
	dataLayerColumns: [],
	columnMaps: {
		au: {},
		vector: {}
	},
	destinationsVL: [],
	destinationsAU: []
};


@withStyles(styles)
class ConfigDataLayer extends Component {

	static propTypes = {
		disabled: React.PropTypes.bool,
		selectorValue: React.PropTypes.any,
		dataLayers: React.PropTypes.array
	};

	static defaultProps = {
		disabled: false,
		selectorValue: null,
		dataLayers: []
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
			places: PlaceStore.getAll(),
			vectorLayerTemplates: VectorLayerStore.getAll(),
			rasterLayerTemplates: RasterLayerStore.getAll(),
			auLevels: AULevelStore.getAll(),
			attributeSets: AttributeSetStore.getAll(),
			attributes: AttributeStore.getAll(),
			periods: PeriodStore.getAll(),
			layer: DataLayerStore.getById(props.selectorValue),
			layerRelations: ObjectRelationStore.getByDataSource(props.selectorValue),
			dataLayerColumns: DataLayerColumnsStore.getByDataSource(props.selectorValue)
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
		// todo determine from keys, if the following needs to be done
		if(!keys || keys.indexOf("layerRelations")!=-1) {
			store2state.layerRelations.then(function(relations) {
				thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.relations2state(relations));
			});
		}
		if(!keys || keys.indexOf("attributeSets")!=-1) {
			store2state.attributeSets.then(function(attributeSets) {
				thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.atts2state(attributeSets));
			});
		}
		if(!keys || keys.indexOf("layerRelations")!=-1 || keys.indexOf("dataLayerColumns")!=-1) {
			Promise.all([store2state.layerRelations, store2state.dataLayerColumns]).then(function([relations, columns]) {
				thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.columns2state(columns, relations));
			});
		}
	}

	_onStoreChange(keys) {
		//console.log("_onStoreChange() ===============");
		this.setStateFromStores(this.props,keys);
	}

	_onStoreResponse(result,responseData,stateHash) {
		var thisComponent = this;
		if (stateHash === this.getStateHash()) {
			//console.info("_onStoreResponse()");
			//console.log("result",result);
			//console.log("responseData",responseData);
			//console.log("stateHash",stateHash);
			if (responseData.hasOwnProperty("stateKey") && responseData.stateKey) {
				//console.log("_onStoreResponse set state: periods:", thisComponent.state.periods);
				let stateKey = responseData.stateKey;
				let values = utils.deepClone(thisComponent.state[stateKey]);
				values.push(result[0].key);
				thisComponent.setState({
					[stateKey]: values
				},
				function () {
					//console.log("_onStoreResponse updated state:", thisComponent.state);
				});
				var screenObjectType;
				switch(stateKey){
					case "valueVLTemplate":
						screenObjectType = ObjectTypes.VECTOR_LAYER_TEMPLATE;
						break;
					case "valueRLTemplate":
						screenObjectType = ObjectTypes.RASTER_LAYER_TEMPLATE;
						break;
					case "valueAULevel":
						screenObjectType = ObjectTypes.AU_LEVEL;
						break;
					case "valueVLScope":
					case "valueRLScope":
					case "valueAUScope":
						screenObjectType = ObjectTypes.SCOPE;
						break;
					case "valuesVLPlaces":
					case "valuesRLPlaces":
					case "valuesAUPlaces":
						screenObjectType = ObjectTypes.PLACE;
						break;
					case "valuesVLPeriods":
					case "valuesRLPeriods":
						screenObjectType = ObjectTypes.PERIOD;
						break;
				}
				var screenName = this.props.screenKey + "-ScreenMetadata" + screenObjectType;
				if(screenObjectType) {
					this.context.openScreen(screenName,ScreenMetadataObject,this.props.parentUrl,{size:40},{objectType: screenObjectType,objectKey:result[0].key});
				}
			}
		}
	}

	componentDidMount() {
		ScopeStore.addChangeListener(this._onStoreChange.bind(this,["scopes"]));
		ScopeStore.addResponseListener(this._onStoreResponse.bind(this));
		PlaceStore.addChangeListener(this._onStoreChange.bind(this,["places"]));
		PlaceStore.addResponseListener(this._onStoreResponse.bind(this));
		VectorLayerStore.addChangeListener(this._onStoreChange.bind(this,["vectorLayerTemplates"]));
		VectorLayerStore.addResponseListener(this._onStoreResponse.bind(this));
		RasterLayerStore.addChangeListener(this._onStoreChange.bind(this,["rasterLayerTemplates"]));
		RasterLayerStore.addResponseListener(this._onStoreResponse.bind(this));
		AULevelStore.addChangeListener(this._onStoreChange.bind(this,["auLevels"]));
		AULevelStore.addResponseListener(this._onStoreResponse.bind(this));
		AttributeSetStore.addChangeListener(this._onStoreChange.bind(this,["attributeSets"]));
		AttributeStore.addChangeListener(this._onStoreChange.bind(this,["attributes"]));
		PeriodStore.addChangeListener(this._onStoreChange.bind(this,["periods"]));
		PeriodStore.addResponseListener(this._onStoreResponse.bind(this));
		ObjectRelationStore.addChangeListener(this._onStoreChange.bind(this,["layerRelations"]));
		DataLayerColumnsStore.addChangeListener(this._onStoreChange.bind(this,["dataLayerColumns"]));
		this.setStateFromStores();
	}

	componentWillUnmount() {
		ScopeStore.removeChangeListener(this._onStoreChange.bind(this,["scopes"]));
		ScopeStore.removeResponseListener(this._onStoreResponse.bind(this));
		PlaceStore.removeChangeListener(this._onStoreChange.bind(this,["places"]));
		PlaceStore.removeResponseListener(this._onStoreResponse.bind(this));
		VectorLayerStore.removeChangeListener(this._onStoreChange.bind(this,["vectorLayerTemplates"]));
		VectorLayerStore.removeResponseListener(this._onStoreResponse.bind(this));
		RasterLayerStore.removeChangeListener(this._onStoreChange.bind(this,["rasterLayerTemplates"]));
		RasterLayerStore.removeResponseListener(this._onStoreResponse.bind(this));
		AULevelStore.removeChangeListener(this._onStoreChange.bind(this,["auLevels"]));
		AULevelStore.removeResponseListener(this._onStoreResponse.bind(this));
		AttributeSetStore.removeChangeListener(this._onStoreChange.bind(this,["attributeSets"]));
		AttributeStore.removeChangeListener(this._onStoreChange.bind(this,["attributes"]));
		PeriodStore.removeChangeListener(this._onStoreChange.bind(this,["periods"]));
		PeriodStore.removeResponseListener(this._onStoreResponse.bind(this));
		ObjectRelationStore.removeChangeListener(this._onStoreChange.bind(this,["layerRelations"]));
		DataLayerColumnsStore.removeChangeListener(this._onStoreChange.bind(this,["dataLayerColumns"]));
	}

	componentWillReceiveProps(newProps) {
		if(newProps.selectorValue!=this.props.selectorValue) {
			this.setStateFromStores(newProps,["layer","layerRelations","dataLayerColumns"]);
			//this.context.setStateFromStores.call(this, this.store2state(newProps));
			this.updateStateHash(newProps);
		}
	}

	/**
	 * Check if state is the same as it was when loaded from stores
	 * @returns {boolean}
	 */
	isStateUnchanged() {
		var isIt = true;
		if(this.state.hasOwnProperty("savedState")){
			if(this.state.layerType==this.state.savedState.layerType) {
				// todo could be universal? compare whatever properties savedState has?
				//console.log("isStateUnchanged layerType");
				if(this.state.layerType=="vector" && this.state.savedState.hasOwnProperty("columnMaps") && this.state.savedState.columnMaps.hasOwnProperty("vector")) {
					//console.log("isStateUnchanged vector");
					isIt = (
						_.isEqual(this.state.valueVLTemplate,this.state.savedState.valueVLTemplate) &&
						_.isEqual(this.state.valueVLScope,this.state.savedState.valueVLScope) &&
						_.isEqual(this.state.valuesVLPlaces,this.state.savedState.valuesVLPlaces) &&
						_.isEqual(this.state.valuesVLPeriods,this.state.savedState.valuesVLPeriods) &&
						_.isEqual(this.state.columnMaps.vector,this.state.savedState.columnMaps.vector)
					);
				} else if(this.state.layerType=="raster") {
					//console.log("isStateUnchanged raster");
					isIt = (
						_.isEqual(this.state.valueRLTemplate,this.state.savedState.valueRLTemplate) &&
						_.isEqual(this.state.valueRLScope,this.state.savedState.valueRLScope) &&
						_.isEqual(this.state.valuesRLPlaces,this.state.savedState.valuesRLPlaces) &&
						_.isEqual(this.state.valuesRLPeriods,this.state.savedState.valuesRLPeriods)
					);
				} else if(this.state.layerType=="au" && this.state.savedState.hasOwnProperty("columnMaps") && this.state.savedState.columnMaps.hasOwnProperty("au")) {
					//console.log("isStateUnchanged au");
					isIt = (
						_.isEqual(this.state.valueAULevel,this.state.savedState.valueAULevel) &&
						_.isEqual(this.state.valueAUScope,this.state.savedState.valueAUScope) &&
						_.isEqual(this.state.valuesAUPlaces,this.state.savedState.valuesAUPlaces) &&
						_.isEqual(this.state.columnMaps.au,this.state.savedState.columnMaps.au)
					);
				}
			} else {
				isIt = false;
			}
		} else {
			isIt = false;
		}
		//console.log("isIt",isIt);
		return isIt;
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
			layerType: null,
			valueVLTemplate: [],
			valueVLScope: [],
			valuesVLPlaces: [],
			valuesVLPeriods: [],
			valueRLTemplate: [],
			valueRLScope: [],
			valuesRLPlaces: [],
			valuesRLPeriods: [],
			valueAUScope: [],
			valuesAUPlaces: [],
			valueAULevel: []
		};
		relations = _.reject(relations, function (item) {
			return item.isOfAttributeSet;
		});
		if(relations.length > 0) {
			//console.log("store2state relations2state():");
			//console.log(relations);
			var layerType = relations[0].layerObject.layerType;
			ret.layerType = layerType;
			var values = {};
			relations.map(function(relation){
				if (relation.layerObject){
					values.template = [relation.layerObject.key];
				}
				if (relation.place){
					if (relation.place.scope){
						values.scope = [relation.place.scope.key];
					}
					values.places = _.union(values.places,[relation.place.key]);
				}
				if (relation.period){
					values.periods = _.union(values.periods,[relation.period.key]);
				}
			});
			switch (layerType) {
				case "vector":
					ret.valueVLTemplate = values.template;
					ret.valueVLScope = values.scope;
					ret.valuesVLPlaces = values.places;
					ret.valuesVLPeriods = values.periods;
					break;
				case "raster":
					ret.valueRLTemplate = values.template;
					ret.valueRLScope = values.scope;
					ret.valuesRLPlaces = values.places;
					ret.valuesRLPeriods = values.periods;
					break;
				case "au":
					ret.valueAULevel = values.template;
					ret.valueAUScope = values.scope;
					ret.valuesAUPlaces = values.places;
			}
		}
		let savedState = {};
		_.assign(savedState, ret);
		this.context.setStateDeep.call(this, {savedState: {$merge: savedState}}); // save store state for comparison with changed local
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



	saveForm() {

		var periodsPromise = null;
		if(this.state.layerType == "au"){
			periodsPromise = utils.getPeriodsForScope(this.state.valueAUScope[0]);
		}else{
			periodsPromise = Promise.resolve();
		}
		var thisComponent = this;
		periodsPromise.then(function(AUPeriods){

			var relations = [];
			_.assign(relations, thisComponent.state.layerRelations);
			var actionData = [], layerTemplates = [], values = {};
			switch (thisComponent.state.layerType) {
				case "raster":
					layerTemplates = thisComponent.state.rasterLayerTemplates;
					values.template = thisComponent.state.valueRLTemplate[0];
					values.places = thisComponent.state.valuesRLPlaces;
					values.periods = thisComponent.state.valuesRLPeriods;
					break;
				case "vector":
					layerTemplates = thisComponent.state.vectorLayerTemplates;
					values.template = thisComponent.state.valueVLTemplate[0];
					values.places = thisComponent.state.valuesVLPlaces;
					values.periods = thisComponent.state.valuesVLPeriods;
					break;
				case "au":
					layerTemplates = thisComponent.state.auLevels;
					values.template = thisComponent.state.valueAULevel[0];
					values.places = thisComponent.state.valuesAUPlaces;
					values.periods = AUPeriods;
					break;
			}

			var layerTemplate = _.findWhere(layerTemplates,{key:values.template});

			if(thisComponent.state.layerType != "raster"){
				let map = thisComponent.state.columnMaps[thisComponent.state.layerType];
				for(let columnName in map){
					if(map[columnName].valueUseAs[0] == "I") values.fidColumn = columnName;
					if(map[columnName].valueUseAs[0] == "N") values.nameColumn = columnName;
					if(map[columnName].valueUseAs[0] == "P") values.parentColumn = columnName;
				}
			}

			// create common structure for newly created layerrefs
			var baseObject = {
				active: true, //todo active setting
				layerObject: layerTemplate,
				columnMap: [],
				isOfAttributeSet: false
			};

			if(values.fidColumn) baseObject.fidColumn = values.fidColumn;
			if(values.nameColumn) baseObject.nameColumn = values.nameColumn;
			if(values.parentColumn) baseObject.parentColumn = values.parentColumn;
			// (later: ?attributeSet + isData + columnMap + xColumns? - for vector & au)
			// changed, changedBy done by server

			// save updated or new relations
			for (let placeValue of values.places) {
				for (let periodValue of values.periods) {
					let existingModel = _.find(relations, function(obj) {
						return ((obj.place.key == placeValue) && (obj.period.key == periodValue) && !obj.isOfAttributeSet);
					});
					if (existingModel) {
						// exists -> update
						relations = _.reject(relations, function(item) { return item.key === existingModel.key; });
						if(existingModel.layerObject.key!=layerTemplate.key){
							existingModel.layerObject = layerTemplate;
							if(values.fidColumn) existingModel.fidColumn = values.fidColumn;
							if(values.nameColumn) existingModel.nameColumn = values.nameColumn;
							if(values.parentColumn) existingModel.parentColumn = values.parentColumn;
							actionData.push({type:"update",model:existingModel});
						}
					} else {
						// does not exist -> create
						let object = {
							dataSource: _.findWhere(thisComponent.props.dataLayers,{key:thisComponent.props.selectorValue}),
							place: _.findWhere(thisComponent.state.places,{key:placeValue}),
							period: _.findWhere(thisComponent.state.periods,{key:periodValue})
						};
						object = _.assign(object,baseObject);
						let newModel = new Model[ObjectTypes.OBJECT_RELATION](object);
						actionData.push({type:"create",model:newModel});
					}
				}
			}
			// get all columnMaps periods
			let columnMapPeriods = [];
			let columnMapAttSets = [];
			_.each(thisComponent.state.columnMaps[thisComponent.state.layerType], function(column){
				columnMapPeriods = _.union(columnMapPeriods, column.valuesPeriods);
				if(column.valueUseAs.length) {
					let destination = null;
					if(!_.contains(["I","P","N"], column.valueUseAs[0])) destination = _.findWhere(this.state.destinationsVL, {key: column.valueUseAs[0]});
					if(destination) columnMapAttSets.push(destination.attributeSetKey);
				}
			}, thisComponent);
			columnMapPeriods = _.uniq(columnMapPeriods);
			columnMapAttSets = _.uniq(columnMapAttSets);
			//console.log("columnMapPeriods", columnMapPeriods);
			//console.log("columnMapAttSets", columnMapAttSets);
			// get all columnMaps attributeSets

			// columnMap
			// create common structure for newly created layerrefs
			var baseObjectForColumnMap = {
				active: true, //todo active setting
				layerObject: layerTemplate,
				isOfAttributeSet: true
			};
			if(values.fidColumn) baseObjectForColumnMap.fidColumn = values.fidColumn;
			if(values.nameColumn) baseObjectForColumnMap.nameColumn = values.nameColumn;
			if(values.parentColumn) baseObjectForColumnMap.parentColumn = values.parentColumn;
			for (let placeValue of values.places) {
				for (let periodValue of columnMapPeriods) {
					for (let attSet of columnMapAttSets) {

						var columnMap = [];
						_.each(thisComponent.state.columnMaps[thisComponent.state.layerType], function (column, columnName) {
							if (_.contains(column.valuesPeriods, periodValue)) {
								if (column.valueUseAs.length && !_.contains(["I", "P", "N"], column.valueUseAs[0])) {
									let destination = _.findWhere(this.state.destinationsVL, {key: column.valueUseAs[0]});
									if(destination.attributeSetKey == attSet) {
										let attributeModel = _.findWhere(this.state.attributes, {key: destination.attributeKey});
										columnMap.push({
											attribute: attributeModel,
											column: columnName
										});
									}
								}
							}
						}, thisComponent);
						//console.log("ColumnMap: ", columnMap);

						if (columnMap.length) {
							let existingModel = _.find(relations, function (obj) {
								return ((obj.place.key == placeValue) && (obj.period.key == periodValue) && obj.isOfAttributeSet && (obj.attributeSet.key == attSet));
							});
							if (existingModel) {
								// exists -> update
								existingModel.columnMap = columnMap;
								if(values.fidColumn) existingModel.fidColumn = values.fidColumn;
								if(values.nameColumn) existingModel.nameColumn = values.nameColumn;
								if(values.parentColumn) existingModel.parentColumn = values.parentColumn;
								relations = _.reject(relations, function (item) {
									return item.key === existingModel.key;
								});
								actionData.push({type: "update", model: existingModel});
							} else {
								// does not exist -> create
								let object = {
									dataSource: _.findWhere(thisComponent.props.dataLayers, {key: thisComponent.props.selectorValue}),
									place: _.findWhere(thisComponent.state.places, {key: placeValue}),
									period: _.findWhere(thisComponent.state.periods, {key: periodValue}),
									columnMap: columnMap,
									attributeSet: _.findWhere(thisComponent.state.attributeSets, {key: attSet})
								};
								object = _.assign(object, baseObjectForColumnMap);
								let newModel = new Model[ObjectTypes.OBJECT_RELATION](object);
								actionData.push({type: "create", model: newModel});
							}
						}
					}
				}
			}
			// was not in valuesRLPlaces × valuesRLPeriods, thus was removed -> delete
			relations.map(function(unusedModel){
				actionData.push({type:"delete",model:unusedModel});
			});
			//console.log("handleObjects() actionData", actionData);
			ActionCreator.handleObjects(actionData,ObjectTypes.OBJECT_RELATION);
		});

	}


	onChangeLayerType (value) {
		this.setState({
			layerType: value
		});
	}

	onChangeObjectSelect (stateKey, objectType, value, values) {
		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		var newState = {};
		newState[stateKey] = newValues;
		this.setState(newState);
	}

	onObjectClick (itemType, value, event) {
		console.log("yay! " + value.key);
		this.context.onInteraction().call();
		var screenName = this.props.screenKey + "-ScreenMetadata" + itemType;
		this.context.openScreen(screenName,ScreenMetadataObject,this.props.parentUrl,{size:40},{objectType: itemType,objectKey:value.key});
	}

	onChangeColumnTableSelect (stateKey, layerType, column, value, values) {
		let valueForState = [];
		for(let o of values) {
			valueForState.push(o.key);
		}
		this.context.setStateDeep.call(this, {
			columnMaps: {
				[layerType]: {
					[column]: {
						[stateKey]: {$set: valueForState}
					}
				}
			}
		});
	}


	render() {

		//console.log("------------ CONFIG-DATA-LAYER RENDER -----------");
		//console.log("this.state", this.state);
		//console.log("this.state.relationsState", this.state.relationsState);

		var saveButton = " ";
		if (this.state.layerType) {
			saveButton = (
				<SaveButton
					saved={this.isStateUnchanged()}
					className="save-button"
					onClick={this.saveForm.bind(this)}
				/>
			);
		}

		var prod = "Select layer type";
		if (!this.props.selectorValue) {
			prod = "Select data layer";
		}

		//var mapFrame = "";
		var mapImage = "";
		if(this.props.selectorValue) {

			//var mapFrameStyle = {
			//	border: 'none',
			//	width: '350px',
			//	height: '600px'
			//};
			var mapImageStyle = {
				border: '1px solid rgba(0,0,0,.15)'
			};
			//var mapFrameSrc = apiProtocol + apiHost+ "/geoserver/geonode/wms/reflect?layers=" + this.props.selectorValue + "&width=300&format=application/openlayers&transparent=true";
			var mapImageSrc = apiProtocol + apiHost+ "/geoserver/geonode/wms/reflect?layers=" + this.props.selectorValue + "&width=800&transparent=true";

			//// todo not an iframe
			//mapFrame = (
			//	<div className="beside">
			//		<iframe src={mapFrameSrc} style={mapFrameStyle}></iframe>
			//	</div>
			//);
			mapImage = (
				<div className="beside">
					<img src={mapImageSrc} style={mapImageStyle} />
				</div>
			);

		}

		//console.log("state DLC", this.state.dataLayerColumns);
		//console.log("state vecCM", this.state.columnMaps.vector);
		//console.log("state auCM", this.state.columnMaps.au);

		return (
			<div>

				{mapImage}

				<div
					//className="frame-input-wrapper"
					className={this.props.selectorValue ? 'frame-input-wrapper' : 'frame-input-wrapper hidden'}
				>
					<label className="container">
						Layer type
						<Select
							onChange={this.onChangeLayerType.bind(this)}
							options={LAYERTYPES}
							valueKey="key"
							labelKey="name"
							value={this.state.layerType}
							clearable={false}
						/>
					</label>
				</div>

				<div
					className={this.state.layerType==null ? 'variant active' : 'variant'}
					id="config-data-layer-none"
				>
					<div className="data-layers-no-type">
						{prod}
					</div>
				</div>
				<div
					className={this.state.layerType=="vector" ? 'variant active' : 'variant'}
					id="config-data-layer-vector"
				>
					<ConfigDataLayerVector
						layerTemplates={this.state.vectorLayerTemplates}
						scopes={this.state.scopes}
						places={this.state.places}
						periods={this.state.periods}
						destinations={this.state.destinationsVL}
						valueTemplate={this.state.valueVLTemplate}
						valueScope={this.state.valueVLScope}
						valuesPlaces={this.state.valuesVLPlaces}
						valuesPeriods={this.state.valuesVLPeriods}
						columnMap={this.state.columnMaps.vector}
						onChangeTemplate={this.onChangeObjectSelect.bind(this, "valueVLTemplate", ObjectTypes.VECTOR_LAYER_TEMPLATE)}
						onChangeScope={this.onChangeObjectSelect.bind(this, "valueVLScope", ObjectTypes.SCOPE)}
						onChangePlaces={this.onChangeObjectSelect.bind(this, "valuesVLPlaces", ObjectTypes.PLACE)}
						onChangePeriods={this.onChangeObjectSelect.bind(this, "valuesVLPeriods", ObjectTypes.PERIOD)}
						onObjectClick={this.onObjectClick.bind(this)}
						onChangeColumnTableDestination={this.onChangeColumnTableSelect.bind(this, "valueUseAs")}
						onChangeColumnTablePeriods={this.onChangeColumnTableSelect.bind(this, "valuesPeriods")}
					/>
				</div>
				<div
					className={this.state.layerType=="raster" ? 'variant active' : 'variant'}
					id="config-data-layer-raster"
				>
					<ConfigDataLayerRaster
						layerTemplates={this.state.rasterLayerTemplates}
						scopes={this.state.scopes}
						places={this.state.places}
						periods={this.state.periods}
						valueTemplate={this.state.valueRLTemplate}
						valueScope={this.state.valueRLScope}
						valuesPlaces={this.state.valuesRLPlaces}
						valuesPeriods={this.state.valuesRLPeriods}
						onChangeTemplate={this.onChangeObjectSelect.bind(this, "valueRLTemplate", ObjectTypes.RASTER_LAYER_TEMPLATE)}
						onChangeScope={this.onChangeObjectSelect.bind(this, "valueRLScope", ObjectTypes.SCOPE)}
						onChangePlaces={this.onChangeObjectSelect.bind(this, "valuesRLPlaces", ObjectTypes.PLACE)}
						onChangePeriods={this.onChangeObjectSelect.bind(this, "valuesRLPeriods", ObjectTypes.PERIOD)}
						onObjectClick={this.onObjectClick.bind(this)}
					/>
				</div>
				<div
					className={this.state.layerType=="au" ? 'variant active' : 'variant'}
					id="config-data-layer-au"
				>
					<ConfigDataLayerAnalytical
						levels={this.state.auLevels}
						scopes={this.state.scopes}
						places={this.state.places}
						periods={this.state.periods}
						destinations={this.state.destinationsAU}
						valueLevel={this.state.valueAULevel}
						valueScope={this.state.valueAUScope}
						valuesPlaces={this.state.valuesAUPlaces}
						columnMap={this.state.columnMaps.au}
						onChangeLevel={this.onChangeObjectSelect.bind(this, "valueAULevel", ObjectTypes.AU_LEVEL)}
						onChangeScope={this.onChangeObjectSelect.bind(this, "valueAUScope", ObjectTypes.SCOPE)}
						onChangePlaces={this.onChangeObjectSelect.bind(this, "valuesAUPlaces", ObjectTypes.PLACE)}
						onObjectClick={this.onObjectClick.bind(this)}
						onChangeColumnTableDestination={this.onChangeColumnTableSelect.bind(this, "valueUseAs")}
						onChangeColumnTablePeriods={this.onChangeColumnTableSelect.bind(this, "valuesPeriods")}
					/>
				</div>

				{saveButton}

			</div>
		);

	}
}

export default ConfigDataLayer;
