import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisRuns.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';
import utils from '../../../utils/utils';
import logger from '../../../core/Logger';
import ActionCreator from '../../../actions/ActionCreator';
import ListenerHandler from '../../../core/ListenerHandler';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import { Input, Button, IconButton } from '../../SEUI/elements';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

import AnalysisRunModel from '../../../models/AnalysisRunModel';
import AnalysisStore from '../../../stores/AnalysisStore';
//import AULevelStore from '../../../stores/AULevelStore';
import ScopeStore from '../../../stores/ScopeStore';
import PlaceStore from '../../../stores/PlaceStore';
import PeriodStore from '../../../stores/PeriodStore';
import PantherComponent from "../../common/PantherComponent";


var initialState = {
	analysis: null,
	valueScope: [],
	valuesAULevels: [],
	valuesPlaces: [],
	valuesPeriods: []
};


@withStyles(styles)
class ScreenAnalysisRuns extends PantherComponent {

	static propTypes = {
		disabled: React.PropTypes.bool
	};

	static defaultProps = {
		disabled: false
	};

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
	}

	store2state(props, scope) {
		return {
			analysis: AnalysisStore.getById(props.data.analysis.key),
			levels: scope ? scope.levels : [],
			scopes: ScopeStore.getAll(),
			places: scope ? PlaceStore.getFiltered({scope: scope}) : [],
			scopePeriods: scope ? utils.getPeriodsForScope(scope) : []
		};
	}

	setStateFromStores(props, keys) {
		if(!props){
			props = this.props;
		}
		if(props.data.analysis) {
			var thisComponent = this;
			let scopePromise = null;
			if (this.state.valueScope.length) {
				scopePromise = ScopeStore.getById(this.state.valueScope[0]);
			} else {
				scopePromise = Promise.resolve(null);
			}
			scopePromise.then(function(scope){

				if (thisComponent.mounted) {
					super.setStateFromStores(thisComponent.store2state(props, scope), keys);
				}

			});
		}
	}

	_onStoreChange(keys) {
		logger.trace("ScreenAnalysisRuns# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props, keys);
	}

	componentDidMount() {
		super.componentDidMount();
		this.changeListener.add(AnalysisStore, ["analysis"]);
		//this.changeListener.add(AULevelStore, ["levels"]);
		this.changeListener.add(ScopeStore, ["scopes"]);
		this.changeListener.add(PlaceStore, ["places"]);
		//this.changeListener.add(PeriodStore, ["scopePeriods"]);

		this.setStateFromStores();
	}

	componentWillReceiveProps(newProps) {
		if (
			this.state.analysis &&
			(
				(this.state.analysis.key != newProps.data.analysis.key) ||
				(this.state.analysis.changed != newProps.data.analysis.changed)
			)
		) {
			// analysis was switched or updated outside - todo do we care? we really only care about key
			if (this.isStateUnchanged()) {
				// form was not edited, it's okay to reload
				logger.trace("ScreenAnalysisRuns# received props and will reload");
				this.setStateFromStores(newProps, ["analysis"]);
				this.updateStateHash(newProps);
			}
		}
	}


	/**
	 * Check if state is the same as it was when loaded from stores
	 * @returns {boolean}
	 */
	isFormFilledValid() {
		var isIt = false;
		if(this.state.analysis) {
			isIt = (
				this.state.valueScope.length &&
				this.state.valuesAULevels.length &&
				this.state.valuesPlaces.length &&
				this.state.valuesPeriods.length
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
		this._stateHash = utils.stringHash("ScreenAnalysisRuns" + props.data.analysis);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}

	saveForm() {
		let actionData = [], levels = [];

		let scope = _.findWhere(this.state.scopes, {key: this.state.valueScope[0]});

		for (let levelKey of this.state.valuesAULevels) {
			let level = _.findWhere(this.state.levels,{key: levelKey});
			levels.push(level);
		}

		for (let placeKey of this.state.valuesPlaces) {
			for (let periodKey of this.state.valuesPeriods) {

				let place = _.findWhere(this.state.places,{key: placeKey});
				let period = _.findWhere(this.state.scopePeriods.models,{key: periodKey});

				let modelData = {};
				modelData.analysis = this.state.analysis;
				modelData.place = place;
				modelData.period = period;
				modelData.levels = levels;
				modelData.scope = scope;

				let modelObj = new AnalysisRunModel(modelData);
				// actionData.push({type:"create",model:modelObj});
				ActionCreator.createObject(modelObj, ObjectTypes.ANALYSIS_RUN);

			}
		}

		// logger.info("ScreenAnalysisRuns# saveForm(), Add analysis runs:", actionData);
		// ActionCreator.handleObjects(actionData,ObjectTypes.ANALYSIS_RUN);
	}


	onChangeObjectSelect (stateKey, objectType, value, values) {
		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		var newState = {};
		newState[stateKey] = newValues;
		this.setState(newState);
	}

	onChangeScope (value, values) {
		let newValue = utils.handleNewObjects(values, ObjectTypes.SCOPE, {stateKey: "valueScope"}, this.getStateHash());
		if (newValue.length) {

			let scope = _.findWhere(this.state.scopes,{key: newValue[0]});
			let keys = ['levels','places','scopePeriods','valueScope'];
			let store2state = this.store2state(this.props, scope);
			store2state.valueScope = newValue;
			super.setStateFromStores(store2state, keys);


		} else {

			this.setState({
				valueScope: newValue,
				valuesAULevels: [],
				valuesPlaces: [],
				valuesPeriods: []
			});

		}
	}

	onObjectClick (value, event) {
		logger.trace("ScreenAnalysisRun# onObjectClick(), Value: ", value["key"]);
	}


	render() {

		let ret = null;
		if (this.state.analysis) {

			var saveButton = (
				<IconButton
					key="0"
					name="check"
					basic
					color="blue"
					disabled={this.props.disabled || !this.isFormFilledValid()}
					className="save-button"
					onClick={this.saveForm.bind(this)}
				>
					Add runs
				</IconButton>
			);

			let selectsInsert = [];
			if (this.state.valueScope.length) {

				selectsInsert.push((
					<div className="frame-input-wrapper" key="1">
						<label className="container">
							Places
							<UIObjectSelect
								multi
								onChange={this.onChangeObjectSelect.bind(this, "valuesPlaces", ObjectTypes.PLACE)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								options={this.state.places}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.valuesPlaces}
							/>
						</label>
					</div>
				));

				selectsInsert.push((
					<div className="frame-input-wrapper" key="2">
						<label className="container">
							Imaging/reference periods
							<UIObjectSelect
								multi
								onChange={this.onChangeObjectSelect.bind(this, "valuesPeriods", ObjectTypes.PERIOD)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								options={this.state.scopePeriods.models}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.valuesPeriods}
							/>
						</label>
					</div>
				));

				selectsInsert.push((
					<div className="frame-input-wrapper" key="3">
						<label className="container">
							Analytical units levels
							<UIObjectSelect
								multi
								onChange={this.onChangeObjectSelect.bind(this, "valuesAULevels", ObjectTypes.AU_LEVEL)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								options={this.state.levels}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.valuesAULevels}
							/>
						</label>
					</div>
				));

				selectsInsert.push(saveButton);

			} else {
				selectsInsert.push((
					<div className="prod" key="0">
						Select a scope
					</div>
				));
			}

			ret = (
				<div>
					<div className="screen-content-only">
						<div>

							<h2>Add analysis runs: {this.state.analysis.name}</h2>

							<div className="frame-input-wrapper">
								<label className="container">
									Scope
									<UIObjectSelect
										onChange={this.onChangeScope.bind(this)}
										onOptionLabelClick={this.onObjectClick.bind(this)}
										options={this.state.scopes}
										valueKey="key"
										labelKey="name"
										value={this.state.valueScope}
									/>
								</label>
							</div>

							{selectsInsert}

						</div>
					</div>
				</div>
			);

		}

		return ret;

	}
}

export default ScreenAnalysisRuns;
