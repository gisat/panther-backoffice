import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import ActionCreator from '../../../actions/ActionCreator';
import logger from '../../../core/Logger';
import utils from '../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ScopeModel from '../../../models/ScopeModel';
import LayerGroupModel from '../../../models/LayerGroupModel';
import LayerGroupStore from '../../../stores/LayerGroupStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import ConfigControls from '../../atoms/ConfigControls';

var initialState = {
	valueActive: false,
	valueName: "",
	valueOrder: null
};


class ConfigMetadataLayerGroup extends ControllerComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		scope: PropTypes.instanceOf(ScopeModel),
		store: PropTypes.shape({
			attributeSets: PropTypes.arrayOf(PropTypes.instanceOf(LayerGroupModel))
		}).isRequired,
		selectorValue: PropTypes.any
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
			let layerGroup = _.findWhere(props.store.layerGroups, {key: props.selectorValue});
			if (layerGroup) {
				nextState = {
					valueActive: layerGroup.active,
					valueName: layerGroup.name,
					valueOrder: layerGroup.order
				};
			}
		}
		return nextState;
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
		super.saveForm();

		var actionData = [], modelData = {};
		let layerGroup = _.findWhere(this.props.store.layerGroups, {key: this.props.selectorValue});
		_.assign(modelData, layerGroup);
		modelData.active = this.state.current.valueActive;
		modelData.name = this.state.current.valueName;
		modelData.order = this.state.current.valueOrder;
		let modelObj = new Model[ObjectTypes.LAYER_GROUP](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.LAYER_GROUP);
	}

	deleteObject() {
		let model = new Model[ObjectTypes.LAYER_GROUP]({key: this.props.selectorValue});
		let actionData = [{type:"delete", model:model}];
		ActionCreator.handleObjects(actionData, ObjectTypes.LAYER_GROUP);
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

	onChangeOrder(e) {
		this.setCurrentState({
			valueOrder: e.target.value
		});
	}


	render() {

		let ret = null;

		if (this.state.built) {


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
						Order
						<Input
							type="text"
							name="serverName"
							placeholder=" "
							value={this.state.current.valueOrder}
							onChange={this.onChangeOrder.bind(this)}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Display order - layer groups are listed ordered from lowest to highest number
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

export default ConfigMetadataLayerGroup;
