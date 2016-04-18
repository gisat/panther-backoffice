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
import LayerGroupStore from '../../../stores/LayerGroupStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import logger from '../../../core/Logger';
import ListenerHandler from '../../../core/ListenerHandler';

var initialState = {
	layerGroup: null,
	valueActive: false,
	valueName: "",
	valueOrder: null
};


class ConfigMetadataLayerGroup extends PantherComponent{

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
	}

	store2state(props) {
		return {
			layerGroup: LayerGroupStore.getById(props.selectorValue)
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

			if(!keys || keys.indexOf("layerGroup")!=-1) {
				store2state.layerGroup.then(function (layerGroup) {
					if(thisComponent.acceptChange) {
						thisComponent.acceptChange = false;
						let newState = {
							valueActive: layerGroup.active,
							valueName: layerGroup.name,
							valueOrder: layerGroup.order
						};
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
		logger.trace("ConfigMetadataLayerGroup# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() { this.mounted = true;
		this.changeListener.add(LayerGroupStore, ["layerGroup"]);
		this.setStateFromStores();
	}

	componentWillUnmount() { this.mounted = false;
		this.changeListener.clean();
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
		if(this.state.layerGroup) {
			isIt = (
					this.state.valueActive == this.state.layerGroup.active &&
					this.state.valueName == this.state.layerGroup.name &&
					this.state.valueOrder == this.state.layerGroup.order
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
		_.assign(modelData, this.state.layerGroup);
		modelData.active = this.state.valueActive;
		modelData.name = this.state.valueName;
		modelData.order = this.state.valueOrder;
		let modelObj = new Model[ObjectTypes.LAYER_GROUP](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.LAYER_GROUP);
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

	onChangeOrder(e) {
		this.setState({
			valueOrder: e.target.value
		});
	}


	render() {

		var saveButton = " ";
		if (this.state.layerGroup) {
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
		if(this.state.layerGroup && this.state.layerGroup.active){
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
						Order
						<Input
							type="text"
							name="serverName"
							placeholder=" "
							value={this.state.valueOrder}
							onChange={this.onChangeOrder.bind(this)}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Display order - layer groups are listed ordered from lowest to highest number
					</div>
				</div>

				{saveButton}

			</div>
		);

	}
}

export default ConfigMetadataLayerGroup;
