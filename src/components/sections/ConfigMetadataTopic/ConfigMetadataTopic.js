import React, { PropTypes, Component } from 'react';

import utils from '../../../utils/utils';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import TopicStore from '../../../stores/TopicStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';
import logger from '../../../core/Logger';

var initialState = {
	topic: null,
	valueActive: false,
	valueName: ""
};


class ConfigMetadataTopic extends Component{

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
			topic: TopicStore.getById(props.selectorValue)
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

			if(!keys || keys.indexOf("topic")!=-1) {
				store2state.topic.then(function (topic) {
					let newState = {
						valueActive: topic.active,
						valueName: topic.name
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
		logger.trace("ConfigMetadataTopic# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() { this.mounted = true;
		TopicStore.addChangeListener(this._onStoreChange.bind(this,["topic"]));
		this.setStateFromStores();
	}

	componentWillUnmount() { this.mounted = false;
		TopicStore.removeChangeListener(this._onStoreChange.bind(this,["topic"]));
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
		if(this.state.topic) {
			isIt = (
					this.state.valueActive == this.state.topic.active &&
					this.state.valueName == this.state.topic.name
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
		_.assign(modelData, this.state.topic);
		modelData.active = this.state.valueActive;
		modelData.name = this.state.valueName;
		let modelObj = new Model[ObjectTypes.TOPIC](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.TOPIC);
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


	render() {

		var saveButton = " ";
		if (this.state.topic) {
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
		if(this.state.topic && this.state.topic.active){
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

				{saveButton}

			</div>
		);

	}
}

export default ConfigMetadataTopic;
