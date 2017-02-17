import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

import _ from 'underscore';
import utils from '../../../utils/utils';
import ActionCreator from '../../../actions/ActionCreator';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import { Input, Icon, IconButton, Buttons } from '../../SEUI/elements';
import { Table } from '../../SEUI/collections';

import UIScreenButton from '../../atoms/UIScreenButton';
import SaveButton from '../../atoms/SaveButton';

import AnalysisStore from '../../../stores/AnalysisStore';
import AnalysisModel from '../../../models/AnalysisModel';
import AnalysisRunStore from '../../../stores/AnalysisRunStore';

import ConfigAnalysisRulesSpatial from '../../sections/ConfigAnalysisRulesSpatial';
import ConfigAnalysisRulesLevel from '../../sections/ConfigAnalysisRulesLevel';
import ConfigAnalysisRulesMath from '../../sections/ConfigAnalysisRulesMath';
import ScreenAnalysisRulesSpatial from '../../screens/ScreenAnalysisRulesSpatial';
import ScreenAnalysisRulesLevel from '../../screens/ScreenAnalysisRulesLevel';
import ScreenAnalysisRulesMath from '../../screens/ScreenAnalysisRulesMath';
import ScreenAnalysisRuns from '../../screens/ScreenAnalysisRuns';

import logger from '../../../core/Logger';

var initialState = {
	analysis: null,
	valueName: ""
};


