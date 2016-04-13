import React, { PropTypes, Component } from 'react';

import utils from '../../../utils/utils';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import ThemeStore from '../../../stores/ThemeStore';
import TopicStore from '../../../stores/TopicStore';
import ScopeStore from '../../../stores/ScopeStore';
import PeriodStore from '../../../stores/PeriodStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';


var initialState = {
	style: null,
	valueActive: false,
	valueName: "",
	valueScope: [],
	valuesTopics: [],
	valuesTopicsPreferential: [],
	valuesPeriods: []
};


class ConfigMetadataTheme extends Component{

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
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}

	store2state(props) {
		return {
			theme: ThemeStore.getById(props.selectorValue),
			scopes: ScopeStore.getAll(),
			topics: TopicStore.getAll()
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

			if(!keys || keys.indexOf("theme")!=-1) {
				store2state.theme.then(function (theme) {

					let newState = {
						valueActive: theme.active,
						valueName: theme.name,
						valueScope: theme.scope ? [theme.scope.key] : [],
						valuesTopics: utils.getModelsKeys(theme.topics),
						valuesTopicsPreferential: utils.getModelsKeys(theme.topicsPreferential),
						valuesPeriods: utils.getModelsKeys(theme.periods)
					};
					newState.savedState = utils.deepClone(newState);
					if(thisComponent.mounted) {
						thisComponent.setState(newState);
					}

				});
			}
		}
	}

	_onStoreChange(keys) {
		this.setStateFromStores(this.props,keys);
	}

	_onStoreResponse(result,responseData,stateHash) {
		var thisComponent = this;
		if (stateHash === this.getStateHash()) {
			if (responseData.hasOwnProperty("stateKey") && responseData.stateKey) {
				let stateKey = responseData.stateKey;
				let values = utils.deepClone(thisComponent.state[stateKey]);
				values.push(result[0].key);
				thisComponent.setState({
					[stateKey]: values
				});
				var screenObjectType;
				switch(stateKey){
					case "valueScope":
						screenObjectType = ObjectTypes.SCOPE;
						break;
					case "valuesTopics":
					case "valuesTopicsPreferential":
						screenObjectType = ObjectTypes.TOPIC;
						break;
					case "valuesPeriods":
						screenObjectType = ObjectTypes.PERIOD;
						break;
				}
				var screenName = this.props.screenKey + "-ScreenMetadata" + screenObjectType;
				if(screenObjectType) {
					let options = {
						component: ScreenMetadataObject,
						parentUrl: this.props.parentUrl,
						size: 40,
						data: {
							objectType: screenObjectType,
							objectKey: result[0].key
						}
					};
					ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
				}
			}
		}
	}

	componentDidMount() { this.mounted = true;
		ThemeStore.addChangeListener(this._onStoreChange.bind(this,["theme"]));
		ScopeStore.addChangeListener(this._onStoreChange.bind(this,["scopes"]));
		ScopeStore.addResponseListener(this._onStoreResponse.bind(this));
		TopicStore.addChangeListener(this._onStoreChange.bind(this,["topics"]));
		TopicStore.addResponseListener(this._onStoreResponse.bind(this));
		PeriodStore.addResponseListener(this._onStoreResponse.bind(this));
		this.setStateFromStores();
	}

	componentWillUnmount() { this.mounted = false;
		ThemeStore.removeChangeListener(this._onStoreChange.bind(this,["theme"]));
		ScopeStore.removeChangeListener(this._onStoreChange.bind(this,["scopes"]));
		ScopeStore.removeResponseListener(this._onStoreResponse.bind(this));
		TopicStore.removeChangeListener(this._onStoreChange.bind(this,["topics"]));
		TopicStore.removeResponseListener(this._onStoreResponse.bind(this));
		PeriodStore.removeResponseListener(this._onStoreResponse.bind(this));
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
		if(this.state.theme) {
			isIt = (
				this.state.valueActive == this.state.theme.active &&
				this.state.valueName == this.state.theme.name &&
				_.isEqual(this.state.valueScope,this.state.savedState.valueScope) &&
				_.isEqual(this.state.valuesTopics,this.state.savedState.valuesTopics) &&
				_.isEqual(this.state.valuesTopicsPreferential,this.state.savedState.valuesTopicsPreferential) &&
				_.isEqual(this.state.valuesPeriods,this.state.savedState.valuesPeriods)
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
		var thisComponent = this;
		var actionData = [], modelData = {};
		_.assign(modelData, this.state.theme);
		modelData.active = this.state.valueActive;
		modelData.name = this.state.valueName;
		modelData.scope = _.findWhere(this.state.scopes, {key: this.state.valueScope[0]});
		modelData.topics = [];
		for (let key of this.state.valuesTopics) {
			let topic = _.findWhere(this.state.topics, {key: key});
			modelData.topics.push(topic);
		}
		modelData.topicsPreferential = [];
		for (let key of this.state.valuesTopicsPreferential) {
			let topic = _.findWhere(this.state.topics, {key: key});
			modelData.topicsPreferential.push(topic);
		}
		modelData.periods = [];
		if (modelData.scope) {
			for (let key of this.state.valuesPeriods) {
				let period = _.findWhere(modelData.scope.periods, {key: key});
				modelData.periods.push(period);
			}
		}

		let modelObj = new Model[ObjectTypes.THEME](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.THEME);
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
		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		var newState = {};
		newState[stateKey] = newValues;
		this.setState(newState);
	}

	onChangeScope (value, values) {
		let newValue = utils.handleNewObjects(values, ObjectTypes.SCOPE, {stateKey: "valueScope"}, this.getStateHash());

		var periods = [];
		if (value) {
			let scope = _.findWhere(this.state.scopes, {key: value});
			periods = utils.getModelsKeys(scope.periods);
		}

		this.setState({
			valueScope: newValue,
			valuesPeriods: periods
		});
	}

	onChangeTopics (value, values) {
		let newValue = utils.handleNewObjects(values, ObjectTypes.TOPIC, {stateKey: "valuesTopics"}, this.getStateHash());

		// topics changed - change preferential accordingly
		let valuesTopicsPreferential = utils.clone(this.state.valuesTopicsPreferential);
		valuesTopicsPreferential = _.filter(valuesTopicsPreferential,function(key){
			return _.contains(newValue,key);
		},this);

		this.setState({
			valuesTopics: newValue,
			valuesTopicsPreferential: valuesTopicsPreferential
		});
	}

	onObjectClick (itemType, value, event) {
		this.context.onInteraction().call();
		var screenName = this.props.screenKey + "-ScreenMetadata" + itemType;
		let options = {
			component: ScreenMetadataObject,
			parentUrl: this.props.parentUrl,
			size: 40,
			data: {
				objectType: itemType,
				objectKey: value.key
			}
		};
		ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
	}


	render() {

		var saveButton = " ";
		if (this.state.theme) {
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
		if(this.state.theme && this.state.theme.active){
			isActiveText = "active";
			isActiveClasses = "activeness-indicator active";
		}

		var selectedTopics = _.filter(this.state.topics,function(topic){
			return _.contains(this.state.valuesTopics,topic.key);
		},this);

		var periodsOptions = [];
		if(this.state.valueScope[0]) {
			var selectedScope = _.findWhere(this.state.scopes, {key: this.state.valueScope[0]});
			periodsOptions = selectedScope.periods;
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
						Scope
						<UIObjectSelect
							onChange={this.onChangeScope.bind(this)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.SCOPE)}
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
						Topics
						<UIObjectSelect
							multi
							onChange={this.onChangeTopics.bind(this)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.TOPIC)}
							options={this.state.topics}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valuesTopics}
						/>
					</label>
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Preferential topics
						<UIObjectSelect
							multi
							onChange={this.onChangeObjectSelect.bind(this, "valuesTopicsPreferential", ObjectTypes.TOPIC)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.TOPIC)}
							options={selectedTopics}
							//allowCreate //we only choose from those above, first it has to be there
							//newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valuesTopicsPreferential}
						/>
					</label>
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Periods
						<UIObjectSelect
							multi
							onChange={this.onChangeObjectSelect.bind(this, "valuesPeriods", ObjectTypes.PERIOD)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.PERIOD)}
							options={periodsOptions}
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

export default ConfigMetadataTheme;
