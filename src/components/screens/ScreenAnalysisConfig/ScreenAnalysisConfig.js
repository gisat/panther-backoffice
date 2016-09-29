import React, { PropTypes, Component } from 'react';
//import styles from './ScreenAnalysisConfig.css';
//import withStyles from '../../../decorators/withStyles';
import path from "path";

import _ from 'underscore';
import utils from '../../../utils/utils';
import ActionCreator from '../../../actions/ActionCreator';
import ListenerHandler from '../../../core/ListenerHandler';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import SelectorAnalysis from '../../sections/SelectorAnalysis';
import ConfigAnalysis from '../../sections/ConfigAnalysis';

import AnalysisStore from '../../../stores/AnalysisStore';
import AnalysisModel from '../../../models/AnalysisModel';

import logger from '../../../core/Logger';
import PantherComponent from "../../common/PantherComponent";

var initialState = {
	analyses: [],
	selectorValue: null
};


//@withStyles(styles)
class ScreenAnalysisConfig extends PantherComponent{

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		if(this.props.data && this.props.data.objectType) {
			this.state.objectType = this.props.data.objectType;
		}
		if(this.props.data && this.props.data.objectKey) {
			this.state.selectorValue = this.props.data.objectKey;
		}
		if(this.props.data && this.props.data.analysisType) {
			this.state.analysisType = this.props.data.analysisType;
		}
	}

	store2state(props) {
		if (!props) {
			props = this.props;
		}
		return {
			selectorData: AnalysisStore.getFiltered({analysisType: this.state.analysisType})
		};
	}

	_onStoreChange() {
		logger.trace("ScreenAnalysisConfig# _onStoreChange()");
		super.setStateFromStores(this.store2state());
	}

	_onStoreResponse(result,responseData,stateHash) {
		if (stateHash === this.getStateHash()) {
			if (result) {
				this.setState({
					selectorValue: result[0].key
				});
			}
		}
	}

	componentDidMount() {
		super.componentDidMount();
		this.changeListener.add(AnalysisStore);
		this.responseListener.add(AnalysisStore);
		super.setStateFromStores(this.store2state());
	}

	componentWillReceiveProps(newProps) {
		if(this.props.data.objectKey != newProps.data.objectKey) {
			this.setState({
				selectorValue: newProps.data.objectKey
			});
		}
		if(this.props.data.objectType != newProps.data.objectType) {
			this.setState({
				objectType: newProps.data.objectType
			});
			super.setStateFromStores(this.store2state(newProps));
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
		this._stateHash = utils.stringHash("ScreenAnalysisConfig"+state.selectorValue);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}


	onSelectorChange (value) {
		this.setState({
			selectorValue: value
		});
	}

	onNewEmptyObject () {
		let objectType = this.props.data.objectType;
		let model = new AnalysisModel({active:false});
		logger.trace("ScreenAnalysisConfig# onNewEmptyObject(), Model", model);
		ActionCreator.createObjectAndRespond(model, objectType, {}, this.getStateHash());
	}


	render() {

		let ret = null;

		if (this.state.objectType && this.state.selectorData) {

			let title = objectTypesMetadata[this.state.objectType].name + " analysis";

			ret = (
				<div>
					<div className="screen-setter"><div>
						<div className="screen-setter-section">{title}</div>
						<SelectorAnalysis
							disabled={this.props.disabled}
							data={this.state.selectorData}
							value={this.state.selectorValue}
							onChange={this.onSelectorChange.bind(this)}
							onNew={this.onNewEmptyObject.bind(this)}
						/>
					</div></div>
					<div className="screen-content"><div>
						<ConfigAnalysis
							disabled={this.props.disabled}
							screenKey={this.props.screenKey}
							selectorValue={this.state.selectorValue}
						/>
					</div></div>
				</div>
			);

		}

		return ret;

	}
}

export default ScreenAnalysisConfig;
