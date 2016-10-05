import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import ActionCreator from '../../../actions/ActionCreator';
import logger from '../../../core/Logger';
import utils from '../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ScopeModel from '../../../models/ScopeModel';
import ThemeModel from '../../../models/ThemeModel';
import TopicModel from '../../../models/TopicModel';
import ThemeStore from '../../../stores/ThemeStore';
import TopicStore from '../../../stores/TopicStore';
import ScopeStore from '../../../stores/ScopeStore';
//import PeriodStore from '../../../stores/PeriodStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import ConfigControls from '../../atoms/ConfigControls';

var initialState = {
	valueActive: false,
	valueName: "",
	valueScope: [],
	valuesTopics: [],
	valuesTopicsPreferential: []
};


class ConfigMetadataTheme extends ControllerComponent {

	static propTypes = {
		disabled: React.PropTypes.bool,
		scope: PropTypes.instanceOf(ScopeModel),
		store: PropTypes.shape({
			themes: PropTypes.arrayOf(PropTypes.instanceOf(ThemeModel)),
			topics: PropTypes.arrayOf(PropTypes.instanceOf(TopicModel)),
			scopes: PropTypes.arrayOf(PropTypes.instanceOf(ScopeModel))
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


	buildState(props) {
		if(!props){
			props = this.props;
		}
		let nextState = {};
		if(props.selectorValue) {
			let theme = _.findWhere(props.store.themes, {key: props.selectorValue});
			if (theme) {
				nextState = {
					valueActive: theme.active,
					valueName: theme.name,
					valueScope: theme.scope ? [theme.scope.key] : [],
					valuesTopics: utils.getModelsKeys(theme.topics),
					valuesTopicsPreferential: utils.getModelsKeys(theme.topicsPreferential)
				};
			}
		}
		return nextState;
	}

	_onStoreResponse(result,responseData,stateHash) {
		var thisComponent = this;
		if (stateHash === this.getStateHash()) {
			if (responseData.hasOwnProperty("stateKey") && responseData.stateKey) {
				let stateKey = responseData.stateKey;
				let values = utils.deepClone(thisComponent.state.current[stateKey]);
				values.push(result[0].key);
				if(thisComponent.mounted) {
					thisComponent.setCurrentState({
						[stateKey]: values
					});
				}
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

	componentDidMount() {
		super.componentDidMount();
		this.responseListener.add(ScopeStore);
		this.responseListener.add(TopicStore);
		this.errorListener.add(ThemeStore);
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
		let theme = _.findWhere(this.props.store.themes, {key: this.props.selectorValue});
		_.assign(modelData, theme);
		modelData.active = this.state.current.valueActive;
		modelData.name = this.state.current.valueName;
		modelData.scope = _.findWhere(this.props.store.scopes, {key: this.state.current.valueScope[0]});
		modelData.topics = [];
		for (let key of this.state.current.valuesTopics) {
			let topic = _.findWhere(this.props.store.topics, {key: key});
			modelData.topics.push(topic);
		}
		modelData.topicsPreferential = [];
		for (let key of this.state.current.valuesTopicsPreferential) {
			let topic = _.findWhere(this.props.store.topics, {key: key});
			modelData.topicsPreferential.push(topic);
		}
		modelData.periods = modelData.scope ? modelData.scope.periods : []; //ensure periods are copied from newly added scope

		let modelObj = new Model[ObjectTypes.THEME](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.THEME, operationId);
	}

	deleteObject(key) {
		let model = new Model[ObjectTypes.THEME]({key: key});
		let actionData = [{type:"delete", model:model}];
		ActionCreator.handleObjects(actionData, ObjectTypes.THEME);
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

	onChangeObjectSelect (stateKey, objectType, value, values) {
		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		var newState = {};
		newState[stateKey] = newValues;
		this.setCurrentState(newState);
	}

	onChangeTopics (value, values) {
		let newValue = utils.handleNewObjects(values, ObjectTypes.TOPIC, {stateKey: "valuesTopics"}, this.getStateHash());

		// topics changed - change preferential accordingly
		let valuesTopicsPreferential = utils.clone(this.state.current.valuesTopicsPreferential);
		valuesTopicsPreferential = _.filter(valuesTopicsPreferential,function(key){
			return _.contains(newValue,key);
		},this);

		this.setCurrentState({
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

		let ret = null;

		if (this.state.built) {


		var selectedTopics = _.filter(this.props.store.topics,function(topic){
			return _.contains(this.state.current.valuesTopics,topic.key);
		},this);


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
						Scope
						<UIObjectSelect
							onChange={this.onChangeObjectSelect.bind(this, "valueScope", ObjectTypes.SCOPE)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.SCOPE)}
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
						Topics
						<UIObjectSelect
							multi
							onChange={this.onChangeTopics.bind(this)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.TOPIC)}
							options={this.props.store.topics}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.current.valuesTopics}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Topics connect the theme to metadata templates (layers and attributes).
					</div>
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
							value={this.state.current.valuesTopicsPreferential}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Preferential topics are displayed first and with the attribute tree expanded in Data Exploration attributes selections.
					</div>
				</div>

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

export default ConfigMetadataTheme;
