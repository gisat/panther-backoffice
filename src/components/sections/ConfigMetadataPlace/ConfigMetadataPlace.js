import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import ActionCreator from '../../../actions/ActionCreator';
import logger from '../../../core/Logger';
import utils from '../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ScopeModel from '../../../models/ScopeModel';
import PlaceModel from '../../../models/PlaceModel';
import PlaceStore from '../../../stores/PlaceStore';
import ScopeStore from '../../../stores/ScopeStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import ConfigControls from '../../atoms/ConfigControls';
import WorldWindow from '../../WorldWindow';

let modelInstance = new Model[ObjectTypes.PLACE];
let model = modelInstance.data();

var initialState = {
	valueActive: false,
	valueName: "",
	valueBoundingBox: "",
	valueScope: []
};
if (model.hasOwnProperty('description')) {
	initialState.valueDescription = "";
}


class ConfigMetadataPlace extends ControllerComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		scope: PropTypes.instanceOf(ScopeModel),
		store: PropTypes.shape({
			places: PropTypes.arrayOf(PropTypes.instanceOf(PlaceModel)),
			scopes: PropTypes.arrayOf(PropTypes.instanceOf(ScopeModel))
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
			let place = _.findWhere(props.store.places, {key: props.selectorValue});
			if (place) {
				nextState = {
					valueActive: place.active,
					valueName: place.name,
					valueBoundingBox: place.boundingBox,
					valueScope: place.scope ? [place.scope.key] : []
				};
				if (model.hasOwnProperty('description')) {
					nextState.valueDescription = place.description;
				}
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
		this.errorListener.add(PlaceStore);
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
		let place = _.findWhere(this.props.store.places, {key: this.props.selectorValue});
		_.assign(modelData, place);
		modelData.active = this.state.current.valueActive;
		modelData.name = this.state.current.valueName;
		modelData.boundingBox = this.state.current.valueBoundingBox; // Use Bounding Box from CSV.
		modelData.scope = _.findWhere(this.props.store.scopes, {key: this.state.current.valueScope[0]});
		if (model.hasOwnProperty('description')) {
			modelData.description = this.state.current.valueDescription;
		}
		let modelObj = new Model[ObjectTypes.PLACE](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.PLACE, operationId);
	}

	deleteObject(key) {
		let model = new Model[ObjectTypes.PLACE]({key: key});
		let actionData = [{type:"delete", model:model}];
		ActionCreator.handleObjects(actionData, ObjectTypes.PLACE);
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

	onChangeBoundingBox(e) {
		this.setCurrentState({
			valueBoundingBox: e.target.value
		});
		this.onChangeBoundingBoxToMap(e.target.value);
	}

	onChangeBoundingBoxToMap(valueBoundingBox) {
		if(_.isUndefined(valueBoundingBox) || !this.currentSelector) {
			return;
		}

		var values = valueBoundingBox.split(",");
		if(values.length > 3) {
			var selectedPoints = [
				new WorldWind.Position(values[1].trim(), values[0].trim(), 10000),
				new WorldWind.Position(values[3].trim(), values[2].trim(), 10000)
			];
			this.updatePointsInMap(selectedPoints);
			this.wwd.goTo(new WorldWind.Location(values[1].trim(), values[0].trim()));
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
			this.setCurrentState({
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
		if(this.state.current && this.state.current.valueBoundingBox) {
			this.onChangeBoundingBoxToMap(this.state.current.valueBoundingBox);
		}
	}

	onChangeDescription(e) {
		this.setCurrentState({
			valueDescription: e.target.value
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

		let place = _.findWhere(this.props.store.places, {key: this.props.selectorValue});


		var isActiveText = "inactive";
		var isActiveClasses = "activeness-indicator";
		if(place && place.active){
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
							value={this.state.current.valueDescription}
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
							checked={this.state.current.valueActive}
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
						Bounding box
						<Input
							type="text"
							name="boundingBox"
							placeholder=" "
							value={this.state.current.valueBoundingBox}
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

				{extraFields}

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

export default ConfigMetadataPlace;
