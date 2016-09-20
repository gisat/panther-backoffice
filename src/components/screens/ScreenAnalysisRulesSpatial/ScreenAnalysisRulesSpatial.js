import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisRulesSpatial.css';
import withStyles from '../../../decorators/withStyles';
import path from "path";

import _ from 'underscore';
import utils from '../../../utils/utils';
import logger from '../../../core/Logger';
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
import AnalysisStore from '../../../stores/AnalysisStore';
import VectorLayerStore from '../../../stores/VectorLayerStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import PantherComponent from "../../common/PantherComponent";


var initialState = {
	featureLayers: [],
	attributeSetsResult: [],
	attributeSetsLayer: [],
	filterDestinations: null,
	valueFeatureLayer: [],
	valueResultAttSet: [],
	valueFilterAttSetAtt: [],
	valueAttributeMaps: {}
};


@withStyles(styles)
class ScreenAnalysisRulesSpatial extends PantherComponent {

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
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
		this.responseListener = new ListenerHandler(this, this._onStoreResponse, 'addResponseListener', 'removeResponseListener');
	}

	store2state(props, analysis) {
		if (!analysis) {
			analysis = props.data.analysis;
		}
		return {
			analysis: analysis,
			featureLayers: VectorLayerStore.getAll(), // filter by topics?
			attributeSetsResult: AttributeSetStore.getAll(), // filter by topics?
			attributeSetsLayer: analysis.layerObject ? utils.getAttSetsForLayers(analysis.layerObject.key) : Promise.resolve([]),
			valueFeatureLayer: analysis.layerObject ? [analysis.layerObject.key] : [],
			valueResultAttSet: analysis.attributeSet ? [analysis.attributeSet.key] : [],
			valueFilterAttSetAtt: analysis.filterAttribute ? [analysis.filterAttributeSet.key + "-" + analysis.filterAttribute.key] : []
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(props.data.analysis) {
			var thisComponent = this;
			let analysisPromise = null;
			if (!keys || keys.indexOf("analysis")!=-1) {
				analysisPromise = AnalysisStore.getById(props.data.analysis.key);
			} else {
				analysisPromise = Promise.resolve(this.state.analysis);
			}
			analysisPromise.then(function(analysis){

				let store2state = thisComponent.store2state(props,analysis);
				super.setStateFromStores(store2state, keys);
				// if stores changed, overrides user input - todo fix
				if(!keys || keys.indexOf("attributeSetsLayer")!=-1) {
					store2state.attributeSetsLayer.then(function(attributeSets) {
						super.setStateFromStores(thisComponent.atts2state(attributeSets));
					});
				}
				if(analysis.attributeSet && analysis.attributeMap && (!keys || keys.indexOf("valueResultAttSet")!=-1)) {
					let attributeMaps = {
						[analysis.attributeSet.key]: analysis.attributeMap
					};
					let newState = {
						valueAttributeMaps: {$merge: attributeMaps}
					};
					super.setStateDeep(newState);
				}

			});

		}
	}

	_onStoreChange(keys) {
		logger.trace("ScreenAnalysisRulesSpatial# _onStoreChange(), Keys:", keys);
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

	componentDidMount() {
		super.componentDidMount();
		this.changeListener.add(AnalysisStore, ["analysis"]);
		this.changeListener.add(VectorLayerStore, ["featureLayer"]);
		this.changeListener.add(AttributeSetStore, ["attributeSetsResult"]); // todo attributeSetsLayer
		this.responseListener.add(VectorLayerStore);
		this.responseListener.add(AttributeSetStore);

		this.setStateFromStores();
	}

	componentWillReceiveProps(newProps) {
		if (
			this.state.analysis &&
			(
				(this.state.analysis.key != newProps.data.analysis.key) ||
				(this.state.analysis.changed != newProps.data.analysis.changed)
			)
		) {
			// analysis was switched or updated outside
			if (this.isStateUnchanged()) {
				// form was not edited, it's okay to reload
				logger.trace("ScreenAnalysisRulesSpatial# received props and will reload");
				this.setStateFromStores(newProps);
			}
		}
	}

	/**
	 * Check if state is the same as it was when loaded from stores
	 * @returns {boolean}
	 */
	isStateUnchanged() {
		var isIt = true;
		if(this.state.analysis) {
			isIt = (
				(
					(!this.state.valueFeatureLayer.length && !this.state.analysis.layerObject) ||
					(
						this.state.analysis.layerObject &&
						(this.state.valueFeatureLayer[0] == this.state.analysis.layerObject.key)
					)
				) &&
				(
					(!this.state.valueResultAttSet.length && !this.state.analysis.attributeSet) ||
					(
						this.state.analysis.attributeSet &&
						(this.state.valueResultAttSet[0] == this.state.analysis.attributeSet.key)
					)
				) &&
				(
					(!this.state.valueFilterAttSetAtt && !this.state.analysis.filterAttribute) ||
					(
						this.state.analysis.filterAttribute &&
						this.state.analysis.filterAttributeSet &&
						(this.state.valueFilterAttSetAtt[0] == this.state.analysis.filterAttributeSet.key + "-" + this.state.analysis.filterAttribute.key)
					)
				) &&
					_.isEqual(this.state.valueAttributeMaps[this.state.analysis.attributeSet.key], this.state.analysis.attributeMap)
			);
		}
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
		this._stateHash = utils.stringHash("ScreenAnalysisRulesSpatial" + this.state.analysis.key.toString());
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}

	saveForm() {
		let objectType = ObjectTypes.ANALYSIS_SPATIAL;
		//let objectType = null;
		//switch(this.state.analysis.analysisType) {
		//	case "spatial":
		//		objectType = ObjectTypes.ANALYSIS_SPATIAL;
		//		break;
		//	case "level":
		//		objectType = ObjectTypes.ANALYSIS_LEVEL;
		//		break;
		//	case "math":
		//		objectType = ObjectTypes.ANALYSIS_MATH;
		//		break;
		//}
		var actionData = [], modelData = {};
		modelData.key = this.state.analysis.key;
		modelData.layerObject = _.findWhere(this.state.featureLayers, {key: this.state.valueFeatureLayer[0]});
		modelData.attributeSet = _.findWhere(this.state.attributeSetsResult, {key: this.state.valueResultAttSet[0]});

		modelData.attributeMap = utils.clone(this.state.valueAttributeMaps[this.state.valueResultAttSet[0]]);

		let filterAttributeSet = null, filterAttribute = null;
		let isAtLeastOneFilterSet = false;
		for (let record of modelData.attributeMap) {
			if (record.filterValue) {
				isAtLeastOneFilterSet = true;
			}
		}
		if (this.state.valueFilterAttSetAtt.length && isAtLeastOneFilterSet) {
			let filterKeys = this.state.valueFilterAttSetAtt[0].split("-");
			filterAttributeSet = _.findWhere(this.state.attributeSetsLayer, {key: +filterKeys[0]});
			filterAttribute = _.findWhere(filterAttributeSet.attributes, {key: +filterKeys[1]});
		}
		modelData.filterAttributeSet = filterAttributeSet;
		modelData.filterAttribute = filterAttribute;

		let modelObj = new AnalysisModel(modelData);
		actionData.push({type:"update",model:modelObj});
		logger.info("ScreenAnalysisRulesSpatial# saveForm(), Save analysis:", actionData);
		ActionCreator.handleObjects(actionData,objectType);
	}


	getUrl() {
		return path.join(this.props.parentUrl, "rules");
	}

	getAnalysisType() {
		switch(this.state.analysis.analysisType) {
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
					valueFilterAttSetAtt: selectorValueAttSetAtt ? [selectorValueAttSetAtt] : []
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
		if (!newValue[0] || this.state.valueAttributeMaps.hasOwnProperty(newValue[0])) {
			this.setState({
				valueResultAttSet: newValue
			});
		} else {
			let attributeSet = _.findWhere(this.state.attributeSetsResult, {key: newValue [0]});
			let attributeMap = [];
			for (let attribute of attributeSet.attributes) {
				attributeMap.push({
					attribute: attribute,
					attributeSet: attributeSet,
					valueAttribute: null,
					valueAttributeSet: null,
					filterValue: null,
					weightingAttribute: null,
					weightingAttributeSet: null,
					operationType: null
				});
			}
			let attributeMaps = {
				[attributeSet.key]: attributeMap
			};
			let newState = {
				valueAttributeMaps: {$merge: attributeMaps},
				valueResultAttSet: {$set: newValue}
			};
			super.setStateDeep(newState);
		}
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


	onChangeInRow(type, attribute, value, values) {
		let attributeMap = utils.clone(this.state.valueAttributeMaps[this.state.valueResultAttSet]);
		let attributeMapRow = _.findWhere(attributeMap, {attribute: attribute});
		switch (type) {
			case "operation":
				attributeMapRow.operationType = value;
				break;
			case "valueAttribute":
				let valueAttributeSet = null;
				let valueAttribute = null;
				if (value) {
					valueAttributeSet = _.findWhere(this.state.attributeSetsLayer, {key: values[0].attributeSetKey});
					valueAttribute = _.findWhere(valueAttributeSet.attributes, {key: values[0].attributeKey});
				}
				attributeMapRow.valueAttributeSet = valueAttributeSet;
				attributeMapRow.valueAttribute = valueAttribute;
				break;
			case "weightingAttribute":
				let weightingAttributeSet = null;
				let weightingAttribute = null;
				if (value) {
					weightingAttributeSet = _.findWhere(this.state.attributeSetsLayer, {key: values[0].attributeSetKey});
					weightingAttribute = _.findWhere(weightingAttributeSet.attributes, {key: values[0].attributeKey});
				}
				attributeMapRow.weightingAttributeSet = weightingAttributeSet;
				attributeMapRow.weightingAttribute = weightingAttribute;
				break;
			case "filter":
				attributeMapRow.filterValue = value.target.value; // value actually event
				break;
		}
		let attributeMaps = {
			[this.state.valueResultAttSet]: attributeMap
		};
		let newState = {
			valueAttributeMaps: {$merge: attributeMaps}
		};
		super.setStateDeep(newState);
	}


	render() {

		let ret = null;
		if (this.state.analysis) {

			var saveButton = (
				<SaveButton
					saved={this.isStateUnchanged()}
					className="save-button"
					onClick={this.saveForm.bind(this)}
				/>
			);

			let ruleTableInsert = null;
			if (
				this.state.featureLayers.length &&
				this.state.attributeSetsResult.length &&
				this.state.valueResultAttSet[0] &&
				this.state.filterDestinations
			) {
				let ruleTableRowsInsert = [];
				let operations = _.values(analysisOperationsMetadata.SPATIAL);
				let resultAttSet = _.findWhere(this.state.attributeSetsResult, {key: this.state.valueResultAttSet[0]});
				for (let attribute of resultAttSet.attributes) {
					var operationType = (attributeMapRow && attributeMapRow.operationType) || null;
					attributeMapRow = attributeMapRow || {};
					let attributeMap = this.state.valueAttributeMaps[this.state.valueResultAttSet];
					let attributeMapRow = _.findWhere(attributeMap, {attribute: attribute});
					let operationCellInsert = (
						<td className="allowOverflow resetui">
							<label className="container">
								Operation
								<Select
									onChange={this.onChangeInRow.bind(this,"operation",attribute)}
									options={operations}
									valueKey="key"
									labelKey="name"
									value={operationType}
									clearable={false}
								/>
							</label>
						</td>
					);
					let insertValueCell = false,
						insertWeightingCell = false,
						optionCellsInsert = null,
						valueCellCaption = "",
						valueDestination = null,
						weightingDestination = null;
					switch (operationType) {
						case analysisOperationsMetadata.SPATIAL[AnalysisOperations.SPATIAL.SUM_ATTRIBUTE].key:
							insertValueCell = true;
							valueCellCaption = "Attribute to sum";
							break;
						case analysisOperationsMetadata.SPATIAL[AnalysisOperations.SPATIAL.AVG_ATTRIBUTE_WEIGHT_AREA].key:
							insertValueCell = true;
							valueCellCaption = "Attribute to average";
							break;
						case analysisOperationsMetadata.SPATIAL[AnalysisOperations.SPATIAL.AVG_ATTRIBUTE_WEIGHT_ATTRIBUTE].key:
							insertValueCell = true;
							valueCellCaption = "Attribute to average";
							insertWeightingCell = true;
							break;
					}
					if (attributeMapRow.valueAttributeSet && attributeMapRow.valueAttribute) {
						valueDestination = attributeMapRow.valueAttributeSet.key + "-" + attributeMapRow.valueAttribute.key;
					}
					if (attributeMapRow.weightingAttributeSet && attributeMapRow.weightingAttribute) {
						weightingDestination = attributeMapRow.weightingAttributeSet.key + "-" + attributeMapRow.weightingAttribute.key;
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
									{valueCellCaption}
									<Select
										onChange={this.onChangeInRow.bind(this,"valueAttribute",attribute)}
										options={this.state.filterDestinations}
										optionComponent={OptionDestination}
										singleValueComponent={SingleValueDestination}
										valueKey="key"
										labelKey="name"
										className={valueDestination ? "multiline" : ""}
										value={valueDestination}
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
											onChange={this.onChangeInRow.bind(this,"weightingAttribute",attribute)}
											options={this.state.filterDestinations}
											optionComponent={OptionDestination}
											singleValueComponent={SingleValueDestination}
											valueKey="key"
											labelKey="name"
											className={weightingDestination ? "multiline" : ""}
											value={weightingDestination}
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
					let filterCellInsert = null;
					if (this.state.attributeSetsLayer.length && this.state.valueFilterAttSetAtt[0]) {
						let filterKeys = this.state.valueFilterAttSetAtt[0].split("-");
						let filterAttributeSet = _.findWhere(this.state.attributeSetsLayer, {key: +filterKeys[0]});
						let filterAttribute = _.findWhere(filterAttributeSet.attributes, {key: +filterKeys[1]});
						filterCellInsert = (
							<td className="allowOverflow resetui">
								<label className="container">
									{filterAttribute.name + ":"}
									<Input
										type="text"
										name="name"
										placeholder=" "
										//defaultValue="112" // remove
										value={attributeMapRow.filterValue}
										onChange={this.onChangeInRow.bind(this,"filter",attribute)}
										//onChange={this.onChangeWhatever.bind(this)}
									/>
								</label>
							</td>
						);
					} else {
						filterCellInsert = (
							<td></td>
						);
					}

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
				ruleTableInsert = (
					<Table celled className="fixed" id="AnalysisSpatialRuleTable">
						<thead>
						<tr>
							<th>Operation</th>
							<th colSpan="2"></th>
							<th>Filter</th>
						</tr>
						</thead>
						{ruleTableRowsInsert}
					</Table>
				);
			}


			ret = (
				<div>
					<div className="screen-content-only">
						<div>

							<h2>Spatial analysis operations: {this.state.analysis.name}</h2>

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

							{ruleTableInsert}

							{saveButton}

						</div>
					</div>
				</div>
			);

		}

		return ret;

	}
}

export default ScreenAnalysisRulesSpatial;
