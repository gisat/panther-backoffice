import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';

import utils from '../../../utils/utils';

import { Input } from '../../SEUI/elements';
import _ from 'underscore';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import ScopeModel from '../../../models/ScopeModel';
import PeriodModel from '../../../models/PeriodModel';

import logger from '../../../core/Logger';

var initialState = {
	valueActive: false,
	valueName: ""
};


class ConfigMetadataPeriod extends ControllerComponent{

	static propTypes = {
		disabled: React.PropTypes.bool,
		scope: PropTypes.instanceOf(ScopeModel),
		store: PropTypes.shape({
			periods: PropTypes.arrayOf(PropTypes.instanceOf(PeriodModel))
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

	buildState(props){
		props = props || this.props;
		let nextState = {};
		if(props.selectorValue) {
			let period = _.findWhere(props.store.periods, {key: props.selectorValue});
			nextState = {
				valueActive: period.active,
				valueName: period.name
			};
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

	saveForm() {
		super.saveForm();
		var actionData = [], modelData = {};
		let period = _.findWhere(this.props.store.periods, {key: this.props.selectorValue});
		_.assign(modelData, period);
		// modelData.active = this.state.current.valueActive;
		modelData.name = this.state.current.valueName;
		let modelObj = new Model[ObjectTypes.PERIOD](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.PERIOD);
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


	render() {

		let ret = null;

		var saveButton = " ";
		let period = _.findWhere(this.props.store.periods, {key: this.props.selectorValue});
		if (period && this.state.built) {
			saveButton = (
				<SaveButton
					saved={this.equalStates(this.state.current,this.state.saved)}
					saving={this.state.saving}
					className="save-button"
					onClick={this.saveForm.bind(this)}
				/>
			);
			// var isActiveText = "inactive";
			// var isActiveClasses = "activeness-indicator";
			// if(period && period.active){
			// 	isActiveText = "active";
			// 	isActiveClasses = "activeness-indicator active";
			// }

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

					{saveButton}

				</div>
			);

		}
		return ret;
	}
}

export default ConfigMetadataPeriod;
