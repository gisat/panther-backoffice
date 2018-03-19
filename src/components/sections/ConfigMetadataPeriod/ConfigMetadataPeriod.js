import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import config from '../../../config';
import ActionCreator from '../../../actions/ActionCreator';
import logger from '../../../core/Logger';
import utils from '../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ScopeModel from '../../../models/ScopeModel';
import PeriodModel from '../../../models/PeriodModel';
import PeriodStore from '../../../stores/PeriodStore';

import { Input } from '../../SEUI/elements';
import ConfigControls from '../../atoms/ConfigControls';

let modelConfig = _.assign({}, config.models.common, config.models.PERIOD);

var initialState = {
	valueName: ""
};
if (modelConfig.period) {
	initialState.valuePeriod = "";
}


class ConfigMetadataPeriod extends ControllerComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		scope: PropTypes.instanceOf(ScopeModel),
		store: PropTypes.shape({
			periods: PropTypes.arrayOf(PropTypes.instanceOf(PeriodModel))
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

	buildState(props){
		props = props || this.props;
		let nextState = {};
		if(props.selectorValue) {
			let period = _.findWhere(props.store.periods, {key: props.selectorValue});
			nextState = {
				valueName: period.name
			};
			if (modelConfig.period) {
				nextState.valuePeriod = period.period;
			}
		}
		return nextState;
	}

	componentDidMount() {
		super.componentDidMount();
		this.errorListener.add(PeriodStore);
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
		let period = _.findWhere(this.props.store.periods, {key: this.props.selectorValue});
		_.assign(modelData, period);
		// modelData.active = this.state.current.valueActive;
		modelData.name = this.state.current.valueName;
		if (modelConfig.period) {
			modelData.period = this.state.current.valuePeriod;
		}
		let modelObj = new Model[ObjectTypes.PERIOD](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.PERIOD, operationId);
	}

	deleteObject(key) {
		let model = new Model[ObjectTypes.PERIOD]({key: key});
		let actionData = [{type:"delete", model:model}];
		ActionCreator.handleObjects(actionData, ObjectTypes.PERIOD);
		if (key == this.props.selectorValue) {
			ActionCreator.closeScreen(this.props.screenKey); //todo close after confirmed
		}
	}


	onChangeName(e) {
		this.setCurrentState({
			valueName: e.target.value
		});
	}

	onChangePeriod(e) {
		this.setCurrentState({
			valuePeriod: e.target.value
		});
	}


	render() {

		let ret = null;

		if (this.state.built) {

			let periodField = null;
			if (modelConfig.period) {
				periodField = (
					<div
						className="frame-input-wrapper"
						key="extended-fields-period"
					>
						<label className="container">
							Period
							<Input
								type="text"
								name="period"
								placeholder=" "
								value={this.state.current.valuePeriod}
								onChange={this.onChangePeriod.bind(this)}
							/>
						</label>
						<div className="frame-input-wrapper-info">
							ISO 8601 datetime, partial date (e.g. 2017-03) or interval (start/end). Partial date (year, month, day) is treated as an interval.
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

					{periodField}

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

export default ConfigMetadataPeriod;
