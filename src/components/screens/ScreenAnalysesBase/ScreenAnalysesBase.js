import React, { PropTypes, Component } from 'react';
import path from "path";
import classnames from 'classnames';

import withStyles from '../../../decorators/withStyles';
import styles from './ScreenAnalysesBase.css';

import utils from '../../../utils/utils';
import ListenerHandler from '../../../core/ListenerHandler';
import ObjectTypes, {objectTypesMetadata} from '../../../constants/ObjectTypes';
import AnalysisStore from '../../../stores/AnalysisStore';
import AnalysisModel from '../../../models/AnalysisModel';
import ActionCreator from '../../../actions/ActionCreator';

import ObjectList from '../../elements/ObjectList';
import ScreenAnalysisConfig from '../../screens/ScreenAnalysisConfig2';


var initialState = {
	spatialAnalyses: [],
	levelAnalyses: [],
	mathAnalyses: [],
	activeAnalysesType: "spatial"
};


@withStyles(styles)
class ScreenAnalysesBase extends Component{

	static propTypes = {
		disabled: PropTypes.bool,
		screenKey: PropTypes.string.isRequired
	};

	static defaultProps = {
		disabled: false
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


		this._tabs = [
			{ data: "spatialAnalyses", dataType: ObjectTypes.ANALYSIS_SPATIAL, analysisType: "spatial" },
			{ data: "levelAnalyses", dataType: ObjectTypes.ANALYSIS_LEVEL, analysisType: "level" },
			{ data: "mathAnalyses", dataType: ObjectTypes.ANALYSIS_MATH, analysisType: "math" }
		];
		for (var tab of this._tabs) {
			if(!tab.header) {
				tab.key = objectTypesMetadata[tab.dataType].url;
				tab.name = objectTypesMetadata[tab.dataType].name;
				if(objectTypesMetadata[tab.dataType].isTemplate) {
					tab.isTemplate = true;
				}
			}
		}


		// var initialActiveObjectListItems = {};
		// for (var tab in TABS) {
		// 	initialActiveObjectListItems[tab.key] = null;
		// }
	}

	store2state() {
		return {
			spatialAnalyses: AnalysisStore.getFiltered({analysisType: 'spatial'}),
			levelAnalyses: AnalysisStore.getFiltered({analysisType: 'level'}),
			mathAnalyses: AnalysisStore.getFiltered({analysisType: 'math'})
		};
	}

	_onStoreChange(keys) {
		this.context.setStateFromStores.call(this, this.store2state(), keys);
	}

	_onStoreResponse(result,responseData,stateHash) {
		//var thisComponent = this;
		if (stateHash === this.getStateHash()) {
			// console.info("_onStoreResponse()");
			// console.log("result",result);
			// console.log("responseData",responseData);
			// console.log("stateHash",stateHash);
			if (result) {
				var screenName = this.props.screenKey + "-ScreenAnalysis" + responseData.objectType;
				let options = {
					component: ScreenAnalysisConfig,
					parentUrl: this.props.parentUrl,
					size: 40,
					data: {
						objectType: responseData.objectType,
						objectKey: result[0].key
					}
				};
				ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
			}
		}
	}

	componentDidMount() {
		this.changeListener.add(AnalysisStore, ["spatialAnalyses"]);
		this.responseListener.add(AnalysisStore);
		this.changeListener.add(AnalysisStore, ["fidAnalyses"]);
		this.responseListener.add(AnalysisStore);
		this.changeListener.add(AnalysisStore, ["mathAnalyses"]);
		this.responseListener.add(AnalysisStore);

		this.context.setStateFromStores.call(this, this.store2state());
	}

	componentWillUnmount() {
		this.changeListener.clean();
		this.responseListener.clean();
	}

	componentWillUpdate(newProps, newState) {
		if(newState.activeAnalysesType!=this.state.activeAnalysesType) {
			this.updateStateHash(newState);
		}
	}

	/**
	 * Differentiate between states
	 * - when receiving response for asynchronous action, ensure state has not changed in the meantime
	 */
	updateStateHash(state) {
		if(!state){
			state = this.state;
		}
		// todo hash influenced by screen/page instance / active screen (unique every time it is active)
		this._stateHash = utils.stringHash(state.activeAnalysesType);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}

	onChangeActive(key) {
		this.setState({
			activeAnalysesType: key
		});
	}

	onObjectListItemClick(itemType, item, event) {
		this.context.onInteraction().call();
		var screenName = this.props.screenKey + "-ScreenAnalysis" + itemType;
		let options = {
			component: ScreenAnalysisConfig,
			parentUrl: this.props.parentUrl,
			size: 40,
			data: {
				objectType: itemType,
				objectKey: item.key
			}
		};

		ActionCreator.createOpenScreen(screenName, this.context.screenSetKey, options);

		//todo highlighting screen opener.
		//this.changeActiveObjectListItem(itemType,item.key);
	}
	onObjectListAddClick(itemType, analysisType, event) {
		this.context.onInteraction().call();
		let model = new AnalysisModel({analysisType: analysisType});
		let responseData = {
			objectType: itemType
		};
		ActionCreator.createObjectAndRespond(model,itemType,responseData,this.getStateHash());
		//this.changeActiveObjectListItem(itemType,null);
	}



	getUrl() {
		return path.join(this.props.parentUrl, "analyses/" + this.state.activeAnalysesType);
	}

	render() {
		var tabsInsert = [];
		var contentInsert = [];
		for(var tab of this._tabs) {
			var tabElement;
			var contentElement;
			tabElement = (
				<a
					className={this.state.activeAnalysesType==tab.key ? 'item active' : 'item'}
					onClick={this.context.onInteraction( this.onChangeActive.bind(this,tab.key) )}
					key={"analysis-tabs-"+tab.key}
				>
					{tab.name}
				</a>
			);
			contentElement = (
				<div
					className={this.state.activeAnalysesType==tab.key ? 'items active' : 'items'}
					id={"analysis-items-"+tab.key}
					key={"analysis-items-"+tab.key}
				>
					<ObjectList
						data={this.state[tab.data]}
						onItemClick={this.onObjectListItemClick.bind(this, tab.dataType, tab.analysisType)}
						onAddClick={this.onObjectListAddClick.bind(this, tab.dataType, tab.analysisType)}
						itemClasses={classnames({'template' : tab.isTemplate})}
						//selectedItemKey={this.state.activeObjectListItems[tab.dataType]}
					/>
				</div>
			);
			tabsInsert.push(tabElement);
			contentInsert.push(contentElement);
		}

		return (
			<div>
				<div className="screen-content"><div>
					<h1>Analyses</h1>

					<div className="analyses-grid">
						<div className="analyses-grid-types">
							<div className="ui smaller vertical tabular menu">
								{tabsInsert}
							</div>
						</div>
						<div className="analyses-grid-items">
							{contentInsert}
						</div>
					</div>

				</div></div>
			</div>
		);

	}
}

export default ScreenAnalysesBase;
