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
import WorldWindow from '../../WorldWindow';

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';

var initialState = {
	place: null,
	valueActive: false,
	valueName: "",
	valueBoundingBox: "",
	valueScope: []
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
						newState.savedState = utils.deepClone(newState);
						this.onChangeBoundingBoxToMap(place.boundingBox);
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
		this.onChangeBoundingBoxToMap(e.target.value);
	}

	onChangeBoundingBoxToMap(valueBoundingBox) {
		var values = valueBoundingBox.split(",");
		if(values.length > 3) {
			var selectedPoints = [
				new WorldWind.Position(values[0].trim(), values[1].trim(), 10000),
				new WorldWind.Position(values[2].trim(), values[3].trim(), 10000)
			];
			this.updatePointsInMap(selectedPoints);
			this.wwd.goTo(new WorldWind.Location(values[0].trim(), values[1].trim()));
			this.currentSelector.enabled = false;
		} else {
			this.currentSelector._layerOfSelectedObjects.removeRenderable(this.currentSelector._visibleRepresentation);
			this.updatePointsInMap([]);
			this.currentSelector.enabled = true;
		}
	}

	updatePointsInMap(selectedPoints) {
		this.currentSelector._selectedArea = selectedPoints;
		this.currentSelector.redrawCurrentlySelectedArea();
		this.wwd.redraw();
	}

	onChangeBoundingBoxMap(selectedPoints) {
		if(selectedPoints.length > 1) {
			var valueBoundingBox = selectedPoints[0].longitude + "," + selectedPoints[0].latitude + "," + selectedPoints[1].longitude + "," + selectedPoints[1].latitude;
			this.setState({
				valueBoundingBox: valueBoundingBox
			});
		}
	}

	wwdMounted(wwd) {
		this.wwd = wwd;
		this.currentSelector = new WorldWind.SelectionController(wwd, {
			onSelectionChangeListener: this.onChangeBoundingBoxMap.bind(this),
			type: 'boundingBox'
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
					<div className="frame-input-wrapper-info">
						It is possible to set bounding box using the map below. In order to select bounding box press shift and click on top left corner of the selection and then bottom right corner. If you want to change the bounding box simply delete the value in the field. <br/>
						It is also possible to set bounding box for the place in a format of bounding box starting with upper left corner and ending with bottom right corner. Format is longitude of upper left corner, latitude of upper left corner, longitude of bottom right corner, latitude of bottom right corner. <br/>
						Example: 10,10,15,20
					</div>
				</div>

				<WorldWindow
					id="one"
					onMount={this.wwdMounted.bind(this)}
				/>

				{saveButton}

			</div>
		);

	}
}

export default ConfigMetadataPlace;
