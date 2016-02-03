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

import ObjectTypes from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import DataLayerStore from '../../../stores/DataLayerStore';
import ObjectRelationStore from '../../../stores/ObjectRelationStore';
import ScopeStore from '../../../stores/ScopeStore';
import PlaceStore from '../../../stores/PlaceStore';
import VectorLayerStore from '../../../stores/VectorLayerStore';
import RasterLayerStore from '../../../stores/RasterLayerStore';
import AULevelStore from '../../../stores/AULevelStore';
//import AttributeStore from '../../../stores/AttributeStore';
import PeriodStore from '../../../stores/PeriodStore';

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
	{key: "I", isAttribute: false, name: 'FID (feature identifier)'},
	{key: "N", isAttribute: false, name: 'Feature name'},
	{key: 220, isAttribute: true, attset: "Change code", name: 'LCF code'},
	{key: 221, isAttribute: true, attset: "Change code", name: 'Current code'},
	{key: 222, isAttribute: true, attset: "Change code", name: 'Previous code'},
	{key: 223, isAttribute: true, attset: "Change code", name: 'UF code'},
	{key: 287, isAttribute: true, attset: "Status code", name: 'Code'},
	{key: 315, isAttribute: true, attset: "Aggregated LC Classes", name: 'Urban fabric'},
	{key: 316, isAttribute: true, attset: "Aggregated LC Classes", name: 'Artificial areas'},
	{key: 317, isAttribute: true, attset: "Aggregated LC Classes", name: 'Natural and semi-natural areas'},
	{key: 318, isAttribute: true, attset: "Aggregated LC Classes", name: 'Water'}
];
const AUDESTINATIONS = [
	{key: "I", isAttribute: false, name: 'FID (feature identifier)'},
	{key: "N", isAttribute: false, name: 'Feature name'},
	{key: "P", isAttribute: false, name: 'Parent feature identifier'}
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
	valueAULevel: []
};


@withStyles(styles)
class ConfigDataLayer extends Component {

	static propTypes = {
		disabled: React.PropTypes.bool,
		selectorValue: React.PropTypes.any
	};

