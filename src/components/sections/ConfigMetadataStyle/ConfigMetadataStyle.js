import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import ActionCreator from '../../../actions/ActionCreator';
import logger from '../../../core/Logger';
import utils from '../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ScopeModel from '../../../models/ScopeModel';
import StyleModel from '../../../models/StyleModel';
import AttributeSetModel from '../../../models/AttributeSetModel';
import StyleStore from '../../../stores/StyleStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import { Input, Button, Icon } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import Select from 'react-select';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import OptionDestination from '../../atoms/UICustomSelect/OptionDestination';
import SingleValueDestination from '../../atoms/UICustomSelect/SingleValueDestination';
import ConfigControls from '../../atoms/ConfigControls';
import {SliderPicker} from 'react-color';

var initialState = {
	valueActive: false,
	valueName: "",
	//valueServerName: "",
	valueSource: "definition",
	valueFeaturesType: "polygon",
	valueFilterType: "no",
	valueDefinitionRules: [],
	valueDefinitionSingleRule: {
		name: "",
		filter: {},
		appearance: {
			fillColour: ""
		}
	}
};

const SOURCES = [
	{key: "definition", name: "Definition (Back Office)"},
	{key: "geoserver", name: "GeoServer"}
];

const FEATURESTYPES = [
	{key: "polygon", name: "Polygon"},
	{key: "line", name: "Line"},
	{key: "point", name: "Point"}
];

const FILTERTYPES = [
	{key: "no", name: "No filter"},
	{key: "attributeCsv", name: "Attribute: Values"},
	{key: "attributeInterval", name: "Attribute: Interval"}
];


class ConfigMetadataStyle extends ControllerComponent {

	static propTypes = {
		disabled: React.PropTypes.bool,
		scope: PropTypes.instanceOf(ScopeModel),
		store: PropTypes.shape({
			styles: PropTypes.arrayOf(PropTypes.instanceOf(StyleModel)),
			attributeSets: PropTypes.arrayOf(PropTypes.instanceOf(AttributeSetModel))
		}).isRequired,
		selectorValue: React.PropTypes.any
	};

