import React, {PropTypes, Component} from 'react';
import ControllerComponent from '../../../../components/common/ControllerComponent';
import LayerActionCreator from '../../../actions/ActionCreator';
import ActionCreator from '../../../../actions/ActionCreator';
import logger from '../../../../core/Logger';
import utils from '../../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';

import {Input} from '../../../../components/SEUI/elements';
import UIObjectSelect from '../../../../components/atoms/UIObjectSelect';
import ConfigControls from '../../../../components/atoms/ConfigControls';

import WmsLayerModel from '../../../models/WmsLayerModel';
import PlaceModel from '../../../../models/PlaceModel';
import ScopeModel from '../../../../models/ScopeModel';
import PeriodModel from '../../../../models/PeriodModel';

import WmsStore from '../../../stores/WmsStore';

var initialState = {
	valueName: "",
	valueUrl: "",
	valueLayer: "",
	valueScope: [],
	valuePeriods: [],
	valuePlaces: []
};

class ConfigWmsLayer extends ControllerComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		store: PropTypes.shape({
			layers: PropTypes.arrayOf(PropTypes.instanceOf(WmsLayerModel)),
			scopes: PropTypes.arrayOf(PropTypes.instanceOf(ScopeModel)),
			places: PropTypes.arrayOf(PropTypes.instanceOf(PlaceModel)),
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

	buildState(props) {
		props = props || this.props;
		let nextState = {};
		if (props.selectorValue) {
			let layer = _.findWhere(props.store.layers, {key: props.selectorValue});
			if(layer) {
				nextState = {
					valueName: layer.name,
					valueUrl: layer.url,
					valueLayer: layer.layer,
					valueScope: [],
					valuePeriods: layer.periods,
					valuePlaces: layer.places
				};
				if (layer.scope) {
					nextState.valueScope.push(layer.scope);
				}
			}
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

		let layer = _.findWhere(this.props.store.layers, {key: this.props.selectorValue});
		layer.name = this.state.current.valueName;
		layer.url = this.state.current.valueUrl;
		layer.layer = this.state.current.valueLayer;
		for(let key of this.state.current.valueScope) {
			if(key instanceof ScopeModel) {
				layer.scope = key;
			} else {
				layer.scope = _.findWhere(this.props.store.scopes, {key: key});
			}
		}
		layer.places = [];
		for(let key of this.state.current.valuePlaces) {
			if(key instanceof PlaceModel) {
				layer.places.push(key);
			} else {
				layer.places.push(_.findWhere(this.props.store.places, {key: key}));
			}
		}
		layer.periods = [];
		for(let key of this.state.current.valuePeriods) {
			if(key instanceof PeriodModel) {
				layer.periods.push(key);
			} else {
				layer.periods.push(_.findWhere(this.props.store.periods, {key: key}));
			}
		}
		LayerActionCreator.updateWmsLayer(operationId, layer);
	}

	deleteObject(key) {
		LayerActionCreator.deleteWmsLayer(this.instance, key);
		if (key == this.props.selectorValue) {
			ActionCreator.closeScreen(this.props.screenKey); //todo close after confirmed
		}
	}


	onChangeName(e) {
		this.setCurrentState({
			valueName: e.target.value
		});
	}

	onChangeLayer(e) {
		this.setCurrentState({
			valueLayer: e.target.value
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
			valuePlaces: values
		})
	}

	onChangePeriod(value, values) {
		this.setCurrentState({
			valuePeriods: values
		})
	}

	render() {

		let ret = null;

		if (this.state.built) {
			let places = this.props.store.places;
			let periods = this.props.store.periods;

			if(this.state.current.valueScope && this.state.current.valueScope.length > 0) {
				let scope = this.state.current.valueScope[0];
				places = _.where(this.props.store.places, {scope: scope});
				periods = scope.periods;
			}


			ret = (
				<div>
					<p>It is possible to use only WMS servers, which allow for retrieval of the map using WGS84 Projection.</p>

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

					<div className="frame-input-wrapper required">
						<label className="container">
							Layer
							<Input
								type="text"
								name="name"
								placeholder=" "
								value={this.state.current.valueLayer}
								onChange={this.onChangeLayer.bind(this)}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper required">
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



					<div className="frame-input-wrapper required">
						<label className="container">
							Places
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangePlace.bind(this)}
								options={places}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuePlaces}
							/>
						</label>
					</div>



					<div className="frame-input-wrapper required">
						<label className="container">
							Periods
							<UIObjectSelect
								multi
								className="template"
								onChange={this.onChangePeriod.bind(this)}
								options={periods}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.current.valuePeriods}
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