	static defaultProps = {
		disabled: false,
		selectorValue: null
	};

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		onSetScreenData: PropTypes.func.isRequired,
		openScreen: PropTypes.func.isRequired
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
			//auLevels: AULevelStore.getAll(),
			//attributes: AttributeStore.getAll(),
			periods: PeriodStore.getAll(),
			layer: DataLayerStore.getById(props.selectorValue),
			layerRelations: ObjectRelationStore.getByDataSource(props.selectorValue)
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
			thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.relations2state(relations),keys);
		});
	}

	_onStoreChange(keys) {
		console.log("_onStoreChange() ===============");
		// todo updates from all stores every time - should it?
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
		//AULevelStore.addChangeListener(this._onStoreChange);
		//AttributeStore.addChangeListener(this._onStoreChange);
		PeriodStore.addChangeListener(this._onStoreChange.bind(this,["periods"]));
		PeriodStore.addResponseListener(this._onStoreResponse.bind(this));
		//PeriodStore.addObjectCreateListener(this._onStoreObjectCreate.bind(this));
		this.setStateFromStores();
	}

	componentWillUnmount() {
		ScopeStore.removeChangeListener(this._onStoreChange.bind(this,["scopes"]));
		PlaceStore.removeChangeListener(this._onStoreChange.bind(this,["places"]));
		VectorLayerStore.removeChangeListener(this._onStoreChange.bind(this,["vectorLayerTemplates"]));
		RasterLayerStore.removeChangeListener(this._onStoreChange.bind(this,["rasterLayerTemplates"]));
		//AULevelStore.removeChangeListener(this._onStoreChange);
		//AttributeStore.removeChangeListener(this._onStoreChange);
		PeriodStore.removeChangeListener(this._onStoreChange.bind(this,["periods"]));
		PeriodStore.removeResponseListener(this._onStoreResponse.bind(this));
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
	 * Read relations from corresponding ObjectRelation objects.
	 * Called in store2state().
	 * @param relations
	 * @returns {{layerType: (null|*|layerType|{serverName}|{serverName, transformForLocal})}}
	 */
	relations2state(relations) {
		if(relations.length > 0) {
			//console.log("store2state relations2state():");
			//console.log(relations);
			var layerType = relations[0].layerObject[0].layerType;
			var ret = {
				layerType: layerType
			};
			if(layerType=="vector"){
				ret.valuesVLPlaces = [];
				ret.valuesVLPeriods = [];
				relations.map(function(relation){
					if (relation.layerObject.length > 0){
						ret.valueVLTemplate = [relation.layerObject[0].key];
					}
					if (relation.place.length > 0){
						if (relation.place[0].scope.length > 0){
							ret.valueVLScope = [relation.place[0].scope[0].key];
						}
						ret.valuesVLPlaces = _.union(ret.valuesVLPlaces,[relation.place[0].key]);
					}
					if (relation.period.length > 0){
						ret.valuesVLPeriods = _.union(ret.valuesVLPeriods,[relation.period[0].key]);
					}
				});
			}
			else if(layerType=="raster"){
				ret.valuesRLPlaces = [];
				ret.valuesRLPeriods = [];
				relations.map(function(relation){
					if (relation.layerObject.length > 0){
						ret.valueRLTemplate = [relation.layerObject[0].key];
					}
					if (relation.place.length > 0){
						if (relation.place[0].scope.length > 0){
							ret.valueRLScope = [relation.place[0].scope[0].key];
						}
						ret.valuesRLPlaces = _.union(ret.valuesRLPlaces,[relation.place[0].key]);
					}
					if (relation.period.length > 0){
						ret.valuesRLPeriods = _.union(ret.valuesRLPeriods,[relation.period[0].key]);
					}
				});
			}
			else if(layerType=="au"){

			}
			ret.relationsState = ret; // save store state for comparison with changed local
			return ret;
		}
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

		var actionData = [];

		var simplifiedRelationObjects = [];
		this.state.layerRelations.map(function(relationObject){
			let simplifiedRelationObject = {
				key: relationObject.key,
				place: relationObject.place[0],
				period: relationObject.period[0]
			};
			simplifiedRelationObjects.push(simplifiedRelationObject);
		});
		//console.log("simplifiedRelationObjects", simplifiedRelationObjects);

		// create common structure for newly created layerrefs
		var layerTemplateValue = this.state.valueRLTemplate[0];
		var baseObject = {
			active: true, //todo active setting
			areaTemplate: layerTemplateValue,
			columnMap: [],
			isData: false
		};
		// (later: ?attributeSet + isData + columnMap + xColumns? - for vector & au)
		// changed, changedBy done by server

		// save updated or new relations
		for (let placeValue of this.state.valuesRLPlaces) {
			for (let periodValue of this.state.valuesRLPeriods) {
				let existingObject = _.find(simplifiedRelationObjects, function(obj) {
					return ((obj.place.key == placeValue) && (obj.period.key == periodValue));
				});
				if (existingObject) {
					// exists -> update
					simplifiedRelationObjects = _.reject(simplifiedRelationObjects, function(item) { return item.key === existingObject.key; });
					let object = {
						_id: existingObject.key,
						areaTemplate: layerTemplateValue,
						location: placeValue,
						year: periodValue
						// todo active
					};
					// ACTION UPDATE LAYERREF (object)
					//ActionCreator.updateObject(object,ObjectTypes.OBJECT_RELATION);
					actionData.push({type:"update",object:object});
					console.log("update object:",object);
				} else {
					// does not exist -> create
					let object = {
						layer: this.props.selectorValue,
						location: placeValue,
						year: periodValue
					};
					object = _.assign(object,baseObject);
					// ACTION CREATE LAYERREF (object)
					//ActionCreator.createObject(object,ObjectTypes.OBJECT_RELATION);
					actionData.push({type:"create",object:object});
					console.log("create object:",object);
				}
			}
		}
		// remove removed relations
		simplifiedRelationObjects.map(function(unusedObject){
			let object = {
				_id: unusedObject.key,
				//location: unusedObject.place.key,
				//year: unusedObject.period.key
			};
			// ACTION DELETE LAYERREF (object)
			//ActionCreator.deleteObject(object,ObjectTypes.OBJECT_RELATION);
			actionData.push({type:"delete",object:object});
			console.log("delete object:",object);
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
	 * @returns {Array} - values without new (those are added when handling action response)
	 */
	handleNewObjects(values, objectType, stateKey) {
		var newValues = [];
		for (var singleValue of values) {
			if(singleValue.create){
				// replace with actual object creation and config screen opening
				delete singleValue.create;
				delete singleValue.label;
				delete singleValue.value;
				//singleValue.key = Math.floor((Math.random() * 10000) + 1);
				//store.push(singleValue);
				// todo move function to utils? (common and static)
				let stateHash = this.getStateHash();
				ActionCreator.createObjectAndSetState(singleValue,objectType,stateKey,stateHash);
			}
			else {
				newValues.push(singleValue.key);
			}

		}
		return newValues;
	}

	onChangeObjectSelect (stateKey, objectType, value, values) {
		values = this.handleNewObjects(values, objectType, stateKey); // todo store -> object type
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



	render() {

		//console.log("render() ----------");
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
						destinations={VLDESTINATIONS}
						valueTemplate={this.state.valueVLTemplate}
						valueScope={this.state.valueVLScope}
						valuesPlaces={this.state.valuesVLPlaces}
						valuesPeriods={this.state.valuesVLPeriods}
						onChangeTemplate={this.onChangeObjectSelect.bind(this, "valueVLTemplate", VECTORLAYERTEMPLATES)}
						onChangeScope={this.onChangeObjectSelect.bind(this, "valueVLScope", SCOPES)}
						onChangePlaces={this.onChangeObjectSelect.bind(this, "valuesVLPlaces", PLACES)}
						onChangePeriods={this.onChangeObjectSelect.bind(this, "valuesVLPeriods", PERIODS)}
						onObjectClick={this.onObjectClick.bind(this)}
						keyNameOptionFactory={this.keyNameOptionFactory.bind(this)}
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
						destinations={AUDESTINATIONS}
						valueLevel={this.state.valueAULevel}
						valueScope={this.state.valueAUScope}
						valuesPlaces={this.state.valuesAUPlaces}
						onChangeLevel={this.onChangeObjectSelect.bind(this, "valueAULevel", AULEVELS)}
						onChangeScope={this.onChangeObjectSelect.bind(this, "valueAUScope", SCOPES)}
						onChangePlaces={this.onChangeObjectSelect.bind(this, "valuesAUPlaces", PLACES)}
						onObjectClick={this.onObjectClick.bind(this)}
						keyNameOptionFactory={this.keyNameOptionFactory.bind(this)}
					/>
				</div>

				{saveButton}

			</div>
		);

	}
}

export default ConfigDataLayer;