	static defaultProps = {
		disabled: false,
		scope: null,
		selectorValue: null
	};

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state.current = _.assign(this.state.current, utils.deepClone(initialState));
		this.state.saved = utils.clone(this.state.current);
	}


	buildState(props) {
		if(!props){
			props = this.props;
		}
		let nextState = {};
		if(props.selectorValue) {
			let style = _.findWhere(props.store.styles, {key: props.selectorValue});
			if (style) {
				nextState = {
					valueActive: style.active,
					valueName: style.name,
					valueSource: style.source
				};
				if (style.source=="definition") {
					nextState.valueFeaturesType = style.definition.type;
					nextState.valueFilterType = style.definition.filterType;
					nextState.valueFilterAttributeSet = style.definition.filterAttributeSetKey;
					nextState.valueFilterAttribute = style.definition.filterAttributeKey;
					nextState.valueDefinitionRules = utils.clone(style.definition.rules);
					if (
						style.definition.rules &&
						style.definition.rules.length
					) {
						nextState.valueDefinitionSingleRule = utils.clone(style.definition.rules[0]);
					}
				}
				else if (style.source=="geoserver") {
					nextState.valueServerName = style.serverName;
				}
			}
		}
		return nextState;
	}

	componentDidMount() {
		super.componentDidMount();
		this.errorListener.add(StyleStore);
	}

	_onStoreResponse(result,responseData,stateHash) {
		var thisComponent = this;
		if (stateHash === this.getStateHash()) {
			if (responseData.hasOwnProperty("stateKey") && responseData.stateKey) {
				let stateKey = responseData.stateKey;
				let values = utils.deepClone(thisComponent.state.current[stateKey]);
				values.push(result[0].key);
				if(thisComponent.mounted) {
					thisComponent.setCurrentState({
						[stateKey]: values
					});
				}
				var screenObjectType;
				switch(stateKey){
					case "valueTopic":
						screenObjectType = ObjectTypes.TOPIC;
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


	equalStates(firstState, secondState, limitKeys) {
		if (
			(firstState.valueSource != secondState.valueSource)
			|| (firstState.valueName != secondState.valueName)
		) {
			return false;
		}
		if (firstState.valueSource == 'definition') {
			if (
				(firstState.valueFeaturesType != secondState.valueFeaturesType)
				|| (firstState.valueFilterType != secondState.valueFilterType)
			) {
				return false;
			}
			if (firstState.valueFilterType == 'no') {
				limitKeys = ['valueDefinitionSingleRule'];
			} else if (firstState.valueFilterType == 'attributeCsv' || firstState.valueFilterType == 'attributeInterval') {
				limitKeys = ['valueDefinitionRules', 'valueFilterAttributeSet', 'valueFilterAttribute'];
			}
		}
		return super.equalStates(firstState, secondState, limitKeys);
	}

	/**
	 * Prepare options for data table selects
	 * Called in store2state().
	 * @param attributeSets
	 * @returns {{layerType: (null|*|layerType|{serverName}|{serverName, transformForLocal})}}
	 */
	atts2state(attributeSets) {
		var ret = null;
		if (attributeSets) {
			ret = [];
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
						ret.push(object);
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
		this._stateHash = utils.stringHash(props.selectorValue);
	}

	saveForm(closePanelAfter) {
		let operationId = super.saveForm();

		var actionData = [], modelData = {};
		let style = _.findWhere(this.props.store.styles, {key: this.props.selectorValue});
		_.assign(modelData, style);
		modelData.active = this.state.current.valueActive;
		modelData.name = this.state.current.valueName;
		modelData.source = this.state.current.valueSource;

		if (this.state.current.valueSource=="definition") {
			modelData.definition = {
				type: this.state.current.valueFeaturesType,
				filterType: this.state.current.valueFilterType
			};
			if (
				this.state.current.valueFilterType=="attributeCsv" ||
				this.state.current.valueFilterType=="attributeInterval"
			) {
				if (
					this.state.current.valueFilterAttributeSet &&
					this.state.current.valueFilterAttribute
				) {
					// filter set -> standard rule set
					modelData.definition.filterAttributeKey = this.state.current.valueFilterAttribute;
					modelData.definition.filterAttributeSetKey = this.state.current.valueFilterAttributeSet;
					modelData.definition.rules = utils.clone(this.state.current.valueDefinitionRules);
				}
				else {
					// no filter -> single rule for all features
					modelData.definition.filterAttributeKey = null;
					modelData.definition.filterAttributeSetKey = null;
					modelData.definition.rules = [utils.clone(this.state.current.valueDefinitionSingleRule)];
				}
			}
			else {
				// no filter type - no filter / filters vary
				if(this.state.current.valueDefinitionSingleRule) {
					modelData.definition.rules = [utils.clone(this.state.current.valueDefinitionSingleRule)];
				} else {
					modelData.definition.rules = utils.clone(this.state.current.valueDefinitionRules);
				}
			}
		}
		else if (this.state.current.valueSource=="geoserver") {
			modelData.serverName = this.state.current.valueServerName;
		}

		let modelObj = new Model[ObjectTypes.STYLE](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.STYLE, operationId);
	}

	deleteObject(key) {
		let model = new Model[ObjectTypes.STYLE]({key: key});
		let actionData = [{type:"delete", model:model}];
		ActionCreator.handleObjects(actionData, ObjectTypes.STYLE);
		if (key == this.props.selectorValue) {
			ActionCreator.closeScreen(this.props.screenKey); //todo close after confirmed
		}
	}


	onChangeActive() {
		this.setCurrentState({
			valueActive: !this.state.current.valueActive
		});
	}

	onChangeName(e) {
		this.setCurrentState({
			valueName: e.target.value
		});
	}

	onChangeSource(value, values) {
		this.setCurrentState({
			valueSource: value
		});
	}

	onChangeFeaturesType(value, values) {
		this.setCurrentState({
			valueFeaturesType: value
		});
	}

	onChangeFilterType(value, values) {
		this.setCurrentState({
			valueFilterType: value
		});
	}

	onChangeFilterDestination(value, values) {
		if (values.length) {
			this.setCurrentState({
				valueFilterAttributeSet: values[0].attributeSetKey,
				valueFilterAttribute: values[0].attributeKey
			});
		} else {
			this.setCurrentState({
				valueFilterAttributeSet: null,
				valueFilterAttribute: null
			});
		}
	}

	onChangeRule(ruleIndex,key,e) {
		if(ruleIndex) {
			this.setStateDeep({
				current: {
					valueDefinitionRules: {
						[ruleIndex]: {
							[key]: {$set: e.target.value}
						}
					}
				}
			});
		} else {
			this.setStateDeep({
				current: {
					valueDefinitionSingleRule: {
						[key]: {$set: e.target.value}
					}
				}
			});
		}
	}

	onChangeRuleAppearance(ruleIndex,key,e) {
		this.onChangeRuleAppearanceWithValue(ruleIndex, key, e.target.value);
	}

	onChangeColorAppearance(ruleIndex, color) {
		this.onChangeRuleAppearanceWithValue(ruleIndex, 'fillColour', color.hex);
	}

	onChangeRuleAppearanceWithValue(ruleIndex, key, value) {
		if (ruleIndex) {
			this.setStateDeep({
				current: {
					valueDefinitionRules: {
						[ruleIndex]: {
							appearance: {
								[key]: {$set: value}
							}
						}
					}
				}
			});
		} else {
			this.setStateDeep({
				current: {
					valueDefinitionSingleRule: {
						appearance: {
							[key]: {$set: value}
						}
					}
				}
			});
		}
	}

	onChangeRuleFilter(ruleIndex,filterType,key,e) {
		if (ruleIndex) {
			this.setStateDeep({
				current: {
					valueDefinitionRules: {
						[ruleIndex]: {
							filter: {
								[filterType]: {
									[key]: {$set: e.target.value}
								}
							}
						}
					}
				}
			});
		} else {
			this.setStateDeep({
				current: {
					valueDefinitionSingleRule: {
						filter: {
							[filterType]: {
								[key]: {$set: e.target.value}
							}
						}
					}
				}
			});
		}
	}

	onChangeRemoveRule(ruleIndex) {
		this.setStateDeep({
			current: {
				valueDefinitionRules: {$splice: [[ruleIndex, 1]]}
			}
		});
	}

	onChangeAddRule(filterType) {
		var filter = {
			attributeCsv: {},
			attributeInterval: {}
		};
		//if (filterType) {
		//	filter[filterType] = {};
		//}
		this.setStateDeep({
			current: {
				valueDefinitionRules: {
					$push: [{
						name: "",
						filter: filter,
						appearance: {
							fillColour: "" // todo create more general (w/o appearance options)
						}
					}]
				}
			}
		});
	}

	onChangeServerName(e) {
		this.setCurrentState({
			valueServerName: e.target.value
		});
	}

	onChangeObjectSelect (stateKey, objectType, value, values) {
		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		var newState = {};
		newState[stateKey] = newValues;
		this.setCurrentState(newState);
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

		let ret = null;

		if (this.state.built) {

		let filterDestinations = this.atts2state(this.props.store.attributeSets);

		let sourceForm = null;
		if (this.state.current.valueSource=="definition") {

			var classesInsert = null, commonFilterConfigInsert = null;
			if (
				this.state.current.valueFilterType=="attributeCsv"
				|| this.state.current.valueFilterType=="attributeInterval"
			) {

				var filterDestination = null;
				if (
					this.state.current.valueFilterAttributeSet &&
					this.state.current.valueFilterAttribute
				) {
					filterDestination = this.state.current.valueFilterAttributeSet + "-" + this.state.current.valueFilterAttribute;
				}

				commonFilterConfigInsert = (
					<div className="frame-input-wrapper required">
						<label className="container">
							Filter attribute
							<Select
								onChange={this.onChangeFilterDestination.bind(this)}
								options={filterDestinations}
								optionComponent={OptionDestination}
								singleValueComponent={SingleValueDestination}
								valueKey="key"
								labelKey="name"
								className={filterDestination ? "multiline" : ""}
								value={filterDestination}
							/>
						</label>
						<div className="frame-input-wrapper-info">
							Attribute containing the values used to differentiate the style classes.
						</div>
					</div>
				);

				var rulesInsert = [];

				if (this.state.current.valueFilterAttribute) {
					for (let ruleIndex in this.state.current.valueDefinitionRules) {

						var filterConfigInsert = null;
						if (this.state.current.valueFilterType=="attributeCsv") {
							var filterValues = "";
							if (
								this.state.current.valueDefinitionRules[ruleIndex].filter &&
								this.state.current.valueDefinitionRules[ruleIndex].filter.attributeCsv &&
								this.state.current.valueDefinitionRules[ruleIndex].filter.attributeCsv.hasOwnProperty("values")
							) {
								filterValues = this.state.current.valueDefinitionRules[ruleIndex].filter.attributeCsv.values;
							}
							filterConfigInsert = (
								<label className="container">
									Filter
									<Input
										type="text"
										name={"valueFilter" + ruleIndex}
										placeholder=" "
										value={filterValues}
										onChange={this.onChangeRuleFilter.bind(this,ruleIndex,"attributeCsv","values")}
									/>
								</label>
							);
						} else if(this.state.current.valueFilterType=="attributeInterval") {
							var filterStart = "", filterEnd = "";
							if (
								this.state.current.valueDefinitionRules[ruleIndex].filter &&
								this.state.current.valueDefinitionRules[ruleIndex].filter.attributeInterval &&
								this.state.current.valueDefinitionRules[ruleIndex].filter.attributeInterval.hasOwnProperty("start")
							) {
								filterStart = this.state.current.valueDefinitionRules[ruleIndex].filter.attributeInterval.start;
							}
							if (
								this.state.current.valueDefinitionRules[ruleIndex].filter &&
								this.state.current.valueDefinitionRules[ruleIndex].filter.attributeInterval &&
								this.state.current.valueDefinitionRules[ruleIndex].filter.attributeInterval.hasOwnProperty("end")
							) {
								filterEnd = this.state.current.valueDefinitionRules[ruleIndex].filter.attributeInterval.end;
							}
							filterConfigInsert = (
								<div className="form-split">
									Filter
									<div>
										<label className="container">
											Interval start
											<Input
												type="text"
												name={"valueFilterStart" + ruleIndex}
												placeholder=" "
												value={filterStart}
												onChange={this.onChangeRuleFilter.bind(this,ruleIndex,"attributeInterval","start")}
											/>
										</label>
										<label className="container">
											Interval end
											<Input
												type="text"
												name={"valueFilterEnd" + ruleIndex}
												placeholder=" "
												value={filterEnd}
												onChange={this.onChangeRuleFilter.bind(this,ruleIndex,"attributeInterval","end")}
											/>
										</label>
									</div>
								</div>
							);
						}

						rulesInsert.push(
							<div
								key={"rule-frame-" + ruleIndex}
								className="frame-wrapper-object"
							>
								<div className="frame-wrapper-header">
									{this.state.current.valueDefinitionRules[ruleIndex].name}
									<div
										className="frame-wrapper-header-remove"
										onClick={this.onChangeRemoveRule.bind(this,ruleIndex)}
									>
										<Icon
											name="remove"
										/>
									</div>
								</div>
								<label className="container">
									Name
									<Input
										type="text"
										name={"valueName" + ruleIndex}
										placeholder=" "
										value={this.state.current.valueDefinitionRules[ruleIndex].name}
										onChange={this.onChangeRule.bind(this,ruleIndex,"name")}
									/>
								</label>
								{filterConfigInsert}
								<label className="container">
									Fill colour
									<Input
										type="text"
										name={"valueFillColour" + ruleIndex}
										placeholder=" "
										value={this.state.current.valueDefinitionRules[ruleIndex].appearance.fillColour}
										onChange={this.onChangeRuleAppearance.bind(this,ruleIndex,"fillColour")}
									/>
									<SliderPicker
										color={this.state.current.valueDefinitionRules[ruleIndex].appearance.fillColour || '#0000ff'}
										onChangeComplete={this.onChangeColorAppearance.bind(this,ruleIndex)}
									/>
								</label>
							</div>
						);
					}
					rulesInsert.push(
						<a
							className="ptr-item simple add"
							href="#"
							onClick={this.onChangeAddRule.bind(this,"attributeCsv")}
							key="rule-add"
						>
							<span><Icon name="plus"/></span>
						</a>
					);
					classesInsert = (
						<div className="frame-input-wrapper required">
							<div className="label">
								Classes
								{rulesInsert}
							</div>
						</div>
					);
				}
				else {
					//filter needs attribute, but none is selected
					classesInsert = (
						<div className="prod">
							Select a filter attribute
						</div>
					);
				}
			}
			else {
				// no filter set -> single class (for now?)
				classesInsert = (
					<div className="frame-input-wrapper required">
						<div className="label">
							Single class (all features)
							<div
								key="rule-frame-singlerule"
								className="frame-wrapper-object singleclass"
							>
								<div className="frame-wrapper-header">
									{this.state.current.valueDefinitionSingleRule.name}
								</div>
								<label className="container">
									Name
									<Input
										type="text"
										name="valueName-singlerule"
										placeholder=" "
										value={this.state.current.valueDefinitionSingleRule.name}
										onChange={this.onChangeRule.bind(this,false,"name")}
									/>
								</label>
								<label className="container">
									Fill colour
									<Input
										type="text"
										name="valueFillColour-singlerule"
										placeholder=" "
										value={this.state.current.valueDefinitionSingleRule.appearance.fillColour}
										onChange={this.onChangeRuleAppearance.bind(this,false,"fillColour")}
									/>
									<div className="picker-wrapper">
										<SliderPicker
											color={this.state.current.valueDefinitionSingleRule.appearance.fillColour || '#0000ff'}
											onChangeComplete={this.onChangeColorAppearance.bind(this,false)}
										/>
									</div>
								</label>
							</div>
						</div>
						<div className="frame-input-wrapper-info">
							No filter attribute selected, only all features can be styled.
						</div>
					</div>
				);
			}


			sourceForm = (
				<div>

					<h3>Definition</h3>

					<div className="frame-input-wrapper required">
						<label className="container">
							Features type
							<Select
								onChange={this.onChangeFeaturesType.bind(this)}
								options={FEATURESTYPES}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valueFeaturesType}
								clearable={false}
							/>
						</label>
						<div className="frame-input-wrapper-info">
							Type of the layers the style will be applied to.
						</div>
					</div>

					<div className="frame-input-wrapper required">
						<label className="container">
							Filter type
							<Select
								onChange={this.onChangeFilterType.bind(this)}
								options={FILTERTYPES}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valueFilterType}
								clearable={false}
							/>
						</label>
						<div className="frame-input-wrapper-info">
							How will the features be divided into classes.
						</div>
					</div>

					{commonFilterConfigInsert}

					{classesInsert}

				</div>
			);

		}
		else if (this.state.current.valueSource=="geoserver") {

			sourceForm = (
				<div className="frame-input-wrapper required">
					<label className="container">
						Server name
						<Input
							type="text"
							name="serverName"
							placeholder=" "
							value={this.state.current.valueServerName}
							onChange={this.onChangeServerName.bind(this)}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Geoserver style ID.
					</div>
				</div>
			);

		}

		ret = (
			<div>

				<div className="frame-input-wrapper required">
					<label className="container">
						Name
						<Input
							type="text"
							name="name"
							placeholder=" "
							value={this.state.current.valueName}
							onChange={this.onChangeName.bind(this)}
						/>
					</label>
				</div>

				<div className="frame-input-wrapper required">
					<label className="container">
						Source
						<Select
							onChange={this.onChangeSource.bind(this)}
							options={SOURCES}
							valueKey="key"
							labelKey="name"
							value={this.state.current.valueSource}
							clearable={false}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Style can be defined locally in Back Office or loaded from another system.
					</div>
				</div>

				{sourceForm}

				<ConfigControls
					key={"ConfigControls" + this.props.selectorValue}
					disabled={this.props.disabled}
					saved={this.equalStates(this.state.current,this.state.saved)}
					saving={this.state.saving}
					onSave={this.saveForm.bind(this)}
					onDelete={this.deleteObject.bind(this, this.props.selectorValue)}
				/>

			</div>
		);

		} else {
			ret = (
				<div className="component-loading"></div>
			);
		}

		return ret;

	}
}

export default ConfigMetadataStyle;
