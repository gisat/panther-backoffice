import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';
import styles from './ConfigDataLayer.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';
import path from "path";

import utils from '../../../utils/utils';
import {geonodeProtocol, geonodeHost} from '../../../config';

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

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';

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
class ConfigDataLayer extends PantherComponent {

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
		setStateDeep: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
		this.responseListener = new ListenerHandler(this, this._onStoreResponse, 'addResponseListener', 'removeResponseListener');
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
		logger.trace("ConfigDataLayer# setStateFromStores(), Props: ", props, ", Keys: ", keys);
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
		logger.trace("ConfigDataLayer# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	_onStoreResponse(result,responseData,stateHash) {
		var thisComponent = this;
		if (stateHash === this.getStateHash()) {
			logger.info("ConfigDataLayer# _onStoreResponse(), Result:", result, ", Response data:", responseData,
				", State hash:", stateHash);
			if (responseData.hasOwnProperty("stateKey") && responseData.stateKey) {
				logger.trace("ConfigDataLayer# _onStoreResponse(), Set state - periods:", thisComponent.state.periods);
				let stateKey = responseData.stateKey;
				let values = utils.deepClone(thisComponent.state[stateKey]);
				values.push(result[0].key);
				if(thisComponent.mounted) {
					thisComponent.setState({
							[stateKey]: values
						},
						function () {
							logger.info("ConfigDataLayer# _onStoreResponse(), Updated state:", thisComponent.state);
						});
				}
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
					let options = {
						component: ScreenMetadataObject,
						parentUrl: this.props.parentUrl,
						size: 40,
						data: {
							objectType: screenObjectType,
							objectKey: result[0].key
						}
					};
					ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
				}
			}
		}
	}

	componentDidMount() { this.mounted = true;
		this.changeListener.add(ScopeStore, ["scopes"]);
		this.responseListener.add(ScopeStore);
		this.changeListener.add(VectorLayerStore, ["vectorLayerTemplates"]);
		this.responseListener.add(VectorLayerStore);
		this.changeListener.add(RasterLayerStore, ["rasterLayerTemplates"]);
		this.responseListener.add(RasterLayerStore);
		this.changeListener.add(AULevelStore, ["auLevels"]);
		this.responseListener.add(AULevelStore);
		this.changeListener.add(AttributeSetStore, ["attributeSets"]);
		this.changeListener.add(AttributeStore, ["attributes"]);
		this.changeListener.add(PlaceStore, ["places"]);
		this.responseListener.add(PlaceStore);
		this.changeListener.add(PeriodStore, ["periods"]);
		this.responseListener.add(PeriodStore);
		this.changeListener.add(ObjectRelationStore,["layerRelations"]);
		this.changeListener.add(DataLayerColumnsStore,["dataLayerColumns"]);

		this.setStateFromStores();
	}

	componentWillUnmount() { this.mounted = false;
		this.changeListener.clean();
		this.responseListener.clean();
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
				if(this.state.layerType=="vector" && this.state.savedState.hasOwnProperty("columnMaps") && this.state.savedState.columnMaps.hasOwnProperty("vector")) {
					isIt = (
						_.isEqual(this.state.valueVLTemplate,this.state.savedState.valueVLTemplate) &&
						_.isEqual(this.state.valueVLScope,this.state.savedState.valueVLScope) &&
						_.isEqual(this.state.valuesVLPlaces,this.state.savedState.valuesVLPlaces) &&
						_.isEqual(this.state.valuesVLPeriods,this.state.savedState.valuesVLPeriods) &&
						_.isEqual(this.state.columnMaps.vector,this.state.savedState.columnMaps.vector)
					);
				} else if(this.state.layerType=="raster") {
					isIt = (
						_.isEqual(this.state.valueRLTemplate,this.state.savedState.valueRLTemplate) &&
						_.isEqual(this.state.valueRLScope,this.state.savedState.valueRLScope) &&
						_.isEqual(this.state.valuesRLPlaces,this.state.savedState.valuesRLPlaces) &&
						_.isEqual(this.state.valuesRLPeriods,this.state.savedState.valuesRLPeriods)
					);
				} else if(this.state.layerType=="au" && this.state.savedState.hasOwnProperty("columnMaps") && this.state.savedState.columnMaps.hasOwnProperty("au")) {
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
		logger.trace("ConfigDataLayer# isStateUnchanged(), Current state: ", this.state, ", It isn't changed: ", isIt);
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

		logger.trace("ConfigDataLayer# columns2state(), Returns:", ret);

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
			logger.warn("ConfigDataLayer# addRelationToColumnMap(), Relation period is missing.");
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
		if(relations.length > 0) {
			logger.trace("ConfigDataLayer# relations2state(): Relations", relations);
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
		super.saveForm();
		var AUPeriods = null;
		if(this.state.layerType == "au" && this.state.valueAUScope[0]){
			let scope = _.findWhere(this.state.scopes,{key: this.state.valueAUScope[0]});
			AUPeriods = _.map(scope.periods,function(period){
				return period.key;
			});
			//periodsPromise = utils.getPeriodsForScope(this.state.valueAUScope[0]);
		}
		var thisComponent = this;


		var relations = [];
		_.assign(relations, thisComponent.state.layerRelations);
		var actionData = [[],[]], layerTemplates = [], values = {};

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

		if (values.template && values.places && values.periods) {

			var layerTemplate = _.findWhere(layerTemplates, {key: values.template});

			if (thisComponent.state.layerType != "raster") {
				let map = thisComponent.state.columnMaps[thisComponent.state.layerType];
				for (let columnName in map) {
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

			if (values.fidColumn) baseObject.fidColumn = values.fidColumn;
			if (values.nameColumn) baseObject.nameColumn = values.nameColumn;
			if (values.parentColumn) baseObject.parentColumn = values.parentColumn;
			// (later: ?attributeSet + isData + columnMap + xColumns? - for vector & au)
			// changed, changedBy done by server

			// save updated or new relations
			for (let placeValue of values.places) {
				for (let periodValue of values.periods) {
					let existingModel = _.find(relations, function (obj) {
						return (
							(obj.place && (obj.place.key == placeValue)) &&
							(obj.period && (obj.period.key == periodValue)) && !obj.isOfAttributeSet
						);
					});
					if (existingModel) {
						// exists -> update
						if (
							existingModel.layerObject.key != layerTemplate.key ||
							existingModel.fidColumn != values.fidColumn ||
							existingModel.nameColumn != values.nameColumn ||
							existingModel.parentColumn != values.parentColumn
						) {
							existingModel.layerObject = layerTemplate;
							if (values.fidColumn) existingModel.fidColumn = values.fidColumn;
							if (values.nameColumn) existingModel.nameColumn = values.nameColumn;
							if (values.parentColumn) existingModel.parentColumn = values.parentColumn;
							actionData[0].push({type: "update", model: existingModel});
						}
						relations = _.reject(relations, function (item) {
							return item.key === existingModel.key;
						});
					} else {
						// does not exist -> create
						let object = {
							dataSource: _.findWhere(thisComponent.props.dataLayers, {key: thisComponent.props.selectorValue}),
							place: _.findWhere(thisComponent.state.places, {key: placeValue}),
							period: _.findWhere(thisComponent.state.periods, {key: periodValue})
						};
						object = _.assign(object, baseObject);
						let newModel = new Model[ObjectTypes.OBJECT_RELATION](object);
						actionData[0].push({type: "create", model: newModel});
					}
				}
			}
			// get all columnMaps periods
			let columnMapPeriods = [];
			let columnMapAttSets = [];
			_.each(thisComponent.state.columnMaps[thisComponent.state.layerType], function (column) {
				columnMapPeriods = _.union(columnMapPeriods, column.valuesPeriods);
				if (column.valueUseAs.length) {
					let destination = null;
					if (!_.contains(["I", "P", "N"], column.valueUseAs[0])) destination = _.findWhere(this.state.destinationsVL, {key: column.valueUseAs[0]});
					if (destination) columnMapAttSets.push(destination.attributeSetKey);
				}
			}, thisComponent);
			columnMapPeriods = _.uniq(columnMapPeriods);
			columnMapAttSets = _.uniq(columnMapAttSets);
			logger.trace("ConfigDataLayer# saveForm(), Column map periods", columnMapPeriods, "Column map attribute sets",
				columnMapAttSets);
			// get all columnMaps attributeSets

			// columnMap
			// create common structure for newly created layerrefs
			var baseObjectForColumnMap = {
				active: true, //todo active setting
				layerObject: layerTemplate,
				isOfAttributeSet: true
			};
			if (values.fidColumn) baseObjectForColumnMap.fidColumn = values.fidColumn;
			if (values.nameColumn) baseObjectForColumnMap.nameColumn = values.nameColumn;
			if (values.parentColumn) baseObjectForColumnMap.parentColumn = values.parentColumn;
			for (let placeValue of values.places) {
				for (let periodValue of columnMapPeriods) {
					for (let attSet of columnMapAttSets) {

						var columnMap = [];
						_.each(thisComponent.state.columnMaps[thisComponent.state.layerType], function (column, columnName) {
							if (_.contains(column.valuesPeriods, periodValue)) {
								if (column.valueUseAs.length && !_.contains(["I", "P", "N"], column.valueUseAs[0])) {
									let destination = _.findWhere(this.state.destinationsVL, {key: column.valueUseAs[0]});
									if (destination.attributeSetKey == attSet) {
										let attributeModel = _.findWhere(this.state.attributes, {key: destination.attributeKey});
										columnMap.push({
											attribute: attributeModel,
											column: columnName
										});
									}
								}
							}
						}, thisComponent);
						logger.trace("ConfigDataLayer# saveForm(), ColumnMap: ", columnMap);

						if (columnMap.length) {
							let existingModel = _.find(relations, function (obj) {
								return ((obj.place.key == placeValue) && (obj.period.key == periodValue) && obj.isOfAttributeSet && (obj.attributeSet.key == attSet));
							});
							if (existingModel) {
								// exists -> update
								if (
									existingModel.columnMap != columnMap || // todo working comparison :)
									existingModel.layerObject.key != layerTemplate.key ||
									existingModel.fidColumn != values.fidColumn ||
									existingModel.nameColumn != values.nameColumn ||
									existingModel.parentColumn != values.parentColumn
								) {
									existingModel.columnMap = columnMap;
									existingModel.layerObject = layerTemplate;
									if (values.fidColumn) existingModel.fidColumn = values.fidColumn;
									if (values.nameColumn) existingModel.nameColumn = values.nameColumn;
									if (values.parentColumn) existingModel.parentColumn = values.parentColumn;
									actionData[1].push({type: "update", model: existingModel});
								}
								relations = _.reject(relations, function (item) {
									return item.key === existingModel.key;
								});
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
								actionData[1].push({type: "create", model: newModel});
							}
						}
					}
				}
			}
		}

		// was not in valuesRLPlaces × valuesRLPeriods, thus was removed -> delete
		relations.map(function(unusedModel){
			actionData[1].push({type:"delete",model:unusedModel});
		});
		logger.trace("ConfigDataLayer# saveForm(), Action data:", actionData);
		ActionCreator.handleObjects(actionData,ObjectTypes.OBJECT_RELATION);

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
		logger.trace("ConfigDataLayer# onObjectClick(), Value" + value);
		this.context.onInteraction().call();
		var screenName = this.props.screenKey + "-ScreenMetadata" + itemType;
		let options = {
			component: ScreenMetadataObject,
			parentUrl: this.props.parentUrl,
			size: 40,
			data: {
				objectType: itemType,
				objectKey: value.key
			}
		};
		ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
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
		logger.trace("ConfigDataLayer# render(), This state: ", this.state, ", Relations state: ", this.state.relationsState);

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
			var mapImageSrc = geonodeProtocol + geonodeHost+ "/geoserver/geonode/wms/reflect?layers=" + this.props.selectorValue + "&width=800&transparent=true";

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
