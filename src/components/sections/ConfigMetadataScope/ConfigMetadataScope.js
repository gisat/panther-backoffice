import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';
import ActionCreator from '../../../actions/ActionCreator';
import logger from '../../../core/Logger';
import utils from '../../../utils/utils';
import _ from 'underscore';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ScopeModel from '../../../models/ScopeModel';
import AULevelModel from '../../../models/AULevelModel';
import PeriodModel from '../../../models/PeriodModel';
import ScopeStore from '../../../stores/ScopeStore';
import AULevelStore from '../../../stores/AULevelStore';
import PeriodStore from '../../../stores/PeriodStore';
import ObjectRelationStore from '../../../stores/ObjectRelationStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import { Input, IconButton } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import ConfigControls from '../../atoms/ConfigControls';


var initialState = {
	valueActive: false,
	valueName: "",
	valuesAULevels: [],
	valuesPeriods: [] //periods are to move from theme to scope, but cannot without changes in FO
};


class ConfigMetadataScope extends ControllerComponent {

	static propTypes = {
		disabled: React.PropTypes.bool,
		scope: PropTypes.instanceOf(ScopeModel),
		store: PropTypes.shape({
			scopes: PropTypes.arrayOf(PropTypes.instanceOf(ScopeModel)),
			auLevels: PropTypes.arrayOf(PropTypes.instanceOf(AULevelModel)),
			periods: PropTypes.arrayOf(PropTypes.instanceOf(PeriodModel))
		}).isRequired,
		selectorValue: React.PropTypes.any
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
			let scope = _.findWhere(props.store.scopes, {key: props.selectorValue});
			if (scope) {
				nextState = {
					valueActive: scope.active,
					valueName: scope.name,
					valuesAULevels: utils.getModelsKeys(scope.levels),
					valuesPeriods: utils.getModelsKeys(scope.periods)
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
		super.componentDidMount();

		this.responseListener.add(AULevelStore);
		this.responseListener.add(PeriodStore);
		this.errorListener.add(ScopeStore);
	}

	/**
	 * Differentiate between states
	 * - when receiving response for asynchronous action, ensure state has not changed in the meantime
	 */
	updateStateHash() {
		// todo hash influenced by screen/page instance / active screen (unique every time it is active)
		this._stateHash = utils.stringHash(this.props.selectorValue);
	}

	saveForm(closePanelAfter) {
		let operationId = super.saveForm();

		var actionData = [], modelData = {};
		let scope = _.findWhere(this.props.store.scopes, {key: this.props.selectorValue});
		_.assign(modelData, scope);
		modelData.active = this.state.current.valueActive;
		modelData.name = this.state.current.valueName;
		modelData.levels = [];
		for (let key of this.state.current.valuesAULevels) {
			let level = _.findWhere(this.props.store.auLevels, {key: key});
			modelData.levels.push(level);
		}
		modelData.periods = [];
		for (let key of this.state.current.valuesPeriods) {
			let period = _.findWhere(this.props.store.periods, {key: key});
			modelData.periods.push(period);
		}
		let modelObj = new Model[ObjectTypes.SCOPE](modelData);
		actionData.push({type:"update",model:modelObj});
		this.handleRelations(modelObj.periods, scope.periods);
		this.handleThemePeriods(modelObj.periods);
		ActionCreator.handleObjects(actionData,ObjectTypes.SCOPE, operationId);
	}

	handleThemePeriods(newPeriods) {
		let scope = _.findWhere(this.props.store.scopes, {key: this.props.selectorValue});
		utils.getThemesForScope(scope).then(function(themes){
			if(themes == null) {
				return;
			}

			let actionData = [];

			themes.models.forEach(function(model){
				let modelData = utils.clone(model);
				modelData.periods = newPeriods;
				let modelObj = new Model[ObjectTypes.THEME](modelData);
				actionData.push({type:"update",model:modelObj});
			});

			logger.info("ConfigMetadataScope# handleThemePeriods(), Action data",actionData);
			ActionCreator.handleObjects(actionData,ObjectTypes.THEME);
		});
	}

	/**
	 * propagate changes in scope periods to relations
	 */
	handleRelations(newPeriods, oldPeriods) {
		let thisComponent = this;
		let actionData = [], promises = [];
		let scope = _.findWhere(this.props.store.scopes, {key: this.props.selectorValue});
		for (let level of scope.levels) {
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

			for (let level of scope.levels) {
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
		this.setCurrentState({
			valueActive: !this.state.current.valueActive
		});
	}

	onChangeName(e) {
		this.setCurrentState({
			valueName: e.target.value
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

	deleteObject() {
		let model = new Model[ObjectTypes.SCOPE]({key: this.props.selectorValue});
		//let scope = _.findWhere(this.props.store.scopes, {key: this.props.selectorValue});
		let actionData = [{type:"delete", model:model}];
		ActionCreator.handleObjects(actionData, ObjectTypes.SCOPE);
		ActionCreator.closeScreen(this.props.screenKey); //todo close after confirmed
	}


	render() {

		let ret = null;

		if (this.state.built) {

		let scope = _.findWhere(this.props.store.scopes, {key: this.props.selectorValue});


		var isActiveText = "inactive";
		var isActiveClasses = "activeness-indicator";
		if(scope && scope.active){
			isActiveText = "active";
			isActiveClasses = "activeness-indicator active";
		}

		ret = (
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
						Analytical units Levels
						<UIObjectSelect
							multi
							ordered
							className="template"
							onChange={this.onChangeObjectSelect.bind(this, "valuesAULevels", ObjectTypes.AU_LEVEL)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.AU_LEVEL)}
							options={this.props.store.auLevels}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.current.valuesAULevels}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Hierarchy of analytical units, common for all places in the scope. Ordered from largest areas to most detailed division.
						<br/>For areas and levels to work correctly in Exploration, all levels in all places in the scope must be linked to a data layer.
						<br/><b>After linking data layers to levels, changes in levels can break display in Exploration!</b>
					</div>
				</div>

				<div className="frame-input-wrapper required">
					<label className="container">
						Imaging/reference periods
						<UIObjectSelect
							multi
							onChange={this.onChangeObjectSelect.bind(this, "valuesPeriods", ObjectTypes.PERIOD)}
							onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.PERIOD)}
							options={this.props.store.periods}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.state.current.valuesPeriods}
						/>
					</label>
					<div className="frame-input-wrapper-info">
						Periods available for the scope.
					</div>
				</div>

				<ConfigControls
					disabled={this.props.disabled}
					saved={this.equalStates(this.state.current,this.state.saved)}
					saving={this.state.saving}
					onSave={this.saveForm.bind(this)}
					onDelete={this.deleteObject.bind(this)}
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

export default ConfigMetadataScope;
