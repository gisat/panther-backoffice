import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import ActionCreator from '../../../actions/ActionCreator';
import logger from '../../../core/Logger';
import utils from '../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ScopeModel from '../../../models/ScopeModel';
import AttributeSetModel from '../../../models/AttributeSetModel';
import AttributeModel from '../../../models/AttributeModel';
import TopicModel from '../../../models/TopicModel';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import AttributeStore from '../../../stores/AttributeStore';
import TopicStore from '../../../stores/TopicStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import ConfigControls from '../../atoms/ConfigControls';


var initialState = {
	valueActive: false,
	valueName: "",
	valueTopic: [],
	valuesAttributes: []
};


class ConfigMetadataAttributeSet extends ControllerComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		scope: PropTypes.instanceOf(ScopeModel),
		store: PropTypes.shape({
			attributeSets: PropTypes.arrayOf(PropTypes.instanceOf(AttributeSetModel)),
			attributes: PropTypes.arrayOf(PropTypes.instanceOf(AttributeModel)),
			topics: PropTypes.arrayOf(PropTypes.instanceOf(TopicModel))
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
			let attributeSet = _.findWhere(props.store.attributeSets, {key: props.selectorValue});
			if (attributeSet) {
				nextState = {
					valueActive: attributeSet.active,
					valueName: attributeSet.name,
					valueTopic: attributeSet.topic ? [attributeSet.topic.key] : [],
					valuesAttributes: utils.getModelsKeys(attributeSet.attributes)
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
					case "valueTopic":
						screenObjectType = ObjectTypes.TOPIC;
						break;
					case "valuesAttributes":
						screenObjectType = ObjectTypes.ATTRIBUTE;
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
		this.responseListener.add(TopicStore);
		this.responseListener.add(AttributeStore);
		this.errorListener.add(AttributeSetStore);
	}

	componentDidUpdate(oldProps, oldState) {
		if (this.state.current.valueTopic && (oldState.current.valueTopic != this.state.current.valueTopic)) {
			var thisComponent = this;
			utils.getThemesForTopics(this.state.current.valueTopic).then(function(themes){
				if(thisComponent.mounted) {
					thisComponent.setUIState({
						topicThemes: themes
					});
				}
			});
		}
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
		let attributeSet = _.findWhere(this.props.store.attributeSets, {key: this.props.selectorValue});
		_.assign(modelData, attributeSet);
		modelData.active = this.state.current.valueActive;
		modelData.name = this.state.current.valueName;
		modelData.topic = _.findWhere(this.props.store.topics, {key: this.state.current.valueTopic[0]});
		modelData.attributes = [];
		for (let key of this.state.current.valuesAttributes) {
			let attribute = _.findWhere(this.props.store.attributes, {key: key});
			modelData.attributes.push(attribute);
		}
		let modelObj = new Model[ObjectTypes.ATTRIBUTE_SET](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.ATTRIBUTE_SET, operationId);
	}

	deleteObject() {
		let model = new Model[ObjectTypes.ATTRIBUTE_SET]({key: this.props.selectorValue});
		let actionData = [{type:"delete", model:model}];
		ActionCreator.handleObjects(actionData, ObjectTypes.ATTRIBUTE_SET);
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

		var topicInfoInsert = null;
		if(this.state.current.valueTopic && this.state.current.valueTopic.length) {
			let themesString = "";
			if(this.state.ui.topicThemes) {
				for (let theme of this.state.ui.topicThemes) {
					if (themesString) {
						themesString += ", ";
					}
					themesString += theme.name
				}
				topicInfoInsert = (
					<div className="frame-input-wrapper-info">
						<b>{this.state.ui.topicThemes.length == 1 ? "Theme: " : "Themes: "}</b>
						{this.state.ui.topicThemes.length ? themesString : "No themes"}
					</div>
				);
			}
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

				<div className="frame-input-wrapper required">
					<label className="container">
						Topic
						<UIObjectSelect
							onChange={this.onChangeObjectSelect.bind(this, "valueTopic", ObjectTypes.TOPIC)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.TOPIC)}
							options={this.props.store.topics}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.current.valueTopic}
						/>
					</label>
					{topicInfoInsert}
				</div>

				<div className="frame-input-wrapper required">
					<label className="container">
						Attributes
						<UIObjectSelect
							multi
							className="template"
							onChange={this.onChangeObjectSelect.bind(this, "valuesAttributes", ObjectTypes.ATTRIBUTE)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.ATTRIBUTE)}
							options={this.props.store.attributes}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.current.valuesAttributes}
						/>
					</label>
				</div>

				<ConfigControls
					disabled={this.props.disabled}
					saved={this.equalStates(this.state.current,this.state.saved)}
					saving={this.state.saving}
					onSave={this.saveForm.bind(this)}
					onDelete={this.deleteObject.bind(this)}
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

export default ConfigMetadataAttributeSet;
