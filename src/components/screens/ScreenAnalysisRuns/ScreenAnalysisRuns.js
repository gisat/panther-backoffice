import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisRuns.css';
import withStyles from '../../../decorators/withStyles';

import utils from '../../../utils/utils';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import AnalysisStore from '../../../stores/AnalysisStore';
import ScopeStore from '../../../stores/ScopeStore';
import PlaceStore from '../../../stores/PlaceStore';
import PeriodStore from '../../../stores/PeriodStore';


var initialState = {
	analysis: null,
	valueScope: [],
	valuesAULevels: [],
	valuesSPlaces: [],
	valuesPeriods: []
};


@withStyles(styles)
class ScreenAnalysisRuns extends Component {

	static propTypes = {
		disabled: React.PropTypes.bool
	};

	static defaultProps = {
		disabled: false
	};

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		onSetScreenData: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}

	store2state(props) {
		return {
			analysis: AnalysisStore.getById(props.data.objectKey),
			scopes: ScopeStore.getAll(),
			places: PlaceStore.getAll(),
			periods: PeriodStore.getAll()
		};
	}

	setStateFromStores(props, keys) {
		if(!props){
			props = this.props;
		}
		if(props.data.objectKey) {
			this.context.setStateFromStores.call(this, this.store2state(props), keys);
		}
	}

	_onStoreChange(keys) {
		this.setStateFromStores(this.props, keys);
	}

	componentDidMount() {
		AnalysisStore.addChangeListener(this._onStoreChange.bind(this,["analysis"]));
		ScopeStore.addChangeListener(this._onStoreChange.bind(this,["scopes"]));
		PlaceStore.addChangeListener(this._onStoreChange.bind(this,["places"]));
		PeriodStore.addChangeListener(this._onStoreChange.bind(this,["periods"]));
		this.setStateFromStores();
	}

	componentWillUnmount() {
		AnalysisStore.removeChangeListener(this._onStoreChange.bind(this,["analysis"]));
		ScopeStore.removeChangeListener(this._onStoreChange.bind(this,["scopes"]));
		PlaceStore.removeChangeListener(this._onStoreChange.bind(this,["places"]));
		PeriodStore.removeChangeListener(this._onStoreChange.bind(this,["periods"]));
	}

	componentWillReceiveProps(newProps) {
		if(newProps.data.objectKey!=this.props.data.objectKey) {
			this.setStateFromStores(newProps, ["analysis"]);
			this.updateStateHash(newProps);
		}
	}


	/**
	 * Check if state is the same as it was when loaded from stores
	 * @returns {boolean}
	 */
	isStateUnchanged() {
		var isIt = true;
		if(this.state.analysis) {
			isIt = (
				!this.state.valueScope.length &&
				!this.state.valuesAULevels.length &&
				!this.state.valuesSPlaces.length &&
				!this.state.valuesPeriods.length
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
		this._stateHash = utils.stringHash(props.data.analysis);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}

	saveForm() {

	}

	onChangeObjectSelect (stateKey, objectType, value, values) {
		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		var newState = {};
		newState[stateKey] = newValues;
		this.setState(newState);
	}

	onObjectClick (value, event) {
		console.log("yay! " + value["key"]);
	}


	render() {

		var saveButton = " ";
		if (this.state.period) {
			saveButton = (
				<SaveButton
					saved={this.isStateUnchanged()}
					className="save-button"
					onClick={this.saveForm.bind(this)}
				/>
			);
		}

		return (
			<div>

				<div className="frame-input-wrapper">
					<label className="container">
						Scope
						<UIObjectSelect
							onChange={this.onChangeObjectSelect.bind(this, "valueScope", ObjectTypes.SCOPE)}
							onOptionLabelClick={this.onObjectClick.bind(this)}
							options={this.state.scopes}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valueScope}
						/>
					</label>
				</div>

				<div className="frame-input-wrapper">
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

				<div className="frame-input-wrapper">
					<label className="container">
						Imaging/reference periods
						<UIObjectSelect
							multi
							onChange={this.onChangeObjectSelect.bind(this, "valuesPeriods", ObjectTypes.PERIOD)}
							onOptionLabelClick={this.onObjectClick.bind(this)}
							options={this.state.periods}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valuesPeriods}
						/>
					</label>
				</div>

				{saveButton}

			</div>
		);

	}
}

export default ScreenAnalysisRuns;
