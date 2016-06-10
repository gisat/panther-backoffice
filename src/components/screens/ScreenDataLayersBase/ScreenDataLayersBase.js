import React, { PropTypes, Component } from 'react';
import styles from './ScreenDataLayersBase.css';
import withStyles from '../../../decorators/withStyles';

import path from "path";

import utils from '../../../utils/utils';

import DataLayerStore from '../../../stores/DataLayerStore';
import SelectorDataLayer from '../../sections/SelectorDataLayer';
import ConfigDataLayer from '../../sections/ConfigDataLayer';

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';
import PantherComponent from "../../common/PantherComponent";

var initialState = {
	dataLayers: [],
	selectorValue: null
};


@withStyles(styles)
class ScreenDataLayersBase extends PantherComponent {

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
	}

	getUrl() {
		return path.join(this.props.parentUrl, "datalayers/" + this.state.selectorValue);
	}

	store2state(props) {
		//if(!props){
		//	props = this.props;
		//}
		return {
			dataLayers: DataLayerStore.getAll()
		};
	}

	_onStoreChange() {
		logger.trace("ScreenDataLayersBase# _onStoreChange()");
		super.setStateFromStores(this.store2state());
	}

	componentDidMount() {
		super.componentDidMount();
		
		this.changeListener.add(DataLayerStore);

		super.setStateFromStores(this.store2state());
	}

	componentWillReceiveProps(newProps) {
		logger.trace("ScreenDataLayersBase# componentWillReceiveProps(), Props:", newProps);
		super.setStateFromStores(this.store2state(newProps));
	}

	onSelectorFocus(){
		logger.trace("ScreenDataLayersBase# onSelectorFocus()");
		DataLayerStore.reload();
	}

	onSelectorChange (value) {
		logger.trace("ScreenDataLayersBase# onSelectorChange(), Value: ", value);

		this.setState({
			selectorValue: value
		});
	}

	render() {
		var selectorData = this.state.dataLayers;
		selectorData.sort(function(a, b) {
			if(a.referenced && !b.referenced) return 1;
			if(!a.referenced && b.referenced) return -1;
			if(a.key > b.key) return 1;
			if(a.key < b.key) return -1;
			return 0;
		});

		return (
			<div>
				<div className="screen-setter"><div>
					<SelectorDataLayer
						disabled={this.props.disabled}
						data={selectorData}
						value={this.state.selectorValue}
						onChange={this.onSelectorChange.bind(this)}
						onFocus={this.onSelectorFocus.bind(this)}
					/>
				</div></div>
				<div className="screen-content"><div>
					<ConfigDataLayer
						disabled={this.props.disabled}
						selectorValue={this.state.selectorValue}
						dataLayers={this.state.dataLayers}
						screenKey={this.props.screenKey}
						parentUrl={this.getUrl()}
					/>
				</div></div>
			</div>
		);

	}
}

export default ScreenDataLayersBase;
