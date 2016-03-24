import React, { PropTypes, Component } from 'react';

import utils from '../../../utils/utils';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import RasterLayerStore from '../../../stores/RasterLayerStore';
import TopicStore from '../../../stores/TopicStore';
import LayerGroupStore from '../../../stores/LayerGroupStore';
import StyleStore from '../../../stores/StyleStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import ListenerHandler from '../../../core/ListenerHandler';


var initialState = {
	style: null,
	valueActive: false,
	valueName: "",
	valueTopic: [],
	topicThemes: [],
	valueLayerGroup: [],
	valuesStyles: []
};


class ConfigMetadataLayerRaster extends Component{

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

		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
		this.responseListener = new ListenerHandler(this, this._onStoreResponse, 'addResponseListener', 'removeResponseListener');
	}

	store2state(props) {
		return {
			layer: RasterLayerStore.getById(props.selectorValue),
			topics: TopicStore.getAll(),
			layerGroups: LayerGroupStore.getAll(),
			styles: StyleStore.getAll()
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

			if(!keys || keys.indexOf("layer")!=-1) {
				store2state.layer.then(function (layer) {
					let newState = {
						valueActive: layer.active,
						valueName: layer.name,
						valueTopic: layer.topic ? [layer.topic.key] : [],
						valueLayerGroup: layer.layerGroup ? [layer.layerGroup.key] : [],
						valuesStyles: utils.getModelsKeys(layer.styles)
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
					case "valueLayerGroup":
						screenObjectType = ObjectTypes.LAYER_GROUP;
						break;
					case "valuesStyles":
						screenObjectType = ObjectTypes.STYLE;
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
		this.changeListener.add(RasterLayerStore, ["layer"]);
		this.changeListener.add(TopicStore, ["topics"]);
		this.responseListener.add(TopicStore);
		this.changeListener.add(LayerGroupStore, ["layerGroups"]);
		this.responseListener.add(LayerGroupStore);
		this.changeListener.add(StyleStore, ["styles"]);
		this.responseListener.add(StyleStore);

		this.setStateFromStores();
	}

	componentWillUnmount() {
		this.changeListener.clean();
		this.responseListener.clean();
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
		if(this.state.layer) {
			isIt = (
					this.state.valueActive == this.state.layer.active &&
					this.state.valueName == this.state.layer.name &&
					_.isEqual(this.state.valueTopic,this.state.savedState.valueTopic) &&
					_.isEqual(this.state.valueLayerGroup,this.state.savedState.valueLayerGroup) &&
					_.isEqual(this.state.valuesStyles,this.state.savedState.valuesStyles)
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
		_.assign(modelData, this.state.layer);
		modelData.active = this.state.valueActive;
		modelData.name = this.state.valueName;
		modelData.topic = _.findWhere(this.state.topics, {key: this.state.valueTopic[0]});
		modelData.layerGroup = _.findWhere(this.state.layerGroups, {key: this.state.valueLayerGroup[0]});
		modelData.styles = [];
		for (let key of this.state.valuesStyles) {
			let period = _.findWhere(this.state.styles, {key: key});
			modelData.styles.push(period);
		}
		let modelObj = new Model[ObjectTypes.RASTER_LAYER_TEMPLATE](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.RASTER_LAYER_TEMPLATE);
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
		if (this.state.layer) {
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
		if(this.state.layer && this.state.layer.active){
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
						Layer group
						<UIObjectSelect
							onChange={this.onChangeObjectSelect.bind(this, "valueLayerGroup", ObjectTypes.LAYER_GROUP)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.LAYER_GROUP)}
							options={this.state.layerGroups}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valueLayerGroup}
						/>
					</label>
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Styles
						<UIObjectSelect
							multi
							onChange={this.onChangeObjectSelect.bind(this, "valuesStyles", ObjectTypes.STYLE)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.STYLE)}
							options={this.state.styles}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valuesStyles}
						/>
					</label>
				</div>

				{saveButton}

			</div>
		);

	}
}

export default ConfigMetadataLayerRaster;
