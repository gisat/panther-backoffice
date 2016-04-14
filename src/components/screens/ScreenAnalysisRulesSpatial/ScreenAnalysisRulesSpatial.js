import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisRulesSpatial.css';
import withStyles from '../../../decorators/withStyles';
import path from "path";

import _ from 'underscore';
import utils from '../../../utils/utils';
import ActionCreator from '../../../actions/ActionCreator';
import ListenerHandler from '../../../core/ListenerHandler';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';
import AnalysisOperations, {analysisOperationsMetadata} from '../../../constants/AnalysisOperations';

import { Input, Icon, IconButton, Buttons } from '../../SEUI/elements';
import { Table } from '../../SEUI/collections';
import Select from 'react-select';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';
import OptionDestination from '../../atoms/UICustomSelect/OptionDestination';
import SingleValueDestination from '../../atoms/UICustomSelect/SingleValueDestination';

import AnalysisModel from '../../../models/AnalysisModel';
import VectorLayerStore from '../../../stores/VectorLayerStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';

import logger from '../../../core/Logger';

const OPERATIONS = [
			{ key: "COUNT", name: "COUNT"	},
			{ key: "SUM", name: "SUM (area/length)" },
			{ key: "SUMATT", name: "SUM (attribute)" },
			{ key: "AVG", name: "AVERAGE (area/length)" },
			{ key: "AVGATT", name: "AVERAGE (attribute)" },
			{ key: "AVGATTATT", name: "AVERAGE (attribute), weighted by attribute" }
		];
const ATTRIBUTES = [
			{
				key: 135,
				attset: "Land cover classes",
				name: "Continuous Urban Fabric (S.L. > 80%)"
			}, {
				key: 136,
				attset: "Land cover classes",
				name: "Discontinuous High Dense Urban Fabric (S.L. 50% - 80%)"
			}, {
				key: 137,
				attset: "Land cover classes",
				name: "Discontinuous Low Dense Urban Fabric (S.L.: 10% - 50%)"
			}, {
				key: 138,
				attset: "Land cover classes",
				name: "Industrial, Commercial and Transport Units"
			}, {
				key: 139,
				attset: "Land cover classes",
				name: "Construction sites"
			}, {
				key: 140,
				attset: "Land cover classes",
				name: "Urban greenery"
			}, {
				key: 160,
				attset: "Land cover feature data",
				name: "Population"
			}, {
				key: 162,
				attset: "Land cover feature data",
				name: "Drawing a blank"
			}
		];
const STATUSCODES = [
			{
				key: 111
			}, {
				key: 112
			}, {
				key: 113
			}, {
				key: 120
			}, {
				key: 130
			}, {
				key: 140
			}, {
				key: 200
			}, {
				key: 310
			}, {
				key: 320
			}, {
				key: 330
			}, {
				key: 510
			}, {
				key: 520
			}
];
const ATTSETS = [
			{ key: 352, name: "Land Cover classes L3" },
			{ key: 623, name: "Aggregated LC Classes Formation" },
			{ key: 18, name: "Populations1" },
			{ key: 28, name: "Status code" },
		];

var initialState = {
	featureLayers: [],
	attributeSetsResult: [],
	attributeSetsLayer: [],
	filterDestinations: null,
	valueFeatureLayer: [],
	valueResultAttSet: [],
	valueFilterAttSetAtt: [],
	valueAttributeMaps: {},
	themesString: ""
};


@withStyles(styles)
class ScreenAnalysisRulesSpatial extends Component{

	static propTypes = {
		disabled: PropTypes.bool,
		screenKey: PropTypes.string,
		data: PropTypes.shape({
			analysis: PropTypes.instanceOf(AnalysisModel).isRequired
		})
	};

