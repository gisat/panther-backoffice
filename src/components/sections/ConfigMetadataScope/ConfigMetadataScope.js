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
import ScopeStore from '../../../stores/ScopeStore';
import AULevelStore from '../../../stores/AULevelStore';
import PeriodStore from '../../../stores/PeriodStore';
import ObjectRelationStore from '../../../stores/ObjectRelationStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import ListenerHandler from '../../../core/ListenerHandler';

import logger from '../../../core/Logger';

var initialState = {
	scope: null,
	valueActive: false,
	valueName: "",
	valuesAULevels: [],
	valuesPeriods: [] //periods are to move from theme to scope, but cannot without changes in FO
};


class ConfigMetadataScope extends PantherComponent{

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
			scope: ScopeStore.getById(props.selectorValue),
			auLevels: AULevelStore.getAll(),
			periods: PeriodStore.getAll()
		};
	}

	setStateFromStores(props,keys) {
		super.setStateFromStores(props,keys);

		if(!props){
			props = this.props;
		}
		if(props.selectorValue) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			this.context.setStateFromStores.call(this, store2state, keys);

			if(!keys || keys.indexOf("scope")!=-1) {
				store2state.scope.then(function (scope) {
					if(thisComponent.acceptChange) {
						thisComponent.acceptChange = false;
						let newState = {
							valueActive: scope.active,
							valueName: scope.name,
							valuesAULevels: utils.getModelsKeys(scope.levels),
							valuesPeriods: utils.getModelsKeys(scope.periods)
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
		logger.trace("ConfigMetadataScope# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	_onStoreResponse(result,responseData,stateHash) {
		var thisComponent = this;
		if (stateHash === this.getStateHash()) {
			if (responseData.hasOwnProperty("stateKey") && responseData.stateKey) {
				let stateKey = responseData.stateKey;
				let values = utils.deepClone(thisComponent.state[stateKey]);
				values.push(result[0].key);
				if(thisComponent.mounted) {
					thisComponent.setState({
						[stateKey]: values
					});
				}
				var screenObjectType;
				switch(stateKey){
					case "valuesAULevels":
						screenObjectType = ObjectTypes.AU_LEVEL;
						break;
					case "valuesPeriods":
						screenObjectType = ObjectTypes.PERIOD;
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
		this.mounted = true;
		this.changeListener.add(ScopeStore, ["scope"]);
		this.changeListener.add(AULevelStore, ["auLevels"]);
		this.responseListener.add(AULevelStore);
		this.changeListener.add(PeriodStore, ["periods"]);
		this.responseListener.add(PeriodStore);

		this.setStateFromStores();
	}

	componentWillUnmount() {
		this.mounted = false;
		this.changeListener.clean();
		this.responseListener.clean();
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
		if(this.state.scope) {
			isIt = (
					this.state.valueActive == this.state.scope.active &&
					this.state.valueName == this.state.scope.name &&
					_.isEqual(this.state.valuesAULevels,this.state.savedState.valuesAULevels) &&
					_.isEqual(this.state.valuesPeriods,this.state.savedState.valuesPeriods)
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
		_.assign(modelData, this.state.scope);
		modelData.active = this.state.valueActive;
		modelData.name = this.state.valueName;
		modelData.levels = [];
		for (let key of this.state.valuesAULevels) {
			let level = _.findWhere(this.state.auLevels, {key: key});
			modelData.levels.push(level);
		}
		modelData.periods = [];
		for (let key of this.state.valuesPeriods) {
			let period = _.findWhere(this.state.periods, {key: key});
			modelData.periods.push(period);
		}
		let modelObj = new Model[ObjectTypes.SCOPE](modelData);
		actionData.push({type:"update",model:modelObj});
		this.handleRelations(modelObj.periods, this.state.scope.periods);
		ActionCreator.handleObjects(actionData,ObjectTypes.SCOPE);
	}

	/**
	 * propagate changes in scope periods to relations
	 */
	handleRelations(newPeriods, oldPeriods) {
		let thisComponent = this;
		let actionData = [], promises = [];
		for (let level of this.state.scope.levels) {
			let levelRelationsPromise = ObjectRelationStore.getFiltered({layerObject: level});
			promises.push(levelRelationsPromise);
		}
		Promise.all(promises).then(function(relations){
			relations = _.flatten(relations,true);

			let places = [];
			for (let relation of relations) {
				places.push(relation.place);
			}
			places = _.uniq(places);

			for (let level of thisComponent.state.scope.levels) {
				for (let place of places) {
					let firstLevelPlaceRelation = _.findWhere(relations,{layerObject:level, place:place});
					if (firstLevelPlaceRelation) {
						let relationData = utils.clone(firstLevelPlaceRelation);
						delete relationData.key;
						delete relationData.period;
						for (let period of newPeriods) {
							let relation = _.findWhere(relations, {layerObject: level, place: place, period: period});
							if(!relation) {
								let modelData = utils.clone(relationData);
								modelData.period = period;
								let modelObj = new Model[ObjectTypes.OBJECT_RELATION](modelData);
								actionData.push({type:"create",model:modelObj});
							}
						}
					}
				}
			}

			logger.info("ConfigMetadataScope# handleRelations(), Action data",actionData); // todo clear relations for removed periods
			ActionCreator.handleObjects(actionData,ObjectTypes.OBJECT_RELATION);

		});
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
		if (this.state.scope) {
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
		if(this.state.scope && this.state.scope.active){
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
						Analytical units Levels
						<UIObjectSelect
							multi
							ordered
							onChange={this.onChangeObjectSelect.bind(this, "valuesAULevels", ObjectTypes.AU_LEVEL)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.AU_LEVEL)}
							options={this.state.auLevels}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valuesAULevels}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Hierarchy of analytical units, common for all places in the scope. Ordered from largest areas to most detailed division.
					</div>
				</div>

				<div className="frame-input-wrapper required">
					<label className="container">
						Imaging/reference periods
						<UIObjectSelect
							multi
							onChange={this.onChangeObjectSelect.bind(this, "valuesPeriods", ObjectTypes.PERIOD)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.PERIOD)}
							options={this.state.periods}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.valuesPeriods}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Periods available for the scope. Can be narrowed down per theme.
					</div>
				</div>

				{saveButton}

			</div>
		);

	}
}

export default ConfigMetadataScope;
