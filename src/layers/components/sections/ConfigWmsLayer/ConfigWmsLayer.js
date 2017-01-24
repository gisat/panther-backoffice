import React, {PropTypes, Component} from 'react';
import ControllerComponent from '../../../../components/common/ControllerComponent';
import ActionCreator from '../../../actions/ActionCreator';
import logger from '../../../../core/Logger';
import utils from '../../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';

import {Input} from '../../../../components/SEUI/elements';
import ConfigControls from '../../../../components/atoms/ConfigControls';

import WmsLayerModel from '../../../models/WmsLayerModel';

import WmsStore from '../../../stores/WmsStore';

var initialState = {
	valueName: "",
	valueUrl: "",
	valueScope: [],
	valuePeriod: [],
	valuePlace: []
};


class ConfigWmsLayer extends ControllerComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		store: PropTypes.shape({
			layers: PropTypes.arrayOf(PropTypes.instanceOf(WmsLayerModel)),
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
		props = props || this.props;
		let nextState = {};
		if (props.selectorValue) {
			let layer = _.findWhere(props.store.layers, {key: props.selectorValue});
			nextState = {
				valueName: layer.name
			};
		}
		return nextState;
	}

	componentDidMount() {
		super.componentDidMount();

		this.errorListener.add(WmsStore);
	}


	/**
	 * Differentiate between states
	 * - when receiving response for asynchronous action, ensure state has not changed in the meantime
	 */
	updateStateHash(props) {
		if (!props) {
			props = this.props;
		}
		// todo hash influenced by screen/page instance / active screen (unique every time it is active)
		this._stateHash = utils.stringHash(props.selectorValue);
	}

	saveForm(closePanelAfter) {
		let operationId = super.saveForm();

		ActionCreator.updateWmsLayer();
	}

	deleteObject(key) {
		ActionCreator.deleteWmsLayer(this.instance, key);
		if (key == this.props.selectorValue) {
			ActionCreator.closeScreen(this.props.screenKey); //todo close after confirmed
		}
	}


	onChangeName(e) {
		this.setCurrentState({
			valueName: e.target.value
		});
	}

	onChangeUrl(e) {
		this.setCurrentState({
			valueUrl: e.target.value
		})
	}

	onChangeScope(value, values) {
		this.setCurrentState({
			valueScope: values
		})
	}

	onChangePlace(value, values) {
		this.setCurrentState({
			valuePlace: values
		})
	}

	onChangePeriod(value, values) {
		this.setCurrentState({
			valuePeriod: values
		})
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
							URL
							<Input
								type="text"
								name="name"
								placeholder=" "
								value={this.state.current.valueUrl}
								onChange={this.onChangeUrl.bind(this)}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Scope
							<UIObjectSelect
								className="template"
								onChange={this.onChangeScope.bind(this)}
								options={this.props.store.scopes}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valueScope}
							/>
						</label>
					</div>



					<div className="frame-input-wrapper">
						<label className="container">
							Place
							<UIObjectSelect
								className="template"
								onChange={this.onChangePlace.bind(this)}
								options={this.props.store.places}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuePlace}
							/>
						</label>
					</div>



					<div className="frame-input-wrapper">
						<label className="container">
							Periods
							<UIObjectSelect
								className="template"
								onChange={this.onChangePeriod.bind(this)}
								options={this.props.store.periods}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuePeriod}
							/>
						</label>
					</div>

					<ConfigControls
						key={"ConfigControls" + this.props.selectorValue}
						disabled={this.props.disabled}
						saved={this.equalStates(this.state.current, this.state.saved)}
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

export default ConfigWmsLayer;