	static defaultProps = {
		disabled: false,
		screenKey: null
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
		return {
			featureLayers: VectorLayerStore.getAll(), // filter by topics?
			attributeSetsResult: AttributeSetStore.getAll(), // filter by topics?
			attributeSetsLayer: utils.getAttSetsForLayers(props.data.analysis.layerObject.key),
			valueFeatureLayer: [props.data.analysis.layerObject.key],
			valueResultAttSet: [props.data.analysis.attributeSet.key],
			valueFilterAttSetAtt: props.data.analysis.filterAttribute ? [props.data.analysis.filterAttributeSet.key + "-" + props.data.analysis.filterAttribute.key] : []
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(props.data.analysis) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			this.context.setStateFromStores.call(this, store2state, keys);
			// if stores changed, overrides user input - todo fix
			if(!keys || keys.indexOf("attributeSetsLayer")!=-1) {
				store2state.attributeSetsLayer.then(function(attributeSets) {
					thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.atts2state(attributeSets));
				});
			}
			if(!keys || keys.indexOf("valueResultAttSet")!=-1) {
				let attributeMaps = {
					[props.data.analysis.attributeSet.key]: props.data.analysis.attributeMap
				};
				let newState = {
					valueAttributeMaps: {$merge: attributeMaps}
				};
				thisComponent.context.setStateDeep.call(thisComponent, newState);
			}
		}
	}

	_onStoreChange(keys) {
		this.setStateFromStores(this.props,keys);
	}

	_onStoreResponse(result,responseData,stateHash) {
		var thisComponent = this;
		if (stateHash === this.getStateHash()) {
			if (responseData.hasOwnProperty("stateKey") && responseData.stateKey) {
				let stateKey = responseData.stateKey;
				let values = utils.deepClone(thisComponent.state[stateKey]);
				values.push(result[0].key);
				thisComponent.setState({
					[stateKey]: values
				});
				var screenObjectType;
				switch(stateKey){
					case "valueFeatureLayer":
						screenObjectType = ObjectTypes.VECTOR_LAYER_TEMPLATE;
						break;
					case "valueResultAttSet":
					case "valueFilterAttSet":
						screenObjectType = ObjectTypes.ATTRIBUTE_SET;
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
		//this.changeListener.add(AnalysisStore, ["analysis"]);
		this.changeListener.add(VectorLayerStore, ["featureLayer"]);
		this.changeListener.add(AttributeSetStore, ["attributeSetsResult"]); // todo attributeSetsLayer
		this.responseListener.add(VectorLayerStore);
		this.responseListener.add(AttributeSetStore);

		this.setStateFromStores();
	}

	componentWillUnmount() { this.mounted = false;
		this.changeListener.clean();
		this.responseListener.clean();
	}


	/**
	 * Check if state is the same as it was when loaded from stores
	 * @returns {boolean}
	 */
	//isStateUnchanged() {
	//	var isIt = true;
	//	if(this.state.analysis) {
	//		isIt = (
	//			this.state.valueName == this.state.analysis.name &&
	//			_.isEqual(this.state.valueTopics,this.state.savedState.valueTopics)
	//		);
	//	}
	//	return isIt;
	//}

	/**
	 * Prepare options for data table selects
	 * Called in store2state().
	 * @param attributeSets
	 * @returns {{layerType: (null|*|layerType|{serverName}|{serverName, transformForLocal})}}
	 */
	atts2state(attributeSets) {
		var ret = {
			filterDestinations: null
		};
		if (attributeSets) {
			ret.filterDestinations = [];
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
						ret.filterDestinations.push(object);
					}
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
		this._stateHash = utils.stringHash(props.data.analysis.key.toString());
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}

	//saveForm() {
	//	var thisComponent = this;
	//	let objectType = null;
	//	switch(this.state.analysis.analysisType) {
	//		case "spatial":
	//			objectType = ObjectTypes.ANALYSIS_SPATIAL;
	//			break;
	//		case "level":
	//			objectType = ObjectTypes.ANALYSIS_LEVEL;
	//			break;
	//		case "math":
	//			objectType = ObjectTypes.ANALYSIS_MATH;
	//			break;
	//	}
	//	var actionData = [], modelData = {};
	//	//_.assign(modelData, this.state.analysis);
	//	modelData.key = this.state.analysis.key;
	//	modelData.name = this.state.valueName;
	//	modelData.topics = [];
	//	for (let key of this.state.valueTopics) {
	//		let topic = _.findWhere(this.state.topics, {key: key});
	//		modelData.topics.push(topic);
	//	}
	//
	//	let modelObj = new AnalysisModel(modelData);
	//	actionData.push({type:"update",model:modelObj});
	//	console.log("save analysis:", actionData);
	//	ActionCreator.handleObjects(actionData,objectType);
	//}


	getUrl() {
		return path.join(this.props.parentUrl, "rules");
	}

	getAnalysisType() {
		switch(this.props.data.analysis.analysisType) {
			case "spatial":
				return ObjectTypes.ANALYSIS_SPATIAL;
			case "level":
				return ObjectTypes.ANALYSIS_LEVEL;
			case "math":
				return ObjectTypes.ANALYSIS_MATH;
		}
	}

	onChangeFeatureLayer (value, values) {
		let newValue = utils.handleNewObjects(values, this.getAnalysisType(), {stateKey: "valueFeatureLayer"}, this.getStateHash());
		if (newValue.length) {

			var thisComponent = this;
			var layerAttSetsPromise = utils.getAttSetsForLayers(newValue);
			layerAttSetsPromise.then(function (layerAttSets) {

				let selectorValueAttSetAtt = null;
				if (layerAttSets.length == 1 && layerAttSets[0].attributes.length == 1) {
					selectorValueAttSetAtt = layerAttSets[0].key + "-" + layerAttSets[0].attributes[0].key;
				}
				logger.trace("ScreenAnalysisRulesSpatial# onChangeFeatureLayer(), Layer attribute sets: ", layerAttSets);
				let ret = thisComponent.atts2state(layerAttSets);
				let newState = {
					valueFeatureLayer: newValue,
					attributeSetsLayer: layerAttSets,
					valueFilterAttSetAtt: [selectorValueAttSetAtt]
				};
				_.assign(newState,ret);
				if(thisComponent.mounted) {
					thisComponent.setState(newState);
				}
			});

		} else {

			this.setState({
				valueFeatureLayer: newValue,
				attributeSetsLayer: [],
				filterDestinations: null,
				valueFilterAttSetAtt: []
			});

		}
	}

	onChangeResultAttSet (value, values) {
		let newValue = utils.handleNewObjects(values, this.getAnalysisType(), {stateKey: "valueResultAttSet"}, this.getStateHash());
		this.setState({
			valueResultAttSet: newValue
		});
	}

	onChangeFilterAttSetAtt (value, values) {
		let newValue = utils.handleNewObjects(values, this.getAnalysisType(), {stateKey: "valueFilterAttSetAtt"}, this.getStateHash());
		this.setState({
			valueFilterAttSetAtt: newValue
		});
	}

	onObjectClick (itemType, value, event) {
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


	render() {
		let ruleTableRowsInsert = [];
		if (
			this.state.featureLayers.length &&
			this.state.attributeSetsResult.length &&
			this.state.attributeSetsLayer.length &&
			this.state.filterDestinations
		) {
			//let ruleTableRowsInsert = [];
			let operations = _.values(analysisOperationsMetadata.SPATIAL);
			let resultAttSet = _.findWhere(this.state.attributeSetsResult, {key: this.state.valueResultAttSet[0]});
			for (let attribute of resultAttSet.attributes) {
				let attributeMap = this.state.valueAttributeMaps[this.state.valueResultAttSet];
				let attributeMapRow = _.findWhere(attributeMap, {attribute: attribute});
				let operationCellInsert = (
					<td className="allowOverflow resetui">
						<label className="container">
							Operation
							<Select
								//onChange={this.onChangeAttSet.bind(this)}
								//loadOptions={this.getPlaces}
								options={operations}
								valueKey="key"
								labelKey="name"
								//inputProps={selectInputProps}
								value={attributeMapRow.operationType}
							/>
						</label>
					</td>
				);
				let insertValueCell = false,
					insertWeightingCell = false,
					optionCellsInsert = null;
				switch (attributeMapRow.operationType) {
					case analysisOperationsMetadata.SPATIAL[AnalysisOperations.SPATIAL.SUM_ATTRIBUTE].key:
					case analysisOperationsMetadata.SPATIAL[AnalysisOperations.SPATIAL.AVG_ATTRIBUTE_WEIGHT_AREA].key:
						insertValueCell = true;
						break;
					case analysisOperationsMetadata.SPATIAL[AnalysisOperations.SPATIAL.AVG_ATTRIBUTE_WEIGHT_ATTRIBUTE].key:
						insertValueCell = true;
						insertWeightingCell = true;
						break;
				}
				if (!insertValueCell && !insertWeightingCell) {
					optionCellsInsert = (
						<td colSpan="2"></td>
					);
				} else {
					optionCellsInsert = [];
					optionCellsInsert.push((
						<td className="allowOverflow resetui">
							<label className="container">
								Attribute to average
								<Select
									//onChange={this.onChangeFilterAttSetAtt.bind(this)}
									options={this.state.filterDestinations}
									optionComponent={OptionDestination}
									singleValueComponent={SingleValueDestination}
									valueKey="key"
									labelKey="name"
									className={["435-432"].length ? "multiline" : ""}
									value={this.state.filterDestinations && this.state.filterDestinations.length ? ["435-432"] : []}
								/>
							</label>
						</td>
					));
					if (insertWeightingCell) {
						optionCellsInsert.push((
							<td className="allowOverflow resetui">
								<label className="container">
									Weighting attribute
									<Select
										//onChange={this.onChangeFilterAttSetAtt.bind(this)}
										options={this.state.filterDestinations}
										optionComponent={OptionDestination}
										singleValueComponent={SingleValueDestination}
										valueKey="key"
										labelKey="name"
										className={["435-432"].length ? "multiline" : ""}
										value={this.state.filterDestinations && this.state.filterDestinations.length ? ["435-432"] : []}
									/>
								</label>
							</td>
						));
					} else {
						optionCellsInsert.push((
							<td></td>
						));
					}
				}
				let filterCellInsert = (
					<td className="allowOverflow resetui">
						<label className="container">
							Code:
							<Input
								type="text"
								name="name"
								placeholder=" "
								defaultValue="112" // remove
								value={attributeMapRow.filterValue}
								//onChange={this.onChangeWhatever.bind(this)}
							/>
						</label>
					</td>
				);
				let rowInsert = (
					<tbody className="internal row">
					<tr className="row-header">
						<td colSpan="4" className="resetui">{attribute.name}</td>
					</tr>
					<tr>
						{operationCellInsert}
						{optionCellsInsert}
						{filterCellInsert}
					</tr>
					</tbody>
				);
				ruleTableRowsInsert.push(rowInsert);
			}
		}


		return (
			<div>
				<div className="screen-content-only"><div>

					<h2>Spatial analysis operations: {this.props.data.analysis.name}</h2>

					<div className="frame-input-wrapper">
						<label className="container">
							Feature layer (vector layer template)
							<UIObjectSelect
								onChange={this.onChangeFeatureLayer.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.VECTOR_LAYER_TEMPLATE)}
								options={this.state.featureLayers}
								valueKey="key"
								labelKey="name"
								value={this.state.valueFeatureLayer}
								className="template"
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Result attribute set
							<UIObjectSelect
								onChange={this.onChangeResultAttSet.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.ATTRIBUTE_SET)}
								//options={ATTSETS}
								options={this.state.attributeSetsResult}
								valueKey="key"
								labelKey="name"
								value={this.state.valueResultAttSet}
								className="template"
							/>
						</label>
					</div>

				<div className="frame-input-wrapper">
						<label className="container">
							Filter attribute
							<Select
								onChange={this.onChangeFilterAttSetAtt.bind(this)}
								options={this.state.filterDestinations}
								optionComponent={OptionDestination}
								singleValueComponent={SingleValueDestination}
								valueKey="key"
								labelKey="name"
								className={this.state.valueFilterAttSetAtt.length ? "multiline" : ""}
								value={this.state.valueFilterAttSetAtt}
							/>
						</label>
				</div>

				<Table celled className="fixed" id="AnalysisSpatialRuleTable">
					<thead>
						<tr>
							<th>Operation</th>
							<th colSpan="2"></th>
							<th>Filter</th>
						</tr>
					</thead>
					{ruleTableRowsInsert}
					{/*<tbody>

					<tr className="row-header">
							<td colSpan="4" className="resetui">Continuous Urban Fabric (S.L. > 80%)</td>
						</tr>
						<tr>
							<td className="allowOverflow resetui">
								<label className="container">
									Operation
									<Select
										//onChange={this.onChangeAttSet.bind(this)}
										//loadOptions={this.getPlaces}
										//options={OPERATIONS}
										options={_.values(analysisOperationsMetadata.SPATIAL)}
										valueKey="key"
										labelKey="name"
										//inputProps={selectInputProps}
										value="sumarea"
									/>
								</label>
							</td>
							<td colSpan="2"></td>
							<td className="allowOverflow resetui">
								<label className="container">
									Code:
									<Input
										type="text"
										name="name"
										placeholder=" "
										defaultValue="111" // remove
										//value={this.state.valueWhatever}
										//onChange={this.onChangeWhatever.bind(this)}
									/>
								</label>
							</td>
						</tr>

					</tbody>
					<tbody className="internal row">

						<tr className="row-header">
							<td colSpan="4" className="resetui">Discontinuous High Dense Urban Fabric (S.L. 50% - 80%)</td>
						</tr>
						<tr>
							<td className="allowOverflow resetui">
								<label className="container">
									Operation
									<Select
										//onChange={this.onChangeAttSet.bind(this)}
										//loadOptions={this.getPlaces}
										options={OPERATIONS}
										valueKey="key"
										labelKey="name"
										//inputProps={selectInputProps}
										value="AVGATTATT"
									/>
								</label>
							</td>
							<td className="allowOverflow resetui">
								<label className="container">
									Attribute to average
									<Select
										//onChange={this.onChangeFilterAttSetAtt.bind(this)}
										options={this.state.filterDestinations}
										optionComponent={OptionDestination}
										singleValueComponent={SingleValueDestination}
										valueKey="key"
										labelKey="name"
										className={["435-432"].length ? "multiline" : ""}
										value={this.state.filterDestinations && this.state.filterDestinations.length ? ["435-432"] : []}
									/>
								</label>
							</td>
							<td className="allowOverflow resetui">
								<label className="container">
									Weighting attribute
									<Select
										//onChange={this.onChangeFilterAttSetAtt.bind(this)}
										options={this.state.filterDestinations}
										optionComponent={OptionDestination}
										singleValueComponent={SingleValueDestination}
										valueKey="key"
										labelKey="name"
										className={["435-432"].length ? "multiline" : ""}
										value={this.state.filterDestinations && this.state.filterDestinations.length ? ["435-432"] : []}
									/>
								</label>
							</td>
							<td className="allowOverflow resetui">
								<label className="container">
									Code:
									<Input
										type="text"
										name="name"
										placeholder=" "
										defaultValue="112" // remove
										//value={this.state.valueWhatever}
										//onChange={this.onChangeWhatever.bind(this)}
									/>
								</label>
							</td>
						</tr>

					</tbody>
					<tbody className="internal row">

						<tr className="row-header">
							<td colSpan="4" className="resetui">Discontinuous Low Dense Urban Fabric (S.L.: 10% - 50%)</td>
						</tr>
						<tr>
							<td className="allowOverflow resetui">
								<label className="container">
									Operation
									<Select
										//onChange={this.onChangeAttSet.bind(this)}
										//loadOptions={this.getPlaces}
										options={OPERATIONS}
										valueKey="key"
										labelKey="name"
										//inputProps={selectInputProps}
										value="SUMATT"
									/>
								</label>
							</td>
							<td className="allowOverflow resetui">
								<label className="container">
									Attribute to sum
									<Select
										//onChange={this.onChangeFilterAttSetAtt.bind(this)}
										options={this.state.filterDestinations}
										optionComponent={OptionDestination}
										singleValueComponent={SingleValueDestination}
										valueKey="key"
										labelKey="name"
										className={["435-432"].length ? "multiline" : ""}
										value={this.state.filterDestinations && this.state.filterDestinations.length ? ["435-432"] : []}
									/>
								</label>
							</td>
							<td></td>
							<td className="allowOverflow resetui">
								<label className="container">
									Code:
									<Input
										type="text"
										name="name"
										placeholder=" "
										defaultValue="113" // remove
										//value={this.state.valueWhatever}
										//onChange={this.onChangeWhatever.bind(this)}
									/>
								</label>
							</td>
						</tr>


					</tbody>*/}
				</Table>

					<SaveButton saved />

			</div></div></div>
		);

	}
}

export default ScreenAnalysisRulesSpatial;
