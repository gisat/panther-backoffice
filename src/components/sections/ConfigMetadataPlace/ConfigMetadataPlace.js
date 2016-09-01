import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

import utils from '../../../utils/utils';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import PlaceStore from '../../../stores/PlaceStore';
import ScopeStore from '../../../stores/ScopeStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';

let modelInstance = new Model[ObjectTypes.PLACE];
let model = modelInstance.data();

var initialState = {
	place: null,
	valueActive: false,
	valueName: "",
	valueBoundingBox: "",
	valueScope: [],
	valueDescription: ""
};


class ConfigMetadataPlace extends PantherComponent{

	static propTypes = {
		disabled: React.PropTypes.bool,
		selectorValue: React.PropTypes.any
	};

	static defaultProps = {
		disabled: false,
		selectorValue: null
	};

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}

	store2state(props) {
		return {
			place: PlaceStore.getById(props.selectorValue),
			scopes: ScopeStore.getAll()
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(props.selectorValue) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			super.setStateFromStores(store2state, keys);
			// if stores changed, overrides user input - todo fix

			if(!keys || keys.indexOf("place")!=-1) {
				store2state.place.then(function (place) {
					if(thisComponent.acceptChange) {
						thisComponent.acceptChange = false;
						let newState = {
							valueActive: place.active,
							valueName: place.name,
							valueBoundingBox: place.boundingBox,
							valueScope: place.scope ? [place.scope.key] : []
						};
						if (model.hasOwnProperty('description')) newState.valueDescription = place.description;
						newState.savedState = utils.deepClone(newState);
						if (thisComponent.mounted) {
							thisComponent.setState(newState);
						}
					}
				});
			}
		}
	}

	_onStoreChange(keys) {
		logger.trace("ConfigMetadataPlace# _onStoreChange(), Keys:", keys);
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
		this.changeListener.add(PlaceStore,["place"]);
		this.changeListener.add(ScopeStore,["scopes"]);
		this.responseListener.add(ScopeStore);

		this.setStateFromStores();
	}

	componentWillReceiveProps(newProps) {
		if(newProps.selectorValue!=this.props.selectorValue) {
			this.acceptChange = true;
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
		if(this.state.place) {
			isIt = (
					this.state.valueActive == this.state.place.active &&
					this.state.valueName == this.state.place.name &&
					this.state.valueBoundingBox == this.state.place.boundingBox &&
					_.isEqual(this.state.valueScope,this.state.savedState.valueScope)
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
		super.saveForm();
		var actionData = [], modelData = {};
		_.assign(modelData, this.state.place);
		modelData.active = this.state.valueActive;
		modelData.name = this.state.valueName;
		modelData.boundingBox = this.state.valueBoundingBox; // Use Bounding Box from CSV.
		modelData.scope = _.findWhere(this.state.scopes, {key: this.state.valueScope[0]});
		if (model.hasOwnProperty('description')) modelData.description = this.state.valueDescription;
		let modelObj = new Model[ObjectTypes.PLACE](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.PLACE);
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

	onChangeBoundingBox(e) {
		this.setState({
			valueBoundingBox: e.target.value
		});
	}

	onChangeDescription(e) {
		this.setState({
			valueDescription: e.target.value
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
		if (this.state.place) {
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
		if(this.state.place && this.state.place.active){
			isActiveText = "active";
			isActiveClasses = "activeness-indicator active";
		}

		var extraFields = [];

		if (model.hasOwnProperty('description')) {
			extraFields.push((
				<div
					className="frame-input-wrapper" //todo get required from model too?
					key="extended-fields-description"
				>
					<label className="container">
						Description
						<Input
							type="text"
							name="description"
							placeholder=" "
							value={this.state.valueDescription}
							onChange={this.onChangeDescription.bind(this)}
						/>
					</label>
				</div>
			));
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

				<div className="frame-input-wrapper required">
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

				<div className="frame-input-wrapper required">
					<label className="container">
						Scope
						<UIObjectSelect
							onChange={this.onChangeObjectSelect.bind(this, "valueScope", ObjectTypes.SCOPE)}
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

				<div className="frame-input-wrapper required">
					<label className="container">
						Bounding box
						<Input
							type="text"
							name="boundingBox"
							placeholder=" "
							value={this.state.valueBoundingBox}
							onChange={this.onChangeBoundingBox.bind(this)}
						/>
					</label>
				</div>

				{extraFields}

				{saveButton}

			</div>
		);

	}
}

export default ConfigMetadataPlace;
