import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import styles from './ConfigDataLayer.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';
import path from "path";

import utils from '../../../utils/utils';
import {geoserverProtocol, geoserverAddress} from '../../../config';

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
	layerType: null,
	valueTemplate: [],
	valueScope: [],
	valuePlaces: [],
	valuePeriods: [],
	columnMap: {}
};

var initialAltState = {
	vector: {
		current: utils.clone(initialState),
		saved: utils.clone(initialState)
	},
	raster: {
		current: utils.clone(initialState),
		saved: utils.clone(initialState)
	},
	au: {
		current: utils.clone(initialState),
		saved: utils.clone(initialState)
	}
};


@withStyles(styles)
class ConfigDataLayer extends ControllerComponent {

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
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state.current = _.assign(this.state.current, utils.deepClone(initialState));
		this._altState = utils.deepClone(initialAltState);
	}

	buildState(props) {
		if (!props) {
			props = this.props;
		}
		let relations2state = this.relations2state(props.store.relations);
		let columnMap = this.columns2state(relations2state.layerType, props.store.dataLayerColumns, props.store.relations);
		return {
			layerType: relations2state.layerType,
			valueTemplate: relations2state.valueTemplate,
			valueScope: relations2state.valueScope,
			valuePlaces: relations2state.valuePlaces,
			valuePeriods: relations2state.layerType=='au' ? [] : relations2state.valuePeriods,
			columnMap: columnMap
		}
	}

	_onStoreResponse(result,responseData,stateHash) {
		var thisComponent = this;
		if (stateHash === this.getStateHash()) {
			logger.info("ConfigDataLayer# _onStoreResponse(), Result:", result, ", Response data:", responseData,
				", State hash:", stateHash);
			if (responseData.hasOwnProperty("stateKey") && responseData.stateKey) {
				let stateKey = responseData.stateKey;
				let values = utils.deepClone(thisComponent.state.current[stateKey]);
				values.push(result[0].key);
				if(thisComponent.mounted) {
					thisComponent.setCurrentState({
							[stateKey]: values
						},
						function () {
							logger.info("ConfigDataLayer# _onStoreResponse(), Updated state:", thisComponent.state);
						});
				}
				var screenObjectType = responseData.objectType;
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

	componentDidMount() {
		super.componentDidMount();
		this.responseListener.add(ScopeStore);
		this.responseListener.add(VectorLayerStore);
		this.responseListener.add(RasterLayerStore);
		this.responseListener.add(AULevelStore);
		this.responseListener.add(PlaceStore);
		this.responseListener.add(PeriodStore);
	}

	componentWillReceiveProps(newProps) {
		super.componentWillReceiveProps(newProps);
		this.updateStateHash(newProps);
	}


	/**
	 * Prepare columns and selects relations.
	 * Called in store2state().
	 * @param layerType
	 * @param columns
	 * @param relations
	 * @returns {{}}
	 */
	columns2state(layerType, columns, relations) {
		let ret = {};

		// create empty columns structure
		delete columns.ready;
		_.each(columns, function(value){
			ret[value.name] = {
				valueUseAs: [],
				valuesPeriods: []
			};
		});

		// fill it with relations (valueUseAs's and valuesPeriods')
		_.each(relations, function(relation){
			if(relation.hasOwnProperty("fidColumn") && relation.fidColumn && relation.fidColumn.length){
				this.addRelationToColumnMap(ret, relation.fidColumn, "I", layerType);
			}
			if(relation.hasOwnProperty("nameColumn") && relation.nameColumn && relation.nameColumn.length){
				this.addRelationToColumnMap(ret, relation.nameColumn, "N", layerType);
			}
			if(relation.hasOwnProperty("parentColumn") && relation.parentColumn && relation.parentColumn.length){
				this.addRelationToColumnMap(ret, relation.parentColumn, "P", layerType);
			}

			if(relation.hasOwnProperty("columnMap") && relation.isOfAttributeSet){
				_.each(relation.columnMap, function(column){
					let keyString = relation.attributeSet.key + "-" + column.attribute.key;
					this.addRelationToColumnMap(ret, column.column, keyString, layerType, relation);
				}, this);
			}

		}, this);

		logger.trace("ConfigDataLayer# columns2state(), props:",this.props.store.dataLayerColumns," Returns:", ret);

		return ret;
		//return mock;
	}

	/**
	 * Adds column / attribute relation to columnMap
	 * @param columnMap
	 * @param column
	 * @param value
	 * @param layerType
	 * @param relation
	 */
	addRelationToColumnMap(columnMap, column, value, layerType, relation){
		var period = null;
		if(relation) {
			if (relation.hasOwnProperty("period") && relation.period !== null) {
				period = relation.period.key;
			}
			else {
				logger.warn("ConfigDataLayer# addRelationToColumnMap(), Relation period is missing.");
			}
		}

		if (!(layerType == "vector" && value == "P")) {
			columnMap[column].valueUseAs = _.union(columnMap[column].valueUseAs, [value]);
			if(period) {
				columnMap[column].valuesPeriods = _.union(columnMap[column].valuesPeriods, [period]);
			}
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
			valueTemplate: [],
			valueScope: [],
			valuePlaces: [],
			valuePeriods: []
		};
		if(relations.length > 0) {
			logger.trace("ConfigDataLayer# relations2state(): Relations", relations);
			ret.layerType = relations[0].layerObject.layerType;
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

			ret.valueTemplate = values.template;
			ret.valueScope = values.scope;
			ret.valuePlaces = values.places;
			ret.valuePeriods = values.periods;

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
		this._stateHash = utils.stringHash("ConfigDataLayer" + props.selectorValue);
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
		if(this.state.current.layerType == "au" && this.state.current.valueScope[0]){
			let scope = _.findWhere(this.props.store.scopes,{key: this.state.current.valueScope[0]});
			AUPeriods = _.map(scope.periods,function(period){
				return period.key;
			});
			//periodsPromise = utils.getPeriodsForScope(this.state.valueAUScope[0]);
		}
		var thisComponent = this;


		var relations = [];
		_.assign(relations, thisComponent.props.store.relations);
		var actionData = [[],[]], layerTemplates = [], values = {};

		switch (thisComponent.state.current.layerType) {
			case "raster":
				layerTemplates = thisComponent.props.store.rasterLayerTemplates;
				values.template = thisComponent.state.current.valueTemplate[0];
				values.places = thisComponent.state.current.valuePlaces;
				values.periods = thisComponent.state.current.valuePeriods;
				break;
			case "vector":
				layerTemplates = thisComponent.props.store.vectorLayerTemplates;
				values.template = thisComponent.state.current.valueTemplate[0];
				values.places = thisComponent.state.current.valuePlaces;
				values.periods = thisComponent.state.current.valuePeriods;
				break;
			case "au":
				layerTemplates = thisComponent.props.store.auLevels;
				values.template = thisComponent.state.current.valueTemplate[0];
				values.places = thisComponent.state.current.valuePlaces;
				values.periods = AUPeriods;
				break;
		}

		if (values.template && values.places && values.periods) {

			var layerTemplate = _.findWhere(layerTemplates, {key: values.template});

			if (thisComponent.state.current.layerType != "raster") {
				let map = thisComponent.state.current.columnMap;
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
							// Add to the updated models.
							actionData[0].push({type: "update", model: existingModel});
						}
						// Remove already existing relation from relations.
						relations = _.reject(relations, function (item) {
							return item.key === existingModel.key;
						});
					} else {
						// does not exist -> create
						// Possibly take a look at the usage of Number.
						let object = {
							dataSource: _.findWhere(thisComponent.props.store.dataLayers, {key: thisComponent.props.selectorValue}),
							place: _.findWhere(thisComponent.props.store.places, {key: placeValue}),
							period: _.findWhere(thisComponent.props.store.periods, {key: periodValue})
						};
						object = _.assign(object, baseObject);
						let newModel = new Model[ObjectTypes.OBJECT_RELATION](object);
						// Add creation of the new model.
						actionData[0].push({type: "create", model: newModel});
					}
				}
			}
			// get all columnMaps periods
			let columnMapPeriods = [];
			let columnMapAttSets = [];
			_.each(thisComponent.state.current.columnMap, function (column) {
				columnMapPeriods = _.union(columnMapPeriods, column.valuesPeriods);
				if (column.valueUseAs.length) {
					//let destination = null;
					if (!_.contains(["I", "P", "N"], column.valueUseAs[0])) {
						//destination = _.findWhere(this.state.destinationsVL, {key: column.valueUseAs[0]});
						columnMapAttSets.push(column.valueUseAs[0].split('-',2)[0]);
					}
				}
			}, thisComponent);
			columnMapPeriods = _.uniq(columnMapPeriods);
			columnMapAttSets = _.uniq(columnMapAttSets);
			// Now I should have all uniques periods and unique attribute sets. This specifies the layers we must create.
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
						_.each(thisComponent.state.current.columnMap, function (column, columnName) {
							if (_.contains(column.valuesPeriods, periodValue)) {
								if (column.valueUseAs.length && !_.contains(["I", "P", "N"], column.valueUseAs[0])) {
									let destination = column.valueUseAs[0].split('-',2);
									if (destination[0] == attSet) {
										let attributeModel = _.findWhere(this.props.store.attributes, {key: destination[1]});
										if(!attributeModel) {
											attributeModel = _.findWhere(this.props.store.attributes, {key: Number(destination[1])});
										}
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
									dataSource: _.findWhere(thisComponent.props.store.dataLayers, {key: thisComponent.props.selectorValue}),
									place: _.findWhere(thisComponent.props.store.places, {key: placeValue}),
									period: _.findWhere(thisComponent.props.store.periods, {key: periodValue}),
									columnMap: columnMap,
									attributeSet: _.findWhere(thisComponent.props.store.attributeSets, {key: Number(attSet)})
								};

								object = _.assign(object, baseObjectForColumnMap);
								let newModel = new Model[ObjectTypes.OBJECT_RELATION](object);
								actionData[1].push({type: "create", model: newModel});
							}
						}
					}
				}
			}
		} else {
			// Verify existence of all necessary data.
			if(!values.places) {
				alert("At least one place must be associated with the data layer.")
			} else if(!values.periods) {
				alert("Chosen Scope doesn't have any associated time period. Please fix this before continuing.")
			}

			if(thisComponent.state.current.layerType == 'au') {
				if(!values.template) {
					alert("The level of the analytical units is required.");
				}
			} else {
				if(!values.template) {
					alert("Please specify the layer template.");
				}
			}

			// TODO: Verify the FID as well.

			this.setState({
				saving: false
			});
			return;
		}

		// was not in valuePlaces × valuePeriods, thus was removed -> delete
		relations.map(function(unusedModel){
			actionData[1].push({type:"delete",model:unusedModel});
		});
		logger.trace("ConfigDataLayer# saveForm(), Action data:", actionData);
		ActionCreator.handleObjects(actionData,ObjectTypes.OBJECT_RELATION);

	}

	shouldComponentUpdate(nextProps, nextState) {
		var result = !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
		if(!result) {
			return false;
		} else {
			return true;
		}
	}


	onChangeLayerType (value) {
		let currentType = this.state.current.layerType;
		let nextType = value;
		if (currentType != nextType) {

			this._altState[currentType] = {
				current: this.state.current,
				saved: this.state.saved
			};

			let nextStates = this._altState[nextType];
			nextStates.current.layerType = nextType;

			if(!Object.keys(nextStates.current.columnMap).length) {
				let columnMap = this.columns2state(nextType, this.props.store.dataLayerColumns, this.props.store.relations);
				nextStates.current.columnMap = utils.clone(columnMap);
				nextStates.saved.columnMap = utils.clone(columnMap);
			}

			this.setState({
				current: nextStates.current,
				saved: nextStates.saved
			});
		}
	}

	onChangeObjectSelect (stateKey, objectType, value, values) {
		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		var newState = {};
		newState[stateKey] = newValues;
		this.setCurrentState(newState);
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
		super.setStateDeep({
			current: {
				columnMap: {
					[column]: {
						[stateKey]: {$set: valueForState}
					}
				}
			}
		});
	}


	/**
	 * Prepare options for data table selects
	 * Called in store2state().
	 * @param attributeSets
	 * @returns {[]}
	 */
	prepareDestinations(attributeSets) {
		var ret = [];
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
		if (this.state.current.layerType=="vector") {
			ret = _.union(VLDESTINATIONS, attsetatts);
		}
		else if (this.state.current.layerType=="au") {
			ret = _.union(AUDESTINATIONS, attsetatts);
		}
		return ret;
	}

	render() {
		logger.trace("ConfigDataLayer# render(), This state: ", this.state, ", Relations state: ", this.state.relationsState, ", Built state: ", this.state.built);
		let ret = null;

		if(this.state.built) {
			let places = [];
			if(this.state.current.valueScope && this.state.current.valueScope.length > 0) {
				let scope = _.findWhere(this.props.store.scopes, {key: this.state.current.valueScope[0]});
				places = _.where(this.props.store.places, {scope: scope});
			}
			let destinations = this.prepareDestinations(this.props.store.attributeSets);

			var saveButton = " ";
			if (this.state.current.layerType) {
				saveButton = (
					<SaveButton
						saved={this.equalStates(this.state.current, this.state.saved)}
						saving={this.state.saving}
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
			if (this.props.selectorValue) {

				var dataLayer = _.findWhere(this.props.dataLayers, {key: this.props.selectorValue});

				//var mapFrameStyle = {
				//	border: 'none',
				//	width: '350px',
				//	height: '600px'
				//};
				var mapImageStyle = {
					border: '1px solid rgba(0,0,0,.15)'
				};
				//var mapFrameSrc = apiProtocol + apiHost+ "/geoserver/geonode/wms/reflect?layers=" + this.props.selectorValue + "&width=300&format=application/openlayers&transparent=true";
				var mapImageSrc = geoserverProtocol + geoserverAddress + "/" + dataLayer.geoserverWorkspace + "/wms/reflect?layers=" + dataLayer.key + "&width=800&transparent=true";

				//// todo not an iframe
				//mapFrame = (
				//	<div className="beside">
				//		<iframe src={mapFrameSrc} style={mapFrameStyle}></iframe>
				//	</div>
				//);
				mapImage = (
					<div className="beside">
						<img src={mapImageSrc} style={mapImageStyle}/>
					</div>
				);

			}

			ret = (
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
								value={this.state.current.layerType}
								clearable={false}
							/>
						</label>
					</div>

					<div
						className={this.state.current.layerType == null ? 'variant active' : 'variant'}
						id="config-data-layer-none"
					>
						<div className="data-layers-no-type">
							{prod}
						</div>
					</div>
					<div
						className={this.state.current.layerType == "vector" ? 'variant active' : 'variant'}
						id="config-data-layer-vector"
					>
						<ConfigDataLayerVector
							layerTemplates={this.props.store.vectorLayerTemplates}
							scopes={this.props.store.scopes}
							places={places}
							periods={this.props.store.periods}
							destinations={destinations}
							valueTemplate={this.state.current.valueTemplate}
							valueScope={this.state.current.valueScope}
							valuesPlaces={this.state.current.valuePlaces}
							valuesPeriods={this.state.current.valuePeriods}
							columnMap={this.state.current.columnMap}
							onChangeTemplate={this.onChangeObjectSelect.bind(this, "valueTemplate", ObjectTypes.VECTOR_LAYER_TEMPLATE)}
							onChangeScope={this.onChangeObjectSelect.bind(this, "valueScope", ObjectTypes.SCOPE)}
							onChangePlaces={this.onChangeObjectSelect.bind(this, "valuePlaces", ObjectTypes.PLACE)}
							onChangePeriods={this.onChangeObjectSelect.bind(this, "valuePeriods", ObjectTypes.PERIOD)}
							onObjectClick={this.onObjectClick.bind(this)}
							onChangeColumnTableDestination={this.onChangeColumnTableSelect.bind(this, "valueUseAs")}
							onChangeColumnTablePeriods={this.onChangeColumnTableSelect.bind(this, "valuesPeriods")}
						/>
					</div>
					<div
						className={this.state.current.layerType == "raster" ? 'variant active' : 'variant'}
						id="config-data-layer-raster"
					>
						<ConfigDataLayerRaster
							layerTemplates={this.props.store.rasterLayerTemplates}
							scopes={this.props.store.scopes}
							places={places}
							periods={this.props.store.periods}
							valueTemplate={this.state.current.valueTemplate}
							valueScope={this.state.current.valueScope}
							valuesPlaces={this.state.current.valuePlaces}
							valuesPeriods={this.state.current.valuePeriods}
							onChangeTemplate={this.onChangeObjectSelect.bind(this, "valueTemplate", ObjectTypes.RASTER_LAYER_TEMPLATE)}
							onChangeScope={this.onChangeObjectSelect.bind(this, "valueScope", ObjectTypes.SCOPE)}
							onChangePlaces={this.onChangeObjectSelect.bind(this, "valuePlaces", ObjectTypes.PLACE)}
							onChangePeriods={this.onChangeObjectSelect.bind(this, "valuePeriods", ObjectTypes.PERIOD)}
							onObjectClick={this.onObjectClick.bind(this)}
						/>
					</div>
					<div
						className={this.state.current.layerType == "au" ? 'variant active' : 'variant'}
						id="config-data-layer-au"
					>
						<ConfigDataLayerAnalytical
							levels={this.props.store.auLevels}
							scopes={this.props.store.scopes}
							places={places}
							periods={this.props.store.periods}
							destinations={destinations}
							valueLevel={this.state.current.valueTemplate}
							valueScope={this.state.current.valueScope}
							valuesPlaces={this.state.current.valuePlaces}
							columnMap={this.state.current.columnMap}
							onChangeLevel={this.onChangeObjectSelect.bind(this, "valueTemplate", ObjectTypes.AU_LEVEL)}
							onChangeScope={this.onChangeObjectSelect.bind(this, "valueScope", ObjectTypes.SCOPE)}
							onChangePlaces={this.onChangeObjectSelect.bind(this, "valuePlaces", ObjectTypes.PLACE)}
							onObjectClick={this.onObjectClick.bind(this)}
							onChangeColumnTableDestination={this.onChangeColumnTableSelect.bind(this, "valueUseAs")}
							onChangeColumnTablePeriods={this.onChangeColumnTableSelect.bind(this, "valuesPeriods")}
						/>
					</div>

					{saveButton}

				</div>
			);
		}

		return ret;
	}
}

export default ConfigDataLayer;
