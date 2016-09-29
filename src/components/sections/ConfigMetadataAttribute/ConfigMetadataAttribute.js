import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import ActionCreator from '../../../actions/ActionCreator';
import logger from '../../../core/Logger';
import utils from '../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ScopeModel from '../../../models/ScopeModel';
import AttributeModel from '../../../models/AttributeModel';
import AttributeStore from '../../../stores/AttributeStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import Select from 'react-select';
import {SliderPicker} from 'react-color';
import ConfigControls from '../../atoms/ConfigControls';
import OptionStandardUnits from '../../atoms/UICustomSelect/OptionStandardUnits';
import SingleValueStandardUnits from '../../atoms/UICustomSelect/SingleValueStandardUnits';


var initialState = {
	valueActive: false,
	valueName: "",
	//valueCode: "",
	//valueType: [],
	valueType: "",
	valueUnitsStandard: "",
	valueUnitsCustom: "",
	valueColor: ""
};


class ConfigMetadataAttribute extends ControllerComponent {

	static propTypes = {
		disabled: React.PropTypes.bool,
		scope: PropTypes.instanceOf(ScopeModel),
		store: PropTypes.shape({
			attributes: PropTypes.arrayOf(PropTypes.instanceOf(AttributeModel))
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
			let attribute = _.findWhere(props.store.attributes, {key: props.selectorValue});
			if (attribute) {
				nextState = {
					valueActive: attribute.active,
					valueName: attribute.name,
					//valueCode: attribute.code,
					valueType: attribute.type,
					valueUnitsStandard: attribute.standardUnits,
					valueUnitsCustom: attribute.customUnits,
					valueColor: attribute.color
				};
			}
		}
		return nextState;
	}

	componentDidMount() {
		super.componentDidMount();
		this.errorListener.add(AttributeStore);
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
		let attribute = _.findWhere(this.props.store.attributes, {key: this.props.selectorValue});
		_.assign(modelData, attribute);
		modelData.active = this.state.current.valueActive;
		modelData.name = this.state.current.valueName;
		//modelData.code = this.state.valueCode;
		modelData.type = this.state.current.valueType;
		modelData.standardUnits = this.state.current.valueUnitsStandard;
		modelData.customUnits = this.state.current.valueUnitsCustom;
		modelData.color = this.state.current.valueColor;
		let modelObj = new Model[ObjectTypes.ATTRIBUTE](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.ATTRIBUTE, operationId);
	}

	deleteObject() {
		let model = new Model[ObjectTypes.ATTRIBUTE]({key: this.props.selectorValue});
		let actionData = [{type:"delete", model:model}];
		ActionCreator.handleObjects(actionData, ObjectTypes.ATTRIBUTE);
		ActionCreator.closeScreen(this.props.screenKey); //todo close after confirmed
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

	onChangeCode(e) {
		this.setCurrentState({
			valueCode: e.target.value
		});
	}

	onChangeType (value,values) {
		this.setCurrentState({
			valueType: value
		});
	}

	onChangeUnitsStandard (value,values) {
		let valueUnitsCustom = this.state.current.valueUnitsCustom;
		if (value) {
			valueUnitsCustom = "";
		}
		this.setCurrentState({
			valueUnitsStandard: value,
			valueUnitsCustom: valueUnitsCustom
		});
	}

	onChangeUnitsCustom(e) {
		this.setCurrentState({
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
		this.setCurrentState({
			valueColor: e.target.value
		});
	}

	onChangeColorSlider(color) {
		this.setCurrentState({
			valueColor: color.hex
		});
	}

	render() {

		let ret = null;

		if (this.state.built) {

		let attribute = _.findWhere(this.props.store.attributes, {key: this.props.selectorValue});


		var isActiveText = "inactive";
		var isActiveClasses = "activeness-indicator";
		if(attribute && attribute.active){
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
			},
			{
				key: "boolean",
				name: "Boolean"
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
							value={this.state.current.valueType}
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
							value={this.state.current.valueUnitsStandard}
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
							value={this.state.current.valueUnitsCustom}
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
							value={this.state.current.valueColor}
							onChange={this.onChangeColor.bind(this)}
						/>
						<SliderPicker
							color={this.state.current.valueColor}
							onChange={this.onChangeColorSlider.bind(this)}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Color used in thematic maps. Hexadecimal code.
					</div>
				</div>

				<ConfigControls
					disabled={this.props.disabled}
					saved={this.equalStates(this.state.current,this.state.saved)}
					saving={this.state.saving}
					onSave={this.saveForm.bind(this)}
					onDelete={this.deleteObject.bind(this)}
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

export default ConfigMetadataAttribute;
