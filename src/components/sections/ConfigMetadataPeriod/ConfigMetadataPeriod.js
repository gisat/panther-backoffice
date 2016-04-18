import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

import utils from '../../../utils/utils';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import PeriodStore from '../../../stores/PeriodStore';

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';

var initialState = {
	period: null,
	valueActive: false,
	valueName: ""
};


class ConfigMetadataPeriod extends PantherComponent{

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
		onInteraction: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
	}

	store2state(props) {
		return {
			period: PeriodStore.getById(props.selectorValue)
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

			store2state.period.then(function(period) {
				if(thisComponent.acceptChange) {
					thisComponent.acceptChange = false;
					if (thisComponent.mounted) {
						thisComponent.setState({
							valueActive: period.active,
							valueName: period.name
						});
					}
				}
			});
		}

	}

	_onStoreChange(keys) {
		logger.trace("ConfigMetadataPeriod# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() { this.mounted = true;
		this.changeListener.add(PeriodStore, ["period"]);

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
		if(this.state.period) {
			isIt = (
				this.state.valueActive == this.state.period.active &&
				this.state.valueName == this.state.period.name
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
		_.assign(modelData, this.state.period);
		modelData.active = this.state.valueActive;
		modelData.name = this.state.valueName;
		let modelObj = new Model[ObjectTypes.PERIOD](modelData);
		actionData.push({type:"update",model:modelObj});
		ActionCreator.handleObjects(actionData,ObjectTypes.PERIOD);
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
		if (this.state.period) {
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
		if(this.state.period && this.state.period.active){
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

export default ConfigMetadataPeriod;
