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
const SCOPES = [
	{key: 1, name: 'Local'},
	{key: 2, name: 'National'},
	{key: 3, name: 'Regional'}
];
const PLACES = [
	{key: 1, scope: 1, name: 'Cebu City'},
	{key: 2, scope: 1, name: 'Hai Phong'},
	{key: 3, scope: 1, name: 'Ho Chi Minh City'},
	{key: 4, scope: 1, name: 'Surabaya'},
	{key: 52, scope: 2, name: 'Brunei'},
	{key: 74, scope: 2, name: 'Japan'},
	{key: 82, scope: 2, name: 'Laos'},
	{key: 135, scope: 2, name: 'Vietnam'},
	{key: 625, scope: 3, name: 'East Asia and Pacific'},
];
const VECTORLAYERTEMPLATES = [
	{key: 1, name: 'Road network'},
	{key: 2, name: 'Hospitals'},
	{key: 3, name: 'Land cover'},
	{key: 4, name: 'Land cover change'},
	{key: 5, name: 'Possible low-income settlements (areals)'},
	{key: 7, name: 'Possible low-income settlements (mid-points)'}
];
const AULEVELS = [
	{key: 1, name: "AOI"},
	{key: 2, name: "Core City x Outer Urban Zone"},
	{key: 3, name: "GADM2"},
	{key: 4, name: "GADM3"},
	{key: 5, name: "GADM4"}
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
const PERIODS = [
	{key: 1, name: '1990'},
	{key: 2, name: '2000'},
	{key: 3, name: '2010'}
];
const TOPICS = [
	{key: 7, topic: 'Land cover structure', themes: [18, 23, 32]},
	{key: 12, topic: 'Land cover development', themes: [18, 23, 32]},
	{key: 16, topic: 'Urban population', themes: [30]},
	{key: 19, topic: 'Urban expansions', themes: [30]},
	{key: 22, topic: 'Total populations', themes: [25]},
	{key: 23, topic: 'Population density grid', themes: [18, 23, 25, 30, 32]},
	{key: 33, topic: 'Roads', themes: [18, 23, 32]}
];
const THEMES = [
	{key: 18, theme: 'Population'},
	{key: 23, theme: 'Transportation'},
	{key: 25, theme: 'Total population'},
	{key: 30, theme: 'Urban expansion'},
	{key: 32, theme: 'Land cover'}
];

var initialState = {
	savedState: {},
	layerType: null,
	scopes: [],
	places: [],
	vectorLayerTemplates: [],
	rasterLayerTemplates: [],
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
				if(this.state.layerType=="vector") {
					//console.log("isStateUnchanged vector");
					isIt = (
						this.state.valueVLTemplate==this.state.relationsState.valueVLTemplate &&
						this.state.valueVLScope==this.state.relationsState.valueVLScope &&
						this.state.valuesVLPlaces==this.state.relationsState.valuesVLPlaces &&
						this.state.valuesVLPeriods==this.state.relationsState.valuesVLPeriods
						// todo data table
					);
				} else if(this.state.layerType=="raster") {
					//console.log("isStateUnchanged raster");
					isIt = (
						this.state.valueRLTemplate==this.state.relationsState.valueRLTemplate &&
						this.state.valueRLScope==this.state.relationsState.valueRLScope &&
						this.state.valuesRLPlaces==this.state.relationsState.valuesRLPlaces &&
						this.state.valuesRLPeriods==this.state.relationsState.valuesRLPeriods
					);
				} else if(this.state.layerType=="au") {
					//console.log("isStateUnchanged au");
					isIt = (
						this.state.valueAULevel==this.state.relationsState.valueAULevel &&
						this.state.valueAUScope==this.state.relationsState.valueAUScope &&
						this.state.valuesAUPlaces==this.state.relationsState.valuesAUPlaces
						// todo data table
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
				this.addRelationToColumnMap(ret, relation.fidColumn, "I", relation);
			}
			if(relation.hasOwnProperty("nameColumn") && relation.nameColumn && relation.nameColumn.length){
				this.addRelationToColumnMap(ret, relation.nameColumn, "N", relation);
			}
			if(relation.hasOwnProperty("parentColumn") && relation.parentColumn && relation.parentColumn.length){
				this.addRelationToColumnMap(ret, relation.parentColumn, "P", relation, true);
			}

			if(relation.hasOwnProperty("columnMap")){
				_.each(relation.columnMap, function(column){
					this.addRelationToColumnMap(ret, column.column, column.attribute.key, relation);
				}, this);
			}
		}, this);

		console.log("_________ columns2state returns _________:\n", ret);

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
	 * @param notToVector
	 */
	addRelationToColumnMap(columnMap, column, value, relation, notToVector){
		var period = null;
		if(relation.hasOwnProperty("period") && relation.period!==null) {
			period = relation.period.key;
		}
		columnMap.columnMaps.au[column].valueUseAs =
			_.union(columnMap.columnMaps.au[column].valueUseAs, [value]);
		if(period) columnMap.columnMaps.au[column].valuesPeriods =
			_.union(columnMap.columnMaps.au[column].valuesPeriods, [period]);

		if(!notToVector) {
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

			//todo: Should be something like this
			//let savedState = {};
			//_.assign(savedState, ret);
			//ret.savedState = {relations: savedState}; // save store state for comparison with changed local
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
		if(this.state.layerType!="raster") {
			console.info("Only raster layers saved for now. Aborted.");
			return;
		}

		//do not even for now
		//console.info("Saving not working yet.");
		//return;

		var relations = this.state.layerRelations;
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
				values.periods = [null];
				break;
		}
		var layerTemplate = _.findWhere(layerTemplates,{key:values.template});

		// create common structure for newly created layerrefs
		var baseObject = {
			active: true, //todo active setting
			layerObject: layerTemplate,
			columnMap: [],
			isOfAttributeSet: false
		};
		// (later: ?attributeSet + isData + columnMap + xColumns? - for vector & au)
		// changed, changedBy done by server

		// save updated or new relations
		for (let placeValue of values.places) {
			for (let periodValue of values.periods) {
				let existingModel = _.find(relations, function(obj) {
					return ((obj.place.key == placeValue) && (obj.period.key == periodValue));
				});
				if (existingModel) {
					// exists -> update
					relations = _.reject(relations, function(item) { return item.key === existingModel.key; });
					let update = false;
					if(existingModel.layerObject.key!=layerTemplate.key){
						update = true;
						existingModel.layerObject = layerTemplate;
					}
					if(update) {
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

	/**
	 * Find objects to create among selected in (Object)Select
	 * @param values - selected objects
	 * @param objectType - data type for Action
	 * @param stateKey - state variable to store created object in
	 * @param stateHash - state hash to send along with action for later pairing
	 * @returns {Array} - values without new (those are added when handling action response)
	 */
	handleNewObjects(values, objectType, stateKey, stateHash) {
		// todo move function to utils? (common and static)
		var newValues = [];
		for (var singleValue of values) {
			if(singleValue.create){
				delete singleValue.create; // discard new object bit
				delete singleValue.label; // discard temp compatibility key
				delete singleValue.value; // discard temp compatibility key
				delete singleValue.key; // discard temp key = name
				let valueModel = new model[objectType](singleValue);
				ActionCreator.createObjectAndSetState(valueModel,objectType,stateKey,stateHash);
			}
			else {
				newValues.push(singleValue.key);
			}

		}
		return newValues;
	}

	onChangeObjectSelect (stateKey, objectType, value, values) {
		values = this.handleNewObjects(values, objectType, stateKey, this.getStateHash()); // todo store -> object type
		var newState = {};
		newState[stateKey] = values;
		this.setState(newState);
	}

	onObjectClick (value, event) {
		console.log("yay! " + value["key"]);
	}

	keyNameOptionFactory (inputValue) {
		var newOption = {
			key: inputValue,
			name: inputValue,
			value: inputValue,
			label: inputValue,
			create: true
		};
		return newOption;
	}

	onChangeColumnTableDestination (layerType, column, value, values) {
		console.log("layerType",layerType);
		console.log("column",column);
		console.log("value",value);
		//let stateUpdate = {};
		//stateUpdate.columnMaps[layerType][column].valueUseAs = value;
		//this.setState({columnMaps: {[layerType]: {[column]: {valueUseAs: value}}}});
	}
	onChangeColumnTablePeriods (layerType, column, value, values) {
		console.log("layerType",layerType);
		console.log("column",column);
		console.log("value",value);
		//let stateUpdate = {};
		//stateUpdate.columnMaps[layerType][column].valuePeriods = value;
		//this.setState(stateUpdate);
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
						onChangeTemplate={this.onChangeObjectSelect.bind(this, "valueVLTemplate", VECTORLAYERTEMPLATES)}
						onChangeScope={this.onChangeObjectSelect.bind(this, "valueVLScope", SCOPES)}
						onChangePlaces={this.onChangeObjectSelect.bind(this, "valuesVLPlaces", PLACES)}
						onChangePeriods={this.onChangeObjectSelect.bind(this, "valuesVLPeriods", PERIODS)}
						onObjectClick={this.onObjectClick.bind(this)}
						keyNameOptionFactory={this.keyNameOptionFactory.bind(this)}
						onChangeColumnTableDestination={this.onChangeColumnTableDestination.bind(this)}
						onChangeColumnTablePeriods={this.onChangeColumnTablePeriods.bind(this)}
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
						keyNameOptionFactory={this.keyNameOptionFactory.bind(this)}
					/>
				</div>
				<div
					className={this.state.layerType=="au" ? 'variant active' : 'variant'}
					id="config-data-layer-au"
				>
					<ConfigDataLayerAnalytical
						levels={AULEVELS}
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
						keyNameOptionFactory={this.keyNameOptionFactory.bind(this)}
						onChangeColumnTableDestination={this.onChangeColumnTableDestination.bind(this)}
						onChangeColumnTablePeriods={this.onChangeColumnTablePeriods.bind(this)}
					/>
				</div>

				{saveButton}

			</div>
		);

	}
}

export default ConfigDataLayer;
