import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import ActionCreator from '../../../actions/ActionCreator';
import logger from '../../../core/Logger';
import utils from '../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ScopeModel from '../../../models/ScopeModel';
import VectorLayerModel from '../../../models/VectorLayerModel';
import TopicModel from '../../../models/TopicModel';
import LayerGroupModel from '../../../models/LayerGroupModel';
import StyleModel from '../../../models/StyleModel';
import AttributeSetModel from '../../../models/AttributeSetModel';
import VectorLayerStore from '../../../stores/VectorLayerStore';
import TopicStore from '../../../stores/TopicStore';
import LayerGroupStore from '../../../stores/LayerGroupStore';
import StyleStore from '../../../stores/StyleStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import ConfigControls from '../../atoms/ConfigControls';

var initialState = {
	valueActive: false,
	valueName: "",
	valueTopic: [],
	valueLayerGroup: [],
	valuesStyles: [],
	valuesAttSets: []
};


class ConfigMetadataLayerVector extends ControllerComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		scope: PropTypes.instanceOf(ScopeModel),
		store: PropTypes.shape({
			layers: PropTypes.arrayOf(PropTypes.instanceOf(VectorLayerModel)),
			topics: PropTypes.arrayOf(PropTypes.instanceOf(TopicModel)),
			layerGroups: PropTypes.arrayOf(PropTypes.instanceOf(LayerGroupModel)),
			styles: PropTypes.arrayOf(PropTypes.instanceOf(StyleModel)),
			attributeSets: PropTypes.arrayOf(PropTypes.instanceOf(AttributeSetModel)),
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
		if(!props){
			props = this.props;
		}
		let nextState = {};
		if(props.selectorValue) {
			let layer = _.findWhere(props.store.layers, {key: props.selectorValue});
			if (layer) {

				var attSets = [];

				for (let attSet of props.store.attributeSets) {
					if (attSet.hasOwnProperty("vectorLayers")) {
						for (let attSetLayer of attSet.vectorLayers) {
							if (layer == attSetLayer) {
								attSets.push(attSet);
							}
						}
					}
				}

				nextState = {
					valueActive: layer.active,
					valueName: layer.name,
					valueTopic: layer.topic ? [layer.topic.key] : [],
					valueLayerGroup: layer.layerGroup ? [layer.layerGroup.key] : [],
					valuesStyles: utils.getModelsKeys(layer.styles),
					valuesAttSets: utils.getModelsKeys(attSets)
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
					case "valueLayerGroup":
						screenObjectType = ObjectTypes.LAYER_GROUP;
						break;
					case "valuesStyles":
						screenObjectType = ObjectTypes.STYLE;
						break;
					case "valuesAttSets":
						screenObjectType = ObjectTypes.ATTRIBUTE_SET;
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
		this.responseListener.add(LayerGroupStore);
		this.responseListener.add(StyleStore);
		this.responseListener.add(AttributeSetStore);
		this.errorListener.add(VectorLayerStore);
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

		var thisComponent = this;
		var actionData = [], modelData = {};
		let layer = _.findWhere(this.props.store.layers, {key: this.props.selectorValue});
		_.assign(modelData, layer);
		modelData.active = this.state.current.valueActive;
		modelData.name = this.state.current.valueName;
		modelData.topic = _.findWhere(this.props.store.topics, {key: this.state.current.valueTopic[0]});
		modelData.layerGroup = _.findWhere(this.props.store.layerGroups, {key: this.state.current.valueLayerGroup[0]});
		modelData.styles = [];
		for (let key of this.state.current.valuesStyles) {
			let period = _.findWhere(this.props.store.styles, {key: key});
			modelData.styles.push(period);
		}
		modelData.attributeSets = [];

		// for now, vectorLayer-attributeSet relations are stored in attribute sets
		var attSetActionData = [], oldAttSets = [];
		_.assign(oldAttSets,this.state.saved.valuesAttSets);
		for (let key of this.state.current.valuesAttSets) {
			let attSet = _.findWhere(this.props.store.attributeSets, {key: key});
			modelData.attributeSets.push(attSet); // saving in vector layer, for possible future use
			let attSetModelData = {};
			_.assign(attSetModelData, attSet);
			attSetModelData.vectorLayers = _.union(attSetModelData.vectorLayers, [layer]);
			let attSetModelObj = new Model[ObjectTypes.ATTRIBUTE_SET](attSetModelData);
			attSetActionData.push({type:"update",model:attSetModelObj});
			oldAttSets = _.reject(oldAttSets, function(item) {
				return item === key;
			});
		}
		for (let key of oldAttSets) {
			let attSet = _.findWhere(this.props.store.attributeSets, {key: key});
			let attSetModelData = {};
			_.assign(attSetModelData, attSet);
			attSetModelData.vectorLayers = _.reject(attSetModelData.vectorLayers, function(item){
				return item.key === layer.key;
			});
			let attSetModelObj = new Model[ObjectTypes.ATTRIBUTE_SET](attSetModelData);
			attSetActionData.push({type:"update",model:attSetModelObj});
		}
		ActionCreator.handleObjects(attSetActionData,ObjectTypes.ATTRIBUTE_SET);

		let modelObj = new Model[ObjectTypes.VECTOR_LAYER_TEMPLATE](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.VECTOR_LAYER_TEMPLATE, operationId);
	}

	deleteObject(key) {
		let model = new Model[ObjectTypes.VECTOR_LAYER_TEMPLATE]({key: key});
		let actionData = [{type:"delete", model:model}];
		ActionCreator.handleObjects(actionData, ObjectTypes.VECTOR_LAYER_TEMPLATE);
		ActionCreator.closeScreen(this.props.screenKey); //todo close after confirmed
	}


	onChangeActive() {
		if(this.mounted) {
			this.setCurrentState({
				valueActive: !this.state.current.valueActive
			});
		}
	}

	onChangeName(e) {
		if(this.mounted) {
			this.setCurrentState({
				valueName: e.target.value
			});
		}
	}

	onChangeObjectSelect (stateKey, objectType, value, values) {
		let newValues = utils.handleNewObjects(values, objectType, {stateKey: stateKey}, this.getStateHash());
		var newState = {};
		newState[stateKey] = newValues;
		if(this.mounted) {
			this.setCurrentState(newState);
		}
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

		var optionsAttSets = _.filter(this.props.store.attributeSets, function(attributeSet){
			if (attributeSet.topic) {
				return _.contains(this.state.current.valueTopic, attributeSet.topic.key)
			} else {
				return false;
			}
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
						Layer group
						<UIObjectSelect
							onChange={this.onChangeObjectSelect.bind(this, "valueLayerGroup", ObjectTypes.LAYER_GROUP)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.LAYER_GROUP)}
							options={this.props.store.layerGroups}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.current.valueLayerGroup}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Category in Data Exploration layer selection.
					</div>
				</div>

				<div className="frame-input-wrapper required">
					<label className="container">
						Styles
						<UIObjectSelect
							multi
							onChange={this.onChangeObjectSelect.bind(this, "valuesStyles", ObjectTypes.STYLE)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.STYLE)}
							options={this.props.store.styles}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.current.valuesStyles}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Display symbologies. For each assigned style, a variant of the layer is available in Data Exploration.
					</div>
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Attribute sets
						<UIObjectSelect
							multi
							className="template"
							onChange={this.onChangeObjectSelect.bind(this, "valuesAttSets", ObjectTypes.ATTRIBUTE_SET)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.ATTRIBUTE_SET)}
							options={optionsAttSets}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.current.valuesAttSets}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Attribute sets for attributes usually contained in the data layers using the template.<br/>Only attribute sets with the same topic as the template can be selected.
					</div>
				</div>

				<ConfigControls
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

export default ConfigMetadataLayerVector;
