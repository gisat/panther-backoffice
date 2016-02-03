import React, { PropTypes, Component } from 'react';
import styles from './ConfigMetadataPeriod.css';
import withStyles from '../../../decorators/withStyles';

import utils from '../../../utils/utils';

import { Input, Button } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import PeriodStore from '../../../stores/PeriodStore';


var initialState = {
	period: null,
	valueActive: false,
	valueName: ""
};


@withStyles(styles)
class ConfigMetadataPeriod extends Component{

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
		onSetScreenData: PropTypes.func.isRequired,
		openScreen: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = initialState;
	}

	store2state(props) {
		return {
			period: PeriodStore.getById(props.selectorValue)
		};
	}

	setStateFromStores(props,keys) {
		console.log("ConfigMetadataPeriod setStateFromStores() this.state",this.state);
		if(!props){
			props = this.props;
		}
		if(props.selectorValue) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			this.context.setStateFromStores.call(this, store2state, keys);
			// if stores changed, overrides user input - todo fix

			store2state.period.then(function(period) {
				console.log("period.then",period);
				thisComponent.setState({
					valueActive: period[0].active,
					valueName: period[0].name
				},
				function(){
					console.log("I set dat state, look:",thisComponent.state);
				});
			});
		}

	}

	_onStoreChange(keys) {
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		PeriodStore.addChangeListener(this._onStoreChange.bind(this,["period"]));
		this.setStateFromStores();
	}

	componentWillUnmount() {
		PeriodStore.removeChangeListener(this._onStoreChange.bind(this,["period"]));
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
		if(this.state.period[0]) {
			isIt = (
				this.state.valueActive == this.state.period[0].active &&
				this.state.valueName == this.state.period[0].name
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

		//ActionCreator.handleObjects(actionData,ObjectTypes.OBJECT_RELATION);
	}

	onChangeActive(value) {
		this.setState({
			valueActive: value
		});
	}

	onChangeName(e) {
		this.setState({
			valueName: e.target.value
		});
	}


	render() {

		var saveButton = " ";
		if (this.state.period && this.state.period[0]) {
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
		if(this.state.period && this.state.period[0]){
			if(this.state.period[0].active) {
				isActiveText = "active";
				isActiveClasses = "activeness-indicator active";
			}
		}

		return (
			<div>

				<div className="frame-input-wrapper">
					<div className="container activeness">
						<Checkbox>
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
