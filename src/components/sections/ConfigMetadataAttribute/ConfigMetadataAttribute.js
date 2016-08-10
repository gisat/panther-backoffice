import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';
import Select from 'react-select';

import utils from '../../../utils/utils';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import SaveButton from '../../atoms/SaveButton';

import OptionStandardUnits from '../../atoms/UICustomSelect/OptionStandardUnits';
import SingleValueStandardUnits from '../../atoms/UICustomSelect/SingleValueStandardUnits';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import AttributeStore from '../../../stores/AttributeStore';
import TopicStore from '../../../stores/TopicStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';
import {SliderPicker} from 'react-color';

var initialState = {
	attribute: null,
	valueActive: false,
	valueName: "",
	valueCode: "",
	//valueType: [],
	valueType: "",
	valueUnitsStandard: [],
	valueUnitsCustom: "",
	valueColor: ""
};


class ConfigMetadataAttribute extends PantherComponent{

	static propTypes = {
		disabled: React.PropTypes.bool,
		selectorValue: React.PropTypes.any
	};

	static defaultProps = {
		disabled: false,
		selectorValue: null
	};

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}

	store2state(props) {
		return {
			attribute: AttributeStore.getById(props.selectorValue)
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(props.selectorValue) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			super.setStateFromStores.call(this, store2state, keys);
			// if stores changed, overrides user input - todo fix

			if(!keys || keys.indexOf("attribute")!=-1) {
				store2state.attribute.then(function (attribute) {
					if(thisComponent.acceptChange) {
						thisComponent.acceptChange = false;
						let newState = {
							valueActive: attribute.active,
							valueName: attribute.name,
							valueCode: attribute.code,
							//valueType: attribute.type ? [attribute.type] : [],
							valueType: attribute.type,
							valueUnitsStandard: attribute.standardUnits,
							valueUnitsCustom: attribute.customUnits,
							valueColor: attribute.color
						};
						newState.savedState = utils.deepClone(newState);
						if (thisComponent.mounted) {
							thisComponent.setState(newState);
						}
					}
				});
			}
		}
	}

	_onStoreChange(keys) {
		logger.trace("ConfigMetadataAttribute# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		super.componentDidMount();
		this.changeListener.add(AttributeStore, ["attribute"]);

		this.setStateFromStores();
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
		if(this.state.attribute) {
			isIt = (
					this.state.valueActive == this.state.attribute.active &&
					this.state.valueName == this.state.attribute.name &&
					//this.state.valueCode == this.state.attribute.code &&
					_.isEqual(this.state.valueType,this.state.savedState.valueType) &&
					_.isEqual(this.state.valueUnitsStandard,this.state.savedState.valueUnitsStandard) &&
					this.state.valueUnitsCustom == this.state.attribute.customUnits &&
					this.state.valueColor == this.state.attribute.color
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
		_.assign(modelData, this.state.attribute);
		modelData.active = this.state.valueActive;
		modelData.name = this.state.valueName;
		//modelData.code = this.state.valueCode;
		//modelData.type = _.findWhere(this.state.topics, {key: this.state.valueTopic[0]});
		modelData.type = this.state.valueType;
		modelData.standardUnits = this.state.valueUnitsStandard;
		modelData.customUnits = this.state.valueUnitsCustom;
		modelData.color = this.state.valueColor;
		let modelObj = new Model[ObjectTypes.ATTRIBUTE](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.ATTRIBUTE);
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

	onChangeCode(e) {
		this.setState({
			valueCode: e.target.value
		});
	}

	onChangeType (value,values) {
		this.setState({
			valueType: value
		});
	}

	onChangeUnitsStandard (value,values) {
		this.setState({
			valueUnitsStandard: value
		});
	}

	onChangeUnitsCustom(e) {
		this.setState({
			valueUnitsCustom: e.target.value
		});
	}

	onChangeColor(e) {
		//var hexCode = "";
		//if (/^#[0-9A-F]{3,6}$/i.test(e.target.value)) {
		//	hexCode = e.target.value;
		//} else if (/^[0-9A-F]{3,6}$/i.test(e.target.value)) {
		//	hexCode = "#" + e.target.value;
		//}
		// onChange is called per character, validation cannot be here
		this.setState({
			valueColor: e.target.value
		});
	}

	onChangeColorSlider(color) {
		this.setState({
			valueColor: color.hex
		});
	}

	render() {

		var saveButton = " ";
		if (this.state.attribute) {
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
		if(this.state.attribute && this.state.attribute.active){
			isActiveText = "active";
			isActiveClasses = "activeness-indicator active";
		}

		var attributeTypes = [
			{
				key: "numeric",
				name: "Numeric"
			},
			{
				key: "text",
				name: "Text"
			}
		];
		var standardUnits = [
			{
				key: "m2",
				name: "m2",
				nameToSquare: "m"
			},
			{
				key: "km2",
				name: "km2",
				nameToSquare: "km"
			}
		];

		return (
			<div>

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

				{/*<div className="frame-input-wrapper">
					<label className="container">
						Code
						<Input
							type="text"
							name="serverName"
							placeholder=" "
							value={this.state.valueCode}
							onChange={this.onChangeCode.bind(this)}
						/>
					</label>
					<div className="frame-input-wrapper-info">

					</div>
				</div>*/}

				<div className="frame-input-wrapper required">
					<label className="container">
						Type
						<Select
							onChange={this.onChangeType.bind(this)}
							options={attributeTypes}
							valueKey="key"
							labelKey="name"
							value={this.state.valueType}
						/>
					</label>
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Standard units
						<Select
							onChange={this.onChangeUnitsStandard.bind(this)}
							options={standardUnits}
							optionComponent={OptionStandardUnits}
							singleValueComponent={SingleValueStandardUnits}
							valueKey="key"
							labelKey="name"
							value={this.state.valueUnitsStandard}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Units recognized by the system. Use for data used in analyses.
					</div>
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Custom Units
						<Input
							type="text"
							name="customUnits"
							placeholder=" "
							value={this.state.valueUnitsCustom}
							onChange={this.onChangeUnitsCustom.bind(this)}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						All other units. (%, hectares, inhabitants, beds, meters/km2, etc.)<br/>
						Only if no standard units are applied.
					</div>
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Color
						<Input
							type="text"
							name="color"
							placeholder=" "
							value={this.state.valueColor}
							onChange={this.onChangeColor.bind(this)}
						/>
						<SliderPicker
							color={this.state.valueColor}
							onChange={this.onChangeColorSlider.bind(this)}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Color used in thematic maps. Hexadecimal code.
					</div>
				</div>

				{saveButton}

			</div>
		);

	}
}

export default ConfigMetadataAttribute;
