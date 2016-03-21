import React, { PropTypes, Component } from 'react';

import utils from '../../../utils/utils';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import AttributeStore from '../../../stores/AttributeStore';
import TopicStore from '../../../stores/TopicStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';


var initialState = {
	attributeSet: null,
	valueActive: false,
	valueName: "",
	valueTopic: [],
	topicThemes: [],
	valuesAttributes: []
};


class ConfigMetadataAttributeSet extends Component{

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
			attributeSet: AttributeSetStore.getById(props.selectorValue),
			topics: TopicStore.getAll(),
			attributes: AttributeStore.getAll()
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

			if(!keys || keys.indexOf("attributeSet")!=-1) {
				store2state.attributeSet.then(function (attributeSet) {
					let newState = {
						valueActive: attributeSet.active,
						valueName: attributeSet.name,
						valueTopic: attributeSet.topic ? [attributeSet.topic.key] : [],
						valuesAttributes: utils.getModelsKeys(attributeSet.attributes)
					};
					newState.savedState = utils.deepClone(newState);
					thisComponent.setState(newState);
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
		AttributeSetStore.addChangeListener(this._onStoreChange.bind(this,["attributeSet"]));
		TopicStore.addChangeListener(this._onStoreChange.bind(this,["topics"]));
		TopicStore.addResponseListener(this._onStoreResponse.bind(this));
		AttributeStore.addChangeListener(this._onStoreChange.bind(this,["attributes"]));
		AttributeStore.addResponseListener(this._onStoreResponse.bind(this));
		this.setStateFromStores();
	}

	componentWillUnmount() {
		AttributeSetStore.removeChangeListener(this._onStoreChange.bind(this,["attributeSet"]));
		TopicStore.removeChangeListener(this._onStoreChange.bind(this,["topics"]));
		TopicStore.removeResponseListener(this._onStoreResponse.bind(this));
		AttributeStore.removeChangeListener(this._onStoreChange.bind(this,["attributes"]));
		AttributeStore.removeResponseListener(this._onStoreResponse.bind(this));
	}

	componentWillReceiveProps(newProps) {
		if(newProps.selectorValue!=this.props.selectorValue) {
			this.setStateFromStores(newProps);
			this.updateStateHash(newProps);
		}
	}

	componentDidUpdate(oldProps, oldState) {
		if (this.state.valueTopic && (oldState.valueTopic != this.state.valueTopic)) {
			var thisComponent = this;
			utils.getThemesForTopics(this.state.valueTopic).then(function(themes){
				thisComponent.setState({
					topicThemes: themes
				});
			});
		}
	}


	/**
	 * Check if state is the same as it was when loaded from stores
	 * @returns {boolean}
	 */
	isStateUnchanged() {
		var isIt = true;
		if(this.state.attributeSet) {
			isIt = (
					this.state.valueActive == this.state.attributeSet.active &&
					this.state.valueName == this.state.attributeSet.name &&
					_.isEqual(this.state.valueTopic,this.state.savedState.valueTopic) &&
					_.isEqual(this.state.valuesAttributes,this.state.savedState.valuesAttributes)
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
		_.assign(modelData, this.state.attributeSet);
		modelData.active = this.state.valueActive;
		modelData.name = this.state.valueName;
		modelData.topic = _.findWhere(this.state.topics, {key: this.state.valueTopic[0]});
		modelData.attributes = [];
		for (let key of this.state.valuesAttributes) {
			let attribute = _.findWhere(this.state.attributes, {key: key});
			modelData.attributes.push(attribute);
		}
		let modelObj = new Model[ObjectTypes.ATTRIBUTE_SET](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.ATTRIBUTE_SET);
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
		if (this.state.attributeSet) {
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
		if(this.state.attributeSet && this.state.attributeSet.active){
			isActiveText = "active";
			isActiveClasses = "activeness-indicator active";
		}

		var topicInfoInsert = null;
		if(this.state.valueTopic && this.state.valueTopic.length) {
			let themesString = "";
			if(this.state.topicThemes) {
				for (let theme of this.state.topicThemes) {
					if (themesString) {
						themesString += ", ";
					}
					themesString += theme.name
				}
			}
			topicInfoInsert = (
				<div className="frame-input-wrapper-info">
					<b>{this.state.topicThemes.length == 1 ? "Theme: " : "Themes: "}</b>
					{this.state.topicThemes.length ? themesString : "No themes"}
				</div>
			);
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
						Topic
						<UIObjectSelect
							onChange={this.onChangeObjectSelect.bind(this, "valueTopic", ObjectTypes.TOPIC)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.TOPIC)}
							options={this.state.topics}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valueTopic}
						/>
					</label>
					{topicInfoInsert}
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Attributes
						<UIObjectSelect
							multi
							onChange={this.onChangeObjectSelect.bind(this, "valuesAttributes", ObjectTypes.ATTRIBUTE)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.ATTRIBUTE)}
							options={this.state.attributes}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valuesAttributes}
						/>
					</label>
				</div>

				{saveButton}

			</div>
		);

	}
}

export default ConfigMetadataAttributeSet;
