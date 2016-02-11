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

import ScreenMetadataPeriod from '../../screens/ScreenMetadataPeriod';

import ObjectTypes, {model} from '../../../constants/ObjectTypes';
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
		this.state = initialState;
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
		store2state.layerRelations.then(function(relations) {
			// todo we work with relations (attsets,columns) with .ready not removed
			thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.relations2state(relations),keys);
		});
		store2state.attributeSets.then(function(attributeSets) {
			thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.atts2state(attributeSets),keys);
		});
		Promise.all([store2state.layerRelations, store2state.dataLayerColumns]).then(function([relations, columns]) {
			thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.columns2state(columns, relations),keys);
		});
	}

	_onStoreChange(keys) {
		console.log("_onStoreChange() ===============");
		this.setStateFromStores(this.props,keys);
	}

	_onStoreResponse(result,stateKey,stateHash) {
		var thisComponent = this;
		if (stateHash === this.getStateHash()) {
			//console.info("_onStoreResponse()");
			//console.log("result",result);
			//console.log("stateKey",stateKey);
			//console.log("stateHash",stateHash);
			if (stateKey) {
				//console.log("_onStoreResponse set state: periods:", thisComponent.state.periods);
				let values = thisComponent.state[stateKey];
				values.push(result[0].key);
				thisComponent.setState({
					[stateKey]: values
				},
				function () {
					//console.log("_onStoreResponse updated state:", thisComponent.state);
				});
				var screenComponent,screenName;
				switch(stateKey){
					case "valuesVLPeriods":
					case "valuesRLPeriods":
						screenComponent = <ScreenMetadataPeriod/>;
						screenName = "ScreenDataLayersBase-ScreenMetadataPeriod";
						break;
				}
				this.context.openScreen(screenName,screenComponent,this.props.parentUrl,{size:40},{initialKey:result[0].key});
			}
		}
	}

	componentDidMount() {
		ScopeStore.addChangeListener(this._onStoreChange.bind(this,["scopes"]));
		PlaceStore.addChangeListener(this._onStoreChange.bind(this,["places"]));
		VectorLayerStore.addChangeListener(this._onStoreChange.bind(this,["vectorLayerTemplates"]));
		RasterLayerStore.addChangeListener(this._onStoreChange.bind(this,["rasterLayerTemplates"]));
		AULevelStore.addChangeListener(this._onStoreChange.bind(this,["auLevels"]));
		AttributeSetStore.addChangeListener(this._onStoreChange);
		PeriodStore.addChangeListener(this._onStoreChange.bind(this,["periods"]));
		PeriodStore.addResponseListener(this._onStoreResponse.bind(this));
		ObjectRelationStore.addChangeListener(this._onStoreChange.bind(this,["layerRelations"]));
		DataLayerColumnsStore.addChangeListener(this._onStoreChange.bind(this,["dataLayerColumns"]));
		this.setStateFromStores();
	}

	componentWillUnmount() {
		ScopeStore.removeChangeListener(this._onStoreChange.bind(this,["scopes"]));
		PlaceStore.removeChangeListener(this._onStoreChange.bind(this,["places"]));
		VectorLayerStore.removeChangeListener(this._onStoreChange.bind(this,["vectorLayerTemplates"]));
		RasterLayerStore.removeChangeListener(this._onStoreChange.bind(this,["rasterLayerTemplates"]));
		AULevelStore.removeChangeListener(this._onStoreChange.bind(this,["auLevels"]));
		AttributeSetStore.removeChangeListener(this._onStoreChange);
		PeriodStore.removeChangeListener(this._onStoreChange.bind(this,["periods"]));
		PeriodStore.removeResponseListener(this._onStoreResponse.bind(this));
		ObjectRelationStore.removeChangeListener(this._onStoreChange.bind(this,["layerRelations"]));
		DataLayerColumnsStore.removeChangeListener(this._onStoreChange.bind(this,["dataLayerColumns"]));
	}

	componentWillReceiveProps(newProps) {
		if(newProps.selectorValue!=this.props.selectorValue) {
			this.setStateFromStores(newProps);
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
		if(this.state.hasOwnProperty("relationsState")){
			if(this.state.layerType==this.state.relationsState.layerType) {
				// todo could be universal? compare whatever properties relationsState has?
				//console.log("isStateUnchanged layerType");
				if(this.state.layerType=="vector" && this.state.savedState.hasOwnProperty("columnMaps") && this.state.savedState.columnMaps.hasOwnProperty("vector")) {
					//console.log("isStateUnchanged vector");
					isIt = (
						this.state.valueVLTemplate==this.state.relationsState.valueVLTemplate &&
						this.state.valueVLScope==this.state.relationsState.valueVLScope &&
						this.state.valuesVLPlaces==this.state.relationsState.valuesVLPlaces &&
						this.state.valuesVLPeriods==this.state.relationsState.valuesVLPeriods &&
						this.state.columnMaps.vector==this.state.savedState.columnMaps.vector
					);
				} else if(this.state.layerType=="raster") {
					//console.log("isStateUnchanged raster");
					isIt = (
						this.state.valueRLTemplate==this.state.relationsState.valueRLTemplate &&
						this.state.valueRLScope==this.state.relationsState.valueRLScope &&
						this.state.valuesRLPlaces==this.state.relationsState.valuesRLPlaces &&
						this.state.valuesRLPeriods==this.state.relationsState.valuesRLPeriods
					);
				} else if(this.state.layerType=="au" && this.state.savedState.hasOwnProperty("columnMaps") && this.state.savedState.columnMaps.hasOwnProperty("au")) {
					//console.log("isStateUnchanged au");
					isIt = (
						this.state.valueAULevel==this.state.relationsState.valueAULevel &&
						this.state.valueAUScope==this.state.relationsState.valueAUScope &&
						this.state.valuesAUPlaces==this.state.relationsState.valuesAUPlaces &&
						this.state.columnMaps.au==this.state.savedState.columnMaps.au
					);
				}
			} else {
				isIt = false;
			}
		} else {
			isIt = false;
		}
		//console.log(isIt);
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
		this.context.setStateDeep.call(this, {savedState: {$set: savedState}}); // save store state for comparison with changed local
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
			let relationsState = {};
			_.assign(relationsState, ret);
			ret.relationsState = relationsState; // save store state for comparison with changed local

			//todo, Tom: Should be something like this
			//let savedState = {};
			//_.assign(savedState, ret);
			//this.context.setStateDeep.call(this, {savedState: {$set: savedState}}); // save store state for comparison with changed local
		}
		//todo 2: Shouldn't it be here?
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
		// only raster layers for now - todo the rest
		//if(this.state.layerType!="raster") {
		//	console.info("Only raster layers saved for now. Aborted.");
		//	return;
		//}

		//do not even for now
		//console.info("Saving not working yet.");
		//return;

		var relations = [];
		_.assign(relations, this.state.layerRelations);
		var actionData = [], layerTemplates = [], values = {};
		switch (this.state.layerType) {
			case "raster":
				layerTemplates = this.state.rasterLayerTemplates;
				values.template = this.state.valueRLTemplate[0];
				values.places = this.state.valuesRLPlaces;
				values.periods = this.state.valuesRLPeriods;
				break;
			case "vector":
				layerTemplates = this.state.vectorLayerTemplates;
				values.template = this.state.valueVLTemplate[0];
				values.places = this.state.valuesVLPlaces;
				values.periods = this.state.valuesVLPeriods;
				break;
			case "au":
				layerTemplates = this.state.auLevels;
				values.template = this.state.valueAULevel[0];
				values.places = this.state.valuesAUPlaces;
				values.periods = utils.getPeriodsForScope(this.state.valueAUScope[0]);
				break;
		}
		var layerTemplate = _.findWhere(layerTemplates,{key:values.template});

		if(this.state.layerType != "raster"){
			let map = this.state.columnMaps[this.state.layerType];
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
						dataSource: _.findWhere(this.props.dataLayers,{key:this.props.selectorValue}),
						place: _.findWhere(this.state.places,{key:placeValue}),
						period: _.findWhere(this.state.periods,{key:periodValue})
					};
					object = _.assign(object,baseObject);
					let newModel = new model[ObjectTypes.OBJECT_RELATION](object);
					actionData.push({type:"create",model:newModel});
				}
			}
		}
		// get all columnMaps periods
		let columnMapPeriods = [];
		let columnMapAttSets = [];
		_.each(this.state.columnMaps[this.state.layerType], function(column){
			columnMapPeriods = _.union(columnMapPeriods, column.valuesPeriods);
			if(column.valueUseAs.length) {
				let destination = null;
				if(!_.contains(["I","P","N"], column.valueUseAs[0])) destination = _.findWhere(this.state.destinationsVL, {key: column.valueUseAs[0]});
				if(destination) columnMapAttSets.push(destination.attributeSetKey);
			}
		}, this);
		columnMapPeriods = _.uniq(columnMapPeriods);
		columnMapAttSets = _.uniq(columnMapAttSets);
		console.log("columnMapPeriods", columnMapPeriods);
		console.log("columnMapAttSets", columnMapAttSets);
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
					_.each(this.state.columnMaps[this.state.layerType], function (column, columnName) {
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
					}, this);
					console.log("ColumnMap: ", columnMap);

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
								dataSource: _.findWhere(this.props.dataLayers, {key: this.props.selectorValue}),
								place: _.findWhere(this.state.places, {key: placeValue}),
								period: _.findWhere(this.state.periods, {key: periodValue}),
								columnMap: columnMap,
								attributeSet: _.findWhere(this.state.attributeSets, {key: attSet})
							};
							object = _.assign(object, baseObjectForColumnMap);
							let newModel = new model[ObjectTypes.OBJECT_RELATION](object);
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
		console.log("handleObjects() actionData", actionData);
		ActionCreator.handleObjects(actionData,ObjectTypes.OBJECT_RELATION);
	}


	onChangeLayerType (value) {
		this.setState({
			layerType: value
		});
	}

	onChangeObjectSelect (stateKey, objectType, value, values) {
		values = utils.handleNewObjects(values, objectType, stateKey, this.getStateHash()); // todo store -> object type
		var newState = {};
		newState[stateKey] = values;
		this.setState(newState);
	}

	onObjectClick (value, event) {
		console.log("yay! " + value["key"]);
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

		console.log("------------ CONFIG-DATA-LAYER RENDER -----------");
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

		var mapFrame = "";
		if(this.props.selectorValue) {

			var mapFrameStyle = {
				border: 'none',
				width: '350px',
				height: '600px'
			};
			var mapFrameSrc = apiProtocol + apiHost+ "/geoserver/geonode/wms/reflect?layers=" + this.props.selectorValue + "&width=300&format=application/openlayers&transparent=true";

			// todo not an iframe
			mapFrame = (
				<div className="beside">
					<iframe src={mapFrameSrc} style={mapFrameStyle}></iframe>
				</div>
			);

		}

		//console.log("state DLC", this.state.dataLayerColumns);
		//console.log("state vecCM", this.state.columnMaps.vector);
		//console.log("state auCM", this.state.columnMaps.au);

		return (
			<div>

				{mapFrame}

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
