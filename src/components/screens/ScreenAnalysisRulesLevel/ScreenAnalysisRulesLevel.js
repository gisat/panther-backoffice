import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisRulesLevel.css';
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


var initialState = {
	attributeSets: [],
	destinations: null,
	valueAttSets: [],
	valueAttributeMaps: {}
};


@withStyles(styles)
class ScreenAnalysisRulesLevel extends Component{

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

	store2state(props, analysis) {
		if (!analysis) {
			analysis = props.data.analysis;
		}
		return {
			analysis: analysis,
			attributeSets: AttributeSetStore.getAll(), // filter by topics?
			valueAttSets: analysis.attributeSets ? utils.getModelsKeys(analysis.attributeSets) : []
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
				thisComponent.context.setStateFromStores.call(thisComponent, store2state, keys);
				// if stores changed, overrides user input - todo fix
				if(!keys || keys.indexOf("attributeSets")!=-1) {
					store2state.attributeSets.then(function(attributeSets) {
						thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.atts2state(attributeSets));
					});
				}
				if(analysis.attributeSets.length && analysis.attributeMap && (!keys || keys.indexOf("valueAttSets")!=-1)) {
					let attributeMaps = {};
					for (let attSet of analysis.attributeSets) {
						attributeMaps[attSet.key] = _.where(analysis.attributeMap,{attributeSet: attSet});
					}
					let newState = {
						valueAttributeMaps: {$merge: attributeMaps}
					};
					thisComponent.context.setStateDeep.call(thisComponent, newState);
				}

			});

		}
	}

	_onStoreChange(keys) {
		logger.trace("ScreenAnalysisRulesLevel# _onStoreChange(), Keys:", keys);
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
					case "valueAttSets":
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
		this.changeListener.add(AnalysisStore, ["analysis"]);
		this.changeListener.add(AttributeSetStore, ["attributeSets"]);
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
				logger.trace("ScreenAnalysisRulesLevel# received props and will reload");
				this.setStateFromStores(newProps);
			}
		}
	}

	componentWillUnmount() { this.mounted = false;
		this.changeListener.clean();
		this.responseListener.clean();
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
					(!this.state.valueAttSets.length && !this.state.analysis.attributeSets) ||
					(
						this.state.analysis.attributeSets &&
						_.isEqual(this.state.valueAttSets, utils.getModelsKeys(this.state.analysis.attributeSets))
					)
				)
			);
			if (isIt) {
				for (let attSet of this.state.analysis.attributeSets) {
					isIt = isIt && _.isEqual(this.state.valueAttributeMaps[attSet.key], _.where(this.state.analysis.attributeMap, {attributeSet: attSet}))
				}
			}
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
			destinations: null
		};
		if (attributeSets) {
			ret.destinations = [];
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
						ret.destinations.push(object);
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
		this._stateHash = utils.stringHash(this.state.analysis.key.toString());
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}

	saveForm() {
		let thisComponent = this;
		let objectType = ObjectTypes.ANALYSIS_LEVEL;
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
		modelData.attributeSets = _.filter(this.state.attributeSets, function(attSet){
			return _.contains(thisComponent.state.valueAttSets, attSet.key);
		});
		modelData.attributeMap = [];
		for (let attSetKey of this.state.valueAttSets) {
			_.union(modelData.attributeMap, utils.clone(this.state.valueAttributeMaps[attSetKey]));
		}

		let modelObj = new AnalysisModel(modelData);
		actionData.push({type:"update",model:modelObj});
		logger.info("ScreenAnalysisRulesLevel# saveForm(), Save analysis:", actionData);
		//ActionCreator.handleObjects(actionData,objectType);
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

	onChangeAttSets (value, values) {
		let newValue = utils.handleNewObjects(values, this.getAnalysisType(), {stateKey: "valueAttSets"}, this.getStateHash());

		let attributeMaps = {};
		for (let attSetKey of newValue) {
			if (!this.state.valueAttributeMaps.hasOwnProperty(attSetKey)) {
				let attributeSet = _.findWhere(this.state.attributeSets, {key: attSetKey});
				let attributeMap = [];
				for (let attribute of attributeSet.attributes) {
					attributeMap.push({
						attribute: attribute,
						attributeSet: attributeSet,
						weightingAttribute: null,
						weightingAttributeSet: null,
						operationType: null
					});
				}
				attributeMaps[attributeSet.key] = attributeMap;
			}
		}
		if (!newValue.length || !attributeMaps.length) {
			this.setState({
				valueAttSets: newValue
			});
		} else {

			let newState = {
				valueAttributeMaps: {$merge: attributeMaps},
				valueAttSets: {$set: newValue}
			};
			this.context.setStateDeep.call(this, newState);
		}
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


	onChangeInRow(type, attributeSet, attribute, value, values) {
		let attributeMap = utils.clone(this.state.valueAttributeMaps[attributeSet.key]);
		let attributeMapRow = _.findWhere(attributeMap, {attribute: attribute});
		switch (type) {
			case "operation":
				attributeMapRow.operationType = value;
				break;
			case "weightingAttribute":
				let weightingAttributeSet = null;
				let weightingAttribute = null;
				if (value) {
					logger.info("ScreenAnalysisRulesLevel# onChangeInRow value",value,", values",values);
					weightingAttributeSet = _.findWhere(this.state.attributeSets, {key: values[0].attributeSetKey});
					weightingAttribute = _.findWhere(weightingAttributeSet.attributes, {key: values[0].attributeKey});
				}
				attributeMapRow.weightingAttributeSet = weightingAttributeSet;
				attributeMapRow.weightingAttribute = weightingAttribute;
				break;
		}
		let attributeMaps = {
			[attributeSet.key]: attributeMap
		};
		let newState = {
			valueAttributeMaps: {$merge: attributeMaps}
		};
		this.context.setStateDeep.call(this, newState);
	}


	render() {
		let thisComponent = this;

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
				this.state.attributeSets.length &&
				this.state.valueAttSets.length
			) {
				let ruleTableRowsInsert = [];
				let operations = _.values(analysisOperationsMetadata.LEVEL);
				let attributeSets = _.filter(this.state.attributeSets, function(attSet){
					return _.contains(thisComponent.state.valueAttSets, attSet.key);
				});
				for (let attributeSet of attributeSets) {
					let attributeMap = this.state.valueAttributeMaps[attributeSet.key];
					for (let attribute of attributeSet.attributes) {
						let attributeMapRow = _.findWhere(attributeMap, {attribute: attribute});
						let operationCellInsert = (
							<td className="allowOverflow resetui">
								<label className="container">
									Operation
									<Select
										onChange={this.onChangeInRow.bind(this,"operation",attributeSet,attribute)}
										options={operations}
										valueKey="key"
										labelKey="name"
										value={attributeMapRow.operationType}
										clearable={false}
									/>
								</label>
							</td>
						);
						let insertWeightingCell = false,
							optionCellsInsert = null,
							weightingDestination = null;
						switch (attributeMapRow.operationType) {
							case analysisOperationsMetadata.LEVEL[AnalysisOperations.LEVEL.AVG_WEIGHT_ATTRIBUTE].key:
								insertWeightingCell = true;
								break;
						}
						if (attributeMapRow.weightingAttributeSet && attributeMapRow.weightingAttribute) {
							weightingDestination = attributeMapRow.weightingAttributeSet.key + "-" + attributeMapRow.weightingAttribute.key;
						}
						if (!insertWeightingCell) {
							optionCellsInsert = (
								<td></td>
							);
						} else {
							optionCellsInsert = (
								<td className="allowOverflow resetui">
									<label className="container">
										Weighting attribute
										<Select
											onChange={this.onChangeInRow.bind(this,"weightingAttribute",attribute)}
											options={this.state.destinations}
											optionComponent={OptionDestination}
											singleValueComponent={SingleValueDestination}
											valueKey="key"
											labelKey="name"
											className={weightingDestination ? "multiline" : ""}
											value={weightingDestination}
										/>
									</label>
								</td>
							);
						}

						let rowInsert = (
							<tbody className="internal row">
							<tr className="row-header">
								<td colSpan="2" className="resetui">{attributeSet.name + ": " + attribute.name}</td>
							</tr>
							<tr>
								{operationCellInsert}
								{optionCellsInsert}
							</tr>
							</tbody>
						);
						ruleTableRowsInsert.push(rowInsert);
					}
				}
				ruleTableInsert = (
					<Table celled className="fixed" id="AnalysisLevelRuleTable">
						<thead>
						<tr>
							<th>Operation</th>
							<th></th>
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

							<h2>Level analysis operations: {this.state.analysis.name}</h2>

							<div className="frame-input-wrapper">
								<label className="container">
									Attribute sets (source & result)
									<UIObjectSelect
										multi
										onChange={this.onChangeAttSets.bind(this)}
										onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.ATTRIBUTE_SET)}
										//options={ATTSETS}
										options={this.state.attributeSets}
										valueKey="key"
										labelKey="name"
										value={this.state.valueAttSets}
										className="template"
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

export default ScreenAnalysisRulesLevel;