class ConfigAnalysis extends PantherComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		screenKey: PropTypes.string,
		selectorValue: PropTypes.any
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
			analysis: AnalysisStore.getById(props.selectorValue)
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

			if(!keys || keys.indexOf("analysis")!=-1 || keys.indexOf("runs")!=-1) {
				store2state.analysis.then(function (analysis) {
					let runsPromise = AnalysisRunStore.getFiltered({analysis: analysis});
					runsPromise.then(function(runs){
						let newState = {
							runs: runs,
							valueName: analysis.name
						};
						newState.savedState = utils.deepClone(newState);
						if(thisComponent.mounted) {
							thisComponent.setState(newState);
						}
					});
				});
			}
		}
	}

	_onStoreChange(keys) {
		logger.trace("ConfigAnalysis# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		super.componentDidMount();

		this.changeListener.add(AnalysisStore, ["analysis"]);
		this.changeListener.add(AnalysisRunStore, ["runs"]);

		this.setStateFromStores();
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
		if(this.state.analysis) {
			isIt = (
				this.state.valueName == this.state.analysis.name
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
		var thisComponent = this;
		let objectType = null;
		switch(this.state.analysis.analysisType) {
			case "spatial":
				objectType = ObjectTypes.ANALYSIS_SPATIAL;
				break;
			case "level":
				objectType = ObjectTypes.ANALYSIS_LEVEL;
				break;
			case "math":
				objectType = ObjectTypes.ANALYSIS_MATH;
				break;
		}
		var actionData = [], modelData = {};
		//_.assign(modelData, this.state.analysis);
		modelData.key = this.state.analysis.key;
		modelData.name = this.state.valueName;

		let modelObj = new AnalysisModel(modelData);
		actionData.push({type:"update",model:modelObj});
		logger.info("ConfigAnalysis# saveForm(), Save analysis:", actionData);
		ActionCreator.handleObjects(actionData,objectType);
	}


	onChangeName(e) {
		this.setState({
			valueName: e.target.value
		});
	}

	onOpenConfigClick () {
		let component = null, name = "", size = 80;
		switch (this.state.analysis.analysisType) {
			case "spatial":
				component = ScreenAnalysisRulesSpatial;
				name = "ScreenAnalysisRulesSpatial";
				break;
			case "level":
				component = ScreenAnalysisRulesLevel;
				name = "ScreenAnalysisRulesLevel";
				size = 60;
				break;
			case "math":
				component = ScreenAnalysisRulesMath;
				name = "ScreenAnalysisRulesMath";
				break;
		}
		this.context.onInteraction().call();
		var screenName = this.props.screenKey + "-" + name;
		let options = {
			component: component,
			parentUrl: this.props.parentUrl,
			size: size,
			data: {
				analysis: this.state.analysis
			}
		};
		ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
	}

	onOpenRunAddClick () {
		this.context.onInteraction().call();
		var screenName = this.props.screenKey + "-ScreenAnalysisRuns";
		let options = {
			component: ScreenAnalysisRuns,
			parentUrl: this.props.parentUrl,
			size: 40,
			data: {
				analysis: this.state.analysis
			}
		};
		ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
	}


	render() {


		let ret = null;


		if (this.state.analysis && this.state.runs) {

			var saveButton = " ";
			if (this.state.analysis) {
				saveButton = (
					<SaveButton
						saved={this.isStateUnchanged()}
						className="save-button"
						onClick={this.saveForm.bind(this)}
					/>
				);
			}

			var configComponent = "";
			var props = {
				disabled: this.props.disabled,
				analysis: this.state.analysis
			};
			switch (this.state.analysis.analysisType) {
				case "spatial":
					configComponent = <ConfigAnalysisRulesSpatial {...props} />;
					break;
				case "level":
					configComponent = <ConfigAnalysisRulesLevel {...props} />;
					break;
				case "math":
					configComponent = <ConfigAnalysisRulesMath {...props} />;
					break;
			}

			var runsTable = null;
			if (this.state.runs.length) {
				var runsTableRows = [];
				_.each(this.state.runs, function (analysisRunModel) {

					// create AU Levels string
					var auLevels = [];
					_.each(analysisRunModel.levels, function (auLevelModel) {
						auLevels.push(auLevelModel.name);
					}, this);

					// create Finished string
					var finished = "";
					var finishedTooltip = analysisRunModel.status;

					if (typeof analysisRunModel.finished == "undefined") {
						finished = "running&hellip;";
					} else {
						if (typeof analysisRunModel.status != "undefined" && analysisRunModel.status.substr(0, 8) == "Failed. ") {
							finished = "failed";
						} else {
							if (analysisRunModel.finished instanceof Date) {
								finished = analysisRunModel.finished.getFullYear() + "-" + (analysisRunModel.finished.getMonth()+1) + "-" + analysisRunModel.finished.getDate();
							} else {
								finished = analysisRunModel.finished;
							}
						}
					}

					var row = (
						<tr>
							<td>{analysisRunModel.place.name}</td>
							<td>{analysisRunModel.period.name}</td>
							<td>{auLevels.join(", ")}</td>
							<td title={finishedTooltip}>{finished}</td>
						</tr>
					);
					runsTableRows.push(row);
				}, this);

				runsTable = (
					<Table basic="very" className="fixed">
						<thead>
						<tr>
							<th>Place</th>
							<th>Period</th>
							<th>AU levels</th>
							<th>Finished</th>
						</tr>
						</thead>
						<tbody>
						{runsTableRows}
						</tbody>
					</Table>
				);
			} else {
				runsTable = (
					<div className="prod">
						No runs
					</div>
				);
			}

			let operationsHeader = null;
			if (!this.state.runs.length) {
				operationsHeader = (
					<UIScreenButton
						disabled={this.props.disabled}
						basic
						onClick={this.onOpenConfigClick.bind(this)}
					>
						<Icon name="configure" />
						Configure
					</UIScreenButton>
				);
			} else {
				operationsHeader = (
					<span className="note">
						Configuration locked after run
					</span>
				);
			}


			ret = (
				<div>

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


					<div className="section-header">
						<h3>Operations</h3>
						{operationsHeader}
					</div>

					{configComponent}


					<div className="section-header">
						<h3>Runs</h3>
						<UIScreenButton
							basic
							onClick={this.onOpenRunAddClick.bind(this)}
						>
							<Icon name="plus" />
							Add runs
						</UIScreenButton>
					</div>

					{runsTable}

				</div>
			);

		}


		return ret;

	}
}

export default ConfigAnalysis;
