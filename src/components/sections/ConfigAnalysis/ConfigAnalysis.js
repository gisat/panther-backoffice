import React, { PropTypes, Component } from 'react';

import _ from 'underscore';
import utils from '../../../utils/utils';
import ActionCreator from '../../../actions/ActionCreator';
import ListenerHandler from '../../../core/ListenerHandler';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import { Input, Icon, IconButton, Buttons } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import { Table } from '../../SEUI/collections';
import Select from 'react-select';

import UIObjectSelect from '../../atoms/UIObjectSelect';
import UIScreenButton from '../../atoms/UIScreenButton';
import SaveButton from '../../atoms/SaveButton';

import AnalysisStore from '../../../stores/AnalysisStore';
import AnalysisModel from '../../../models/AnalysisModel';
import AnalysisRunStore from '../../../stores/AnalysisRunStore';
import TopicStore from '../../../stores/TopicStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import ConfigAnalysisRulesSpatial from '../../sections/ConfigAnalysisRulesSpatial';
import ConfigAnalysisRulesLevel from '../../sections/ConfigAnalysisRulesLevel';
import ConfigAnalysisRulesMath from '../../sections/ConfigAnalysisRulesMath';


var initialState = {
	analysis: null,
	valueName: "",
	valueTopics: [],
	topicThemes: []
};


class ConfigAnalysis extends Component {

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
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired,
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
			analysis: AnalysisStore.getById(props.selectorValue),
			topics: TopicStore.getAll()
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

			if(!keys || keys.indexOf("analysis")!=-1 || keys.indexOf("runs")!=-1) {
				store2state.analysis.then(function (analysis) {
					let runsPromise = AnalysisRunStore.getFiltered({analysis: analysis});
					runsPromise.then(function(runs){
						let newState = {
							runs: runs,
							valueName: analysis.name,
							valueTopics: utils.getModelsKeys(analysis.topics)
						};
						newState.savedState = utils.deepClone(newState);
						thisComponent.setState(newState);
					});
				});
			}
		}
	}

	_onStoreChange(keys) {
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
					case "valueTopics":
						screenObjectType = ObjectTypes.TOPIC;
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
		this.changeListener.add(AnalysisStore, ["analysis"]);
		this.changeListener.add(AnalysisRunStore, ["runs"]);
		this.changeListener.add(TopicStore, ["topics"]);
		this.responseListener.add(TopicStore);

		this.setStateFromStores();
	}

	componentWillUnmount() {
		this.changeListener.clean();
		this.responseListener.clean();
	}

	componentWillReceiveProps(newProps) {
		if(newProps.selectorValue!=this.props.selectorValue) {
			this.setStateFromStores(newProps);
			this.updateStateHash(newProps);
		}
	}

	componentDidUpdate(oldProps, oldState) {
		if (this.state.valueTopics && (oldState.valueTopics != this.state.valueTopics)) {
			var thisComponent = this;
			utils.getThemesForTopics(this.state.valueTopics).then(function(themes){
				thisComponent.setState({
					topicThemes: themes
				});
			});
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
				this.state.valueName == this.state.analysis.name &&
				_.isEqual(this.state.valueTopics,this.state.savedState.valueTopics)
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
		modelData.topics = [];
		for (let key of this.state.valueTopics) {
			let topic = _.findWhere(this.state.topics, {key: key});
			modelData.topics.push(topic);
		}

		let modelObj = new AnalysisModel(modelData);
		actionData.push({type:"update",model:modelObj});
		console.log("save analysis:", actionData);
		ActionCreator.handleObjects(actionData,objectType);
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

			var topicInfoInsert = null;
			if(this.state.valueTopics && this.state.valueTopics.length) {
				let themesString = "";
				if(this.state.topicThemes) {
					for (let theme of this.state.topicThemes) {
						if (themesString) {
							themesString += ", ";
						}
						themesString += theme.name
					}
				}
				topicInfoInsert = (
					<div className="frame-input-wrapper-info">
						<b>{this.state.topicThemes.length == 1 ? "Theme: " : "Themes: "}</b>
						{this.state.topicThemes.length ? themesString : "No themes"}
					</div>
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

					<div className="frame-input-wrapper">
						<label className="container">
							Topic
							<UIObjectSelect
								multi
								onChange={this.onChangeObjectSelect.bind(this, "valueTopics", ObjectTypes.TOPIC)}
								onOptionLabelClick={this.onObjectClick.bind(this, ObjectTypes.TOPIC)}
								options={this.state.topics}
								allowCreate
								newOptionCreator={utils.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.state.valueTopics}
							/>
						</label>
						{topicInfoInsert}
					</div>

					{saveButton}


					<div className="section-header">
						<h3>Operations</h3>
						{/*<UIScreenButton basic>
							<Icon name="configure" />
							Configure
						</UIScreenButton>*/}
					</div>

					{configComponent}


					<div className="section-header">
						<h3>Runs</h3>
						{/*<UIScreenButton basic>
							<Icon name="plus" />
							New run
						</UIScreenButton>*/}
					</div>

					<Table basic="very" className="fixed">
						<thead>
						<tr>
							<th>Place</th>
							<th>Period</th>
							<th>AU levels</th>
							<th>Date</th>
						</tr>
						</thead>
						<tbody>

						<tr>
							<td>Cebu City</td>
							<td>2000</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>

						<tr>
							<td>Cebu City</td>
							<td>2010</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>

						<tr>
							<td>Hai Phong</td>
							<td>2000</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>

						<tr>
							<td>Hai Phong</td>
							<td>2010</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>

						<tr>
							<td>Ulaanbaatar</td>
							<td>2000</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>

						<tr>
							<td>Ulaanbaatar</td>
							<td>2010</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>


						</tbody>
					</Table>

				</div>
			);

		}


		return ret;

	}
}

export default ConfigAnalysis;
