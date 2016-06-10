import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataPeriod.css';
import withStyles from '../../../decorators/withStyles';

import path from "path";

import utils from '../../../utils/utils';

import PeriodStore from '../../../stores/PeriodStore';
import SelectorMetadataPeriod from '../../sections/SelectorMetadataPeriod'; // todo universal selector
import ConfigMetadataPeriod from '../../sections/ConfigMetadataPeriod';
import ListenerHandler from '../../../core/ListenerHandler';

import logger from '../../../core/Logger';
import PantherComponent from "../../common/PantherComponent";

var initialState = {
	periods: [],
	selectorValue: null
};


@withStyles(styles)
class ScreenMetadataPeriod extends PantherComponent{

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		if(this.props.data && this.props.data.initialKey) {
			this.state.selectorValue = this.props.data.initialKey;
		}
	}

	getUrl() {
		return path.join(this.props.parentUrl, "analysis/" + this.state.selectorValue);
	}

	store2state(props) {
		//if(!props){
		//	props = this.props;
		//}
		return {
			periods: PeriodStore.getAll()
		};
	}

	_onStoreChange() {
		logger.trace("ScreenMetadataPeriod# _onStoreChange()");
		super.setStateFromStores(this.store2state());
	}

	componentDidMount() { 
		super.componentDidMount();
		
		this.changeListener.add(PeriodStore);
		super.setStateFromStores(this.store2state());
	}

	componentWillReceiveProps(newProps) {
		logger.trace("ScreenMetadataPeriod# componentWillReceiveProps(), New props:",newProps, ", Current props:", this.props);
		if(this.props.data.initialKey != newProps.data.initialKey) {
			this.state.selectorValue = newProps.data.initialKey;
		}
		//this.context.setStateFromStores.call(this, this.store2state(newProps));
	}

	onSelectorChange (value) {
		this.setState({
			selectorValue: value
		});
	}

	render() {
		return (
			<div>
				<div className="screen-setter"><div>
					<h2>Imaging/reference period</h2>
					<SelectorMetadataPeriod
						disabled={this.props.disabled}
						data={this.state.periods}
						value={this.state.selectorValue}
						onChange={this.onSelectorChange.bind(this)}
					/>
				</div></div>
				<div className="screen-content"><div>
					<ConfigMetadataPeriod
						disabled={this.props.disabled}
						selectorValue={this.state.selectorValue}
						parentUrl={this.getUrl()}
					/>
				</div></div>
			</div>
		);

	}
}

export default ScreenMetadataPeriod;
