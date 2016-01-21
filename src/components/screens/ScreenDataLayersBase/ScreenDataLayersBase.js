import React, { PropTypes, Component } from 'react';
import styles from './ScreenDataLayersBase.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';

//import DataLayerStore from '../../../stores/DataLayerStore'
import SelectorDataLayer from '../../sections/SelectorDataLayer';
import ConfigDataLayer from '../../sections/ConfigDataLayer';

const TEMPDATALAYERS = require('../../../stores/tempDataLayers');

function getStateFromStores() {
	return {
		//dataLayers: DataLayerStore.all();
		dataLayers: TEMPDATALAYERS //temp
	}
}
var initialState = {
	selectorValue: null
};

@withStyles(styles)
class ScreenDataLayersBase extends Component{

	constructor(props) {
		super(props);
		this.state = _.extend({},initialState,getStateFromStores());
	}

	_onStoreChange() {
		this.setState(getStateFromStores());
	}

	//componentDidMount() {
	//	DataLayerStore.addChangeListener(this._onStoreChange);
	//}
	//
	//componentWillUnmount() {
	//	DataLayerStore.removeChangeListener(this._onStoreChange);
	//}

	onSelectorChange (value) {
		this.setState({
			selectorValue: value
		});
	}

	render() {

		return (
			<div>
				<div className="screen-setter"><div>
					<SelectorDataLayer
						disabled={this.props.disabled}
						data={this.state.dataLayers}
						value={this.state.selectorValue}
						onChange={this.onSelectorChange.bind(this)}
					/>
				</div></div>
				<div className="screen-content"><div>
					<ConfigDataLayer
						disabled={this.props.disabled}

					/>
				</div></div>
			</div>
		);

	}
}

export default ScreenDataLayersBase;
