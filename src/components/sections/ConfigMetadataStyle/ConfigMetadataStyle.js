import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

import utils from '../../../utils/utils';

import { Input, Button, Icon } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import Select from 'react-select';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import OptionDestination from '../../atoms/UICustomSelect/OptionDestination';
import SingleValueDestination from '../../atoms/UICustomSelect/SingleValueDestination';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import StyleStore from '../../../stores/StyleStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';

var initialState = {
	style: null,
	valueActive: false,
	valueName: "",
	valueServerName: "",
	valueSource: "definition",
	valueFeaturesType: "polygon",
	valueDefinitionRules: [],
	valueDefinitionSingleRule: {
		name: "",
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


class ConfigMetadataStyle extends PantherComponent{

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
			style: StyleStore.getById(props.selectorValue),
			attributeSets: AttributeSetStore.getAll()
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(props.selectorValue) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			this.context.setStateFromStores.call(this, store2state, keys);
			// if stores changed, overrides user input - todo fix

			if(!keys || keys.indexOf("style")!=-1) {
				store2state.style.then(function (style) {
					if(thisComponent.acceptChange) {
						thisComponent.acceptChange = false;
						let newState = {
							valueActive: style.active,
							valueName: style.name,
							valueSource: style.source
						};
						if (style.source=="definition") {
							newState.valueFeaturesType = style.definition.type;
							newState.valueFilterAttributeSet = style.definition.filterAttributeSetKey;
							newState.valueFilterAttribute = style.definition.filterAttributeKey;
							newState.valueDefinitionRules = style.definition.rules;
							newState.valueDefinitionSingleRule = style.definition.rules[0];
						}
						else if (style.source=="geoserver") {
							newState.valueServerName = style.serverName;
						}
						newState.savedState = utils.deepClone(newState);
						if (thisComponent.mounted) {
							thisComponent.setState(newState);
						}
					}
				});
			}
			if(!keys || keys.indexOf("attributeSets")!=-1) {
				store2state.attributeSets.then(function(attributeSets) {
					thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.atts2state(attributeSets));
				});
			}
		}
	}

	_onStoreChange(keys) {
		logger.trace("ConfigMetadataStyle# _onStoreChange(), Keys:", keys);
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

	componentDidMount() { this.mounted = true;
		this.changeListener.add(StyleStore, ["style"]);
		this.changeListener.add(AttributeSetStore, ["attributeSets"]);
		this.setStateFromStores();
	}

	componentWillUnmount() { this.mounted = false;
		this.changeListener.clean();
	}

	componentWillReceiveProps(newProps) {
		if(newProps.selectorValue!=this.props.selectorValue) {
			this.acceptChange = true;
			this.setStateFromStores(newProps);
			this.updateStateHash(newProps);
		}
	}


	/**
	 * Check if state is the same as it was when loaded from stores
	 * @returns {boolean}
	 */
	isStateUnchanged() {
		var isIt = true;
		if(this.state.style) {

			var definitionIsIt = true;
			if (
				this.state.valueSource=="definition" &&
				this.state.style.definition &&
				this.state.style.definition.hasOwnProperty("type")
			) {
				definitionIsIt = (
					this.state.valueFeaturesType == this.state.style.definition.type &&
					this.state.valueFilterAttributeSet == this.state.style.definition.filterAttributeSetKey &&
					this.state.valueFilterAttribute == this.state.style.definition.filterAttributeKey
				);
			}
			else if (this.state.valueSource=="geoserver") {
				definitionIsIt = this.state.valueServerName == this.state.style.serverName;
			}

			isIt = (
					this.state.valueActive == this.state.style.active &&
					this.state.valueName == this.state.style.name &&
					definitionIsIt
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
		var actionData = [], modelData = {};
		_.assign(modelData, this.state.style);
		modelData.active = this.state.valueActive;
		modelData.name = this.state.valueName;
		modelData.source = this.state.valueSource;

		if (this.state.valueSource=="definition") {
			modelData.definition = {
				type: this.state.valueFeaturesType,
				filterAttributeKey: this.state.valueFilterAttribute,
				filterAttributeSetKey: this.state.valueFilterAttributeSet,
			//	rules: [
			//		{
			//			name: 'Urban fabric',
			//			title: 'Urban fabric',
			//			filter: '111,112,113',
			//			appearance: {
			//				fillColour: '#D0091D'
			//			}
			//		},
			//		{
			//			name: 'Non-urban artificial areas',
			//			title: 'Non-urban artificial areas',
			//			filter: '120,121,130,140',
			//			appearance: {
			//				fillColour: '#AE0214'
			//			}
			//		},
			//		{
			//			name: 'Natural and semi-natural areas',
			//			title: 'Natural and semi-natural areas',
			//			filter: '310,320,330',
			//			appearance: {
			//				fillColour: '#59B642'
			//			}
			//		},
			//		{
			//			name: 'Water',
			//			title: 'Water',
			//			filter: '510,512,520',
			//			appearance: {
			//				fillColour: '#56C8EE'
			//			}
			//		}
			//	]
			};
		}
		else if (this.state.valueSource=="geoserver") {
			modelData.serverName = this.state.valueServerName;
		}

		let modelObj = new Model[ObjectTypes.STYLE](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.STYLE);
	}

	onChangeActive() {
		this.setState({
			valueActive: !this.state.valueActive
		});
	}

	onChangeName(e) {
		this.setState({
			valueName: e.target.value
		});
	}

	onChangeSource(value, values) {
		this.setState({
			valueSource: value
		});
	}

	onChangeFeaturesType(value, values) {
		this.setState({
			valueFeaturesType: value
		});
	}

	onChangeFilterDestination(value, values) {
		if (values.length) {
			this.setState({
				valueFilterAttributeSet: values[0].attributeSetKey,
				valueFilterAttribute: values[0].attributeKey
			});
		} else {
			this.setState({
				valueFilterAttributeSet: null,
				valueFilterAttribute: null
			});
		}
	}

	onChangeRule(ruleIndex,key,e) {
		if(ruleIndex) {
			this.context.setStateDeep.call(this, {
				valueDefinitionRules: {
					[ruleIndex]: {
						[key]: {$set: e.target.value}
					}
				}
			});
		} else {
			this.context.setStateDeep.call(this, {
				valueDefinitionSingleRule: {
					[key]: {$set: e.target.value}
				}
			});
		}
	}

	onChangeRuleAppearance(ruleIndex,key,e) {
		if (ruleIndex) {
			this.context.setStateDeep.call(this, {
				valueDefinitionRules: {
					[ruleIndex]: {
						appearance: {
							[key]: {$set: e.target.value}
						}
					}
				}
			});
		} else {
			this.context.setStateDeep.call(this, {
				valueDefinitionSingleRule: {
					appearance: {
						[key]: {$set: e.target.value}
					}
				}
			});
		}
	}

	onChangeRemoveRule(ruleIndex) {
		this.context.setStateDeep.call(this, {
			valueDefinitionRules: {$splice: [[ruleIndex,1]]}
		});
	}

	onChangeAddRule() {
		this.context.setStateDeep.call(this, {
			valueDefinitionRules: {$push: [{
				name: "",
				filter: "",
				appearance: {
					fillColour: "" // todo create more general (w/o appearance options)
				}
			}]}
		});
	}

	onChangeServerName(e) {
		this.setState({
			valueServerName: e.target.value
		});
	}

	onChangeObjectSelect (stateKey, objectType, value, values) {
		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		var newState = {};
		newState[stateKey] = newValues;
		this.setState(newState);
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

		var saveButton = " ";
		if (this.state.style) {
			saveButton = (
				<SaveButton
					saved={this.isStateUnchanged()}
					className="save-button"
					onClick={this.saveForm.bind(this)}
				/>
			);
		}

		var isActiveText = "inactive";
		var isActiveClasses = "activeness-indicator";
		if(this.state.style && this.state.style.active){
			isActiveText = "active";
			isActiveClasses = "activeness-indicator active";
		}

		let sourceForm = null;
		if (this.state.valueSource=="definition") {

			var filterDestination = null;
			if (this.state.valueFilterAttributeSet && this.state.valueFilterAttribute) {
				filterDestination = this.state.valueFilterAttributeSet + "-" + this.state.valueFilterAttribute;
			}

			var rulesInsert = [],classesInsert = null;
			if (this.state.valueFilterAttribute) {
				for (let ruleIndex in this.state.valueDefinitionRules) {
					rulesInsert.push(
						<div
							key={"rule-frame-" + ruleIndex}
							className="frame-input-wrapper"
						>
							<div className="frame-wrapper-header">
								{this.state.valueDefinitionRules[ruleIndex].name}
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
									value={this.state.valueDefinitionRules[ruleIndex].name}
									onChange={this.onChangeRule.bind(this,ruleIndex,"name")}
								/>
							</label>
							<label className="container">
								Filter
								<Input
									type="text"
									name={"valueFilter" + ruleIndex}
									placeholder=" "
									value={this.state.valueDefinitionRules[ruleIndex].filter}
									onChange={this.onChangeRule.bind(this,ruleIndex,"filter")}
								/>
							</label>
							<label className="container">
								Fill colour
								<Input
									type="text"
									name={"valueFillColour" + ruleIndex}
									placeholder=" "
									value={this.state.valueDefinitionRules[ruleIndex].appearance.fillColour}
									onChange={this.onChangeRuleAppearance.bind(this,ruleIndex,"fillColour")}
								/>
							</label>
						</div>
					);
				}
				rulesInsert.push(
					<a
						className="ptr-item simple add"
						href="#"
						onClick={this.onChangeAddRule.bind(this)}
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
				// no filter attribute set -> single class
				rulesInsert.push(
					<div
						key="rule-frame-singlerule"
						className="frame-input-wrapper singleclass"
					>
						<div className="frame-wrapper-header">
							{this.state.valueDefinitionSingleRule.name}
						</div>
						<label className="container">
							Name
							<Input
								type="text"
								name="valueName-singlerule"
								placeholder=" "
								value={this.state.valueDefinitionSingleRule.name}
								onChange={this.onChangeRule.bind(this,false,"name")}
							/>
						</label>
						<label className="container">
							Fill colour
							<Input
								type="text"
								name="valueFillColour-singlerule"
								placeholder=" "
								value={this.state.valueDefinitionSingleRule.appearance.fillColour}
								onChange={this.onChangeRuleAppearance.bind(this,false,"fillColour")}
							/>
						</label>
					</div>
				);
				classesInsert = (
					<div className="frame-input-wrapper required">
						<div className="label">
							Single class (all features)
							{rulesInsert}
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
								value={this.state.valueFeaturesType}
								clearable={false}
							/>
						</label>
						<div className="frame-input-wrapper-info">
							Type of the layers the style will be applied to.
						</div>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Filter attribute
							<Select
								onChange={this.onChangeFilterDestination.bind(this)}
								options={this.state.filterDestinations}
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

					{classesInsert}

				</div>
			);

		}
		else if (this.state.valueSource=="geoserver") {

			sourceForm = (
				<div className="frame-input-wrapper required">
					<label className="container">
						Server name
						<Input
							type="text"
							name="serverName"
							placeholder=" "
							value={this.state.valueServerName}
							onChange={this.onChangeServerName.bind(this)}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Geoserver style ID.
					</div>
				</div>
			);

		}

		return (
			<div>

				<div className="frame-input-wrapper">
					<div className="container activeness">
						<Checkbox
							checked={this.state.valueActive}
							onClick={this.onChangeActive.bind(this)}
						>
							<span>Active</span>
						</Checkbox>
						<div className="frame-input-pull-right">
							{isActiveText}
							<div className={isActiveClasses}></div>
						</div>
					</div>
				</div>

				<div className="frame-input-wrapper required">
					<label className="container">
						Name
						<Input
							type="text"
							name="name"
							placeholder=" "
							value={this.state.valueName}
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
							value={this.state.valueSource}
							clearable={false}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Style can be defined locally in Back Office or loaded from another system.
					</div>
				</div>

				{sourceForm}

				{saveButton}

			</div>
		);

	}
}

export default ConfigMetadataStyle;
