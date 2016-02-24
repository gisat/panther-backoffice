import React, { PropTypes, Component } from 'react';
import styles from './ConfigMetadataScope.css';
import withStyles from '../../../decorators/withStyles';

import utils from '../../../utils/utils';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import ScopeStore from '../../../stores/ScopeStore';
import AULevelStore from '../../../stores/AULevelStore';
//import PeriodStore from '../../../stores/PeriodStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';


var initialState = {
	scope: null,
	valueActive: false,
	valueName: "",
	valuesAULevels: []
	//valuesPeriods: [] //periods are to move from theme to scope, but cannot without changes in FO
};


@withStyles(styles)
class ConfigMetadataScope extends Component{

	static propTypes = {
		disabled: React.PropTypes.bool,
		selectorValue: React.PropTypes.any
	};

	static defaultProps = {
		disabled: false,
		selectorValue: null
	};

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		onSetScreenData: PropTypes.func.isRequired,
		openScreen: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}

	store2state(props) {
		return {
			scope: ScopeStore.getById(props.selectorValue),
			auLevels: AULevelStore.getAll()
			//periods: PeriodStore.getAll()
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(props.selectorValue) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			this.context.setStateFromStores.call(this, store2state, keys);
			// if stores changed, overrides user input - todo fix

			store2state.scope.then(function(scope) {
				let newState = {
					valueActive: scope.active,
					valueName: scope.name,
					valuesAULevels: utils.getModelsKeys(scope.levels)
					//valuesPeriods: utils.getModelsKeys(scope.periods)
				};
				newState.savedState = utils.deepClone(newState);
				thisComponent.setState(newState);
			});
		}

	}

	_onStoreChange(keys) {
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		ScopeStore.addChangeListener(this._onStoreChange.bind(this,["scope"]));
		this.setStateFromStores();
	}

	componentWillUnmount() {
		ScopeStore.removeChangeListener(this._onStoreChange.bind(this,["scope"]));
	}

	componentWillReceiveProps(newProps) {
		if(newProps.selectorValue!=this.props.selectorValue) {
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
		if(this.state.scope) {
			isIt = (
					this.state.valueActive == this.state.scope.active &&
					this.state.valueName == this.state.scope.name &&
					_.isEqual(this.state.valuesAULevels,this.state.savedState.valuesAULevels)
					//_.isEqual(this.state.valuesPeriods,this.state.savedState.valuesPeriods)
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
		var actionData = [], modelData = {};
		_.assign(modelData, this.state.scope);
		modelData.active = this.state.valueActive;
		modelData.name = this.state.valueName;
		//todo the rest
		let modelObj = new Model[ObjectTypes.SCOPE](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.SCOPE);
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

	onChangeObjectSelect (stateKey, objectType, value, values) {
		values = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		var newState = {};
		newState[stateKey] = values;
		this.setState(newState);
	}

	onObjectClick (itemType, value, event) {
		this.context.onInteraction().call();
		var screenName = this.props.screenKey + "-ScreenMetadata" + itemType;
		this.context.openScreen(screenName,ScreenMetadataObject,this.props.parentUrl,{size:40},{objectType: itemType,objectKey:value.key});
	}


	render() {

		var saveButton = " ";
		if (this.state.scope) {
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
		if(this.state.scope && this.state.scope.active){
			isActiveText = "active";
			isActiveClasses = "activeness-indicator active";
		}

		return (
			<div>

				<div className="frame-input-wrapper">
					<div className="container activeness">
						<Checkbox
							checked={this.state.valueActive}
							onClick={this.onChangeActive.bind(this)}
						>
							<span>Active</span>
						</Checkbox>
						<div className="frame-input-pull-right">
							{isActiveText}
							<div className={isActiveClasses}></div>
						</div>
					</div>
				</div>

				<div className="frame-input-wrapper">
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

				<div className="frame-input-wrapper">
					<label className="container">
						Analytical units Levels
						<UIObjectSelect
							multi
							onChange={this.onChangeObjectSelect.bind(this, "valuesAULevels", ObjectTypes.AU_LEVEL)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.AU_LEVEL)}
							options={this.state.auLevels}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valuesAULevels}
						/>
					</label>
				</div>

				{/*<div className="frame-input-wrapper">
					<label className="container">
						Imaging/reference periods
						<UIObjectSelect
							multi
							onChange={this.onChangeObjectSelect.bind(this, "valuesPeriods", ObjectTypes.PERIOD)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.PERIOD)}
							options={this.state.periods}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valuesPeriods}
						/>
					</label>
				</div>*/}

				{saveButton}

			</div>
		);

	}
}

export default ConfigMetadataScope;
