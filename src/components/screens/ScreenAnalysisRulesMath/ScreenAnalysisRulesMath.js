import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisRulesMath.css';
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
	attributeSets: [],
	valueResultAttSet: [],
	valueAttributeSetMap: {},
	attSetCount: 2
};


@withStyles(styles)
class ScreenAnalysisRulesMath extends PantherComponent {

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
			attributeSets: AttributeSetStore.getAll(), // filter by topics?
			valueResultAttSet: analysis.attributeSet ? [analysis.attributeSet.key] : []
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(
			this.mounted &&
			props.data.analysis
		) {
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

				if(
					analysis.attributeSet &&
					(!keys || keys.indexOf("valueResultAttSet")!=-1 || keys.indexOf("analysis")!=-1)
				) {
					let attributeSetMap = {
						[analysis.attributeSet.key]: []
					};
					let mapLength = Math.max(thisComponent.state.attSetCount,analysis.attributeSets.length);
					for (let i = 0; i < mapLength; i++) {
						attributeSetMap[analysis.attributeSet.key].push({
							attributeSet: analysis.attributeSets[i],
							operation: analysis.useSum ? 'plus' : 'minus'
						});
					}
					let newState = {};
					if (thisComponent.state.valueAttributeSetMap.hasOwnProperty(analysis.attributeSet.key)) {
						newState = {
							savedAttributeSetMap: {$set: attributeSetMap}
						};
					} else {
						newState = {
							savedAttributeSetMap: {$set: attributeSetMap},
							valueAttributeSetMap: {$merge: attributeSetMap} // todo do not replace?
						};
					}
					super.setStateDeep.call(thisComponent, newState);
				}

			});

		}
	}

	_onStoreChange(keys) {
		logger.trace("ScreenAnalysisRulesMath# _onStoreChange(), Keys:", keys);
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

	componentDidMount() {
		super.componentDidMount();
		this.changeListener.add(AnalysisStore, ["analysis"]);
		this.changeListener.add(AttributeSetStore, ["attributeSets"]);
		this.responseListener.add(AttributeSetStore);

		this.setStateFromStores();
	}

	//componentWillReceiveProps(newProps) {
	//	if (
	//		this.state.analysis &&
	//		(
	//			(this.state.analysis.key != newProps.data.analysis.key) ||
	//			(this.state.analysis.changed != newProps.data.analysis.changed)
	//		)
	//	) {
	//		// analysis was switched or updated outside
	//		if (this.isStateUnchanged()) {
	//			// form was not edited, it's okay to reload
	//			logger.trace("ScreenAnalysisRulesMath# received props and will reload");
	//			this.setStateFromStores(newProps);
	//		}
	//	}
	//}


	/**
	 * Check if state is the same as it was when loaded from stores
	 * @returns {boolean}
	 */
	isStateUnchanged() {
		var isIt = true;
		if(this.state.analysis) {
			let isResultAttributeSetMissing = !this.state.valueResultAttSet.length && !this.state.analysis.attributeSet;
			let isAttributeSetsSame = this.state.analysis.attributeSet &&
				(this.state.valueResultAttSet[0] == this.state.analysis.attributeSet.key);
			let isAttributeTableTheSame = false;
			if(this.state.analysis.attributeSet) {
				isAttributeTableTheSame = _.isEqual(this.state.valueAttributeSetMap[this.state.valueResultAttSet],this.state.savedAttributeSetMap[this.state.analysis.attributeSet.key]);
			}

			isIt = (
				(
					(isResultAttributeSetMissing) ||
					(isAttributeSetsSame)
				) &&
				(
					this.state.valueResultAttSet &&
					this.state.analysis.attributeSet &&
					this.state.savedAttributeSetMap &&
					isAttributeTableTheSame
				)
			);
		}
		return isIt;
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
		this._stateHash = utils.stringHash("ScreenAnalysisRulesMath" + this.state.analysis.key.toString());
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}

	/**
	 * helper for validation
	 * @param attributeSet
	 * @returns {Array}
	 */
	getAttributeSetFormat(attributeSet) {
		let ret = [];
		for (let attribute of attributeSet.attributes) {
			ret.push(attribute.type); // todo units?
		}
		return ret;
	}

	/**
	 * form validation
	 * - check if at least two attribute sets are selected
	 * - check if attributeSets have same structure (number of attributes and their types)
	 * @returns {{all: boolean, atLeastTwoAttSets: boolean, allFormatsEqual: boolean}}
	 */
	validateForm() {
		let ret = {
			all: true,
			resultAttSetSelected: !!this.state.valueResultAttSet.length,
			atLeastTwoAttSets: true,
			allFormatsEqual: true
		};

		if (
			this.state.attributeSets &&
			ret.resultAttSetSelected &&
			this.state.valueAttributeSetMap.hasOwnProperty(this.state.valueResultAttSet[0])
		) {
			let resultAttributeSet = _.findWhere(this.state.attributeSets, {key: this.state.valueResultAttSet[0]});
			let attributeSets = [];
			for (let record of this.state.valueAttributeSetMap[this.state.valueResultAttSet[0]]) {
				attributeSets.push(record.attributeSet);
			}

			// at least two attribute sets selected
			for (let record of this.state.valueAttributeSetMap[this.state.valueResultAttSet[0]]) {
				ret.atLeastTwoAttSets = ret.atLeastTwoAttSets && !!record.attributeSet;
			}

			// formats
			if (ret.atLeastTwoAttSets) {
				let resultAttSetFormat = this.getAttributeSetFormat(resultAttributeSet);
				for (let attributeSet of attributeSets) {
					if (attributeSet) {
						let attributeSetFormat = this.getAttributeSetFormat(attributeSet);
						ret.allFormatsEqual = ret.allFormatsEqual && _.isEqual(resultAttSetFormat, attributeSetFormat);
					}
				}
			}

		}
		_.each(ret, function(indicator){
			ret.all = ret.all && indicator;
		});
		return ret;
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
		modelData.attributeSet = _.findWhere(this.state.attributeSets, {key: this.state.valueResultAttSet[0]});
		modelData.attributeSets = [];
		modelData.useSum = false;
		for (let record of this.state.valueAttributeSetMap[this.state.valueResultAttSet[0]]) {
			modelData.attributeSets.push(record.attributeSet);
			if (record.operation=='plus') {
				modelData.useSum = true;
			}
		}

		let modelObj = new AnalysisModel(modelData);
		actionData.push({type:"update",model:modelObj});
		logger.info("ScreenAnalysisRulesMath# saveForm(), Save analysis:", actionData);
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

	onChangeResultAttSet (value, values) {
		let newValue = utils.handleNewObjects(values, this.getAnalysisType(), {stateKey: "valueResultAttSet"}, this.getStateHash());
		if (!newValue[0] || this.state.valueAttributeSetMap.hasOwnProperty(newValue[0])) {
			this.setState({
				valueResultAttSet: newValue
			});
		} else {
			let attributeSet = _.findWhere(this.state.attributeSets, {key: newValue [0]});
			let attributeSets = _.pluck(this.state.valueAttributeSetMap[newValue[0]],'attributeSet');


			let attributeSetMap = {
				[attributeSet.key]: []
			};
			let mapLength = Math.max(this.state.attSetCount,attributeSets.length);
			for (let i = 0; i < mapLength; i++) {
				attributeSetMap[attributeSet.key].push({
					attributeSet: attributeSets[i],
					operation: this.state.analysis.useSum ? 'plus' : 'minus'
				});
			}
			let newState = {
				valueAttributeSetMap: {$merge: attributeSetMap},
				valueResultAttSet: {$set: newValue}
			};
			super.setStateDeep(newState);

		}
	}

	onChangeAttSets (resultAttSetKey, attSetIndex, value, values) {
		logger.trace("ScreenAnalysisRulesMath# onChangeAttSets(), resultAttSetKey: ", resultAttSetKey, ", attSetIndex:", attSetIndex, ", value: ", value);
		let newValue = utils.handleNewObjects(values, this.getAnalysisType(), {stateKey: "valueAttSets"}, this.getStateHash());

		let attributeSetMap = utils.clone(this.state.valueAttributeSetMap);
		let attributeSetMapRecord = attributeSetMap[resultAttSetKey][attSetIndex];
		attributeSetMapRecord.attributeSet = _.findWhere(this.state.attributeSets,{key: newValue[0]});
		console.log(attributeSetMapRecord.attributeSet);

		let newState = {
			valueAttributeSetMap: {$merge: attributeSetMap}
		};
		super.setStateDeep(newState);
	}

	onChangeOperation (resultAttSetKey) {
		logger.trace("ScreenAnalysisRulesMath# onChangeOperation(), resultAttSetKey: ", resultAttSetKey);

		let attributeSetMap = utils.clone(this.state.valueAttributeSetMap);
		let operation = attributeSetMap[resultAttSetKey][0].operation=='minus' ? 'plus' : 'minus';
		for (let attributeSetMapRecord of attributeSetMap[resultAttSetKey]) {
			attributeSetMapRecord.operation = operation;
		}

		let newState = {
			valueAttributeSetMap: {$merge: attributeSetMap}
		};
		super.setStateDeep(newState);
	}


	onObjectClick (itemType, value, event) {
		logger.trace("ScreenAnalysisRulesMath# onObjectClick(), Value: ", value);
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
		let thisComponent = this;

		let validationMessagesInsert = null;
		let validation = this.validateForm();
		logger.trace("ScreenAnalysisRulesMath# render() validation:",validation);
		if (!validation.all) {
			validationMessagesInsert = [];
			if (!validation.resultAttSetSelected) {
				validationMessagesInsert.push((
					<div className="prod" key="resultAttSetSelected">
						Select result attribute set
					</div>
				));
			}
			if (!validation.atLeastTwoAttSets) {
				validationMessagesInsert.push((
					<div className="prod" key="atLeastTwoAttSets">
						Select two attribute sets to be combined.
					</div>
				));
			}
			if (!validation.allFormatsEqual) {
				validationMessagesInsert.push((
					<div className="ui warning message" key="allFormatsEqual">
						<div className="header">
							Incompatible attribute sets
						</div>
						<div>
							Selected attribute sets do not have the same structure and cannot be combined.
						</div>
					</div>
				));
			}
		}

		let ret = null;
		if (this.state.analysis) {

			var saveButton = (
				<SaveButton
					disabled={this.props.disabled || !validation.all}
					saved={this.isStateUnchanged()}
					className="save-button"
					onClick={this.saveForm.bind(this)}
				/>
			);

			let ruleTableInsert = null;
			if (
				this.state.attributeSets.length &&
				Object.keys(this.state.valueAttributeSetMap).length &&
				this.state.valueResultAttSet.length &&
				this.state.valueAttributeSetMap.hasOwnProperty(this.state.valueResultAttSet[0])
			) {
				let ruleTableRowsInsert = [];
				let operations = _.values(analysisOperationsMetadata.LEVEL);
				let resultAttributeSets = _.filter(this.state.attributeSets, function(attSet){
					return _.contains(thisComponent.state.valueResultAttSet, attSet.key);
				});
				for (let resultAttributeSet of resultAttributeSets) {

					let resultAttSetCellInsert = (
						<td className="allowOverflow resetui">
							{resultAttributeSet.name}
						</td>
					);

					let sourceAttSetsRowsInsert = [];
					//let attributeSets = _.pluck(this.state.valueAttributeSetMap[resultAttributeSet.key],'attributeSet');
					let attributeSetMap = this.state.valueAttributeSetMap[resultAttributeSet.key];
					for (let recordIndex in attributeSetMap) {
						if (attributeSetMap.hasOwnProperty(recordIndex)) {
							let record = attributeSetMap[recordIndex];
							let operationSymbolClass = 'none', operationButtonInsert = null;
							if (recordIndex!=0) {
								operationSymbolClass = record.operation;
								operationButtonInsert = (
									<IconButton
										basic
										name={record.operation} // works for plus & minus, might need transform for others (operation to icon name)
										size="smaller"
										onClick={this.onChangeOperation.bind(this,resultAttributeSet.key)}
									/>
								);
							}
							sourceAttSetsRowsInsert.push((
								<div className="ptr-analysis-operation-row">
									<div
										className={"ptr-analysis-operation-symbol " + operationSymbolClass}
									>
										{operationButtonInsert}
									</div>
									<UIObjectSelect
										onChange={this.onChangeAttSets.bind(this,resultAttributeSet.key,recordIndex)}
										onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.ATTRIBUTE_SET)}
										options={this.state.attributeSets}
										valueKey="key"
										labelKey="name"
										value={this.state.valueAttributeSetMap[resultAttributeSet.key][recordIndex].attributeSet}
										className="template"
									/>
								</div>
							));
						}
					}

					let sourceAttSetsCellInsert = (
						<td className="allowOverflow resetui">
							{sourceAttSetsRowsInsert}
						</td>
					);


					let rowInsert = (
						<tr>
							{resultAttSetCellInsert}
							{sourceAttSetsCellInsert}
						</tr>
					);
					ruleTableRowsInsert.push(rowInsert);

				}
				ruleTableInsert = (
					<Table celled className="fixed" id="AnalysisMathRuleTable">
						<thead>
						<tr>
							<th>Result attribute set</th>
							<th>Operation</th>
						</tr>
						</thead>
						<tbody>
							{ruleTableRowsInsert}
						</tbody>
					</Table>
				);
			}


			ret = (
				<div>
					<div className="screen-content-only">
						<div>

							<h2>Math analysis operations: {this.state.analysis.name}</h2>

							<div className="frame-input-wrapper">
								<label className="container">
									Result attribute set
									<UIObjectSelect
										//multi
										onChange={this.onChangeResultAttSet.bind(this)}
										onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.ATTRIBUTE_SET)}
										options={this.state.attributeSets}
										valueKey="key"
										labelKey="name"
										value={this.state.valueResultAttSet}
										className="template"
									/>
								</label>
							</div>

							{ruleTableInsert}

							{validationMessagesInsert}

							{saveButton}

						</div>
					</div>
				</div>
			);

		}

		return ret;

	}
}

export default ScreenAnalysisRulesMath;
