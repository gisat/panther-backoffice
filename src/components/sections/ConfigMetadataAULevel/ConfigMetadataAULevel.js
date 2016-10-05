import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import ActionCreator from '../../../actions/ActionCreator';
import logger from '../../../core/Logger';
import utils from '../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ScopeModel from '../../../models/ScopeModel';
import AULevelModel from '../../../models/AULevelModel';
import AULevelStore from '../../../stores/AULevelStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import ConfigControls from '../../atoms/ConfigControls';

var initialState = {
	//valueActive: false,
	valueName: ""
};


class ConfigMetadataAULevel extends ControllerComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		scope: PropTypes.instanceOf(ScopeModel),
		store: PropTypes.shape({
			levels: PropTypes.arrayOf(PropTypes.instanceOf(AULevelModel))
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
			let level = _.findWhere(props.store.levels, {key: props.selectorValue});
			if (level) {
				nextState = {
					//valueActive: level.active,
					valueName: level.name
				};
			}
		}
		return nextState;
	}

	componentDidMount() {
		super.componentDidMount();
		this.errorListener.add(AULevelStore);
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
		let level = _.findWhere(this.props.store.levels, {key: this.props.selectorValue});
		_.assign(modelData, level);
		//modelData.active = this.state.current.valueActive;
		modelData.name = this.state.current.valueName;
		let modelObj = new Model[ObjectTypes.AU_LEVEL](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.AU_LEVEL, operationId);
	}

	deleteObject(key) {
		let model = new Model[ObjectTypes.AU_LEVEL]({key: key});
		let actionData = [{type:"delete", model:model}];
		ActionCreator.handleObjects(actionData, ObjectTypes.AU_LEVEL);
		ActionCreator.closeScreen(this.props.screenKey); //todo close after confirmed
	}


	//onChangeActive() {
	//	this.setCurrentState({
	//		valueActive: !this.state.current.valueActive
	//	});
	//}

	onChangeName(e) {
		this.setCurrentState({
			valueName: e.target.value
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

				<ConfigControls
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

export default ConfigMetadataAULevel;
