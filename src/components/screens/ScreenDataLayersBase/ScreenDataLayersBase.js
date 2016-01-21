import React, { PropTypes, Component } from 'react';
import styles from './ScreenDataLayersBase.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';

import SelectorDataLayer from '../../sections/SelectorDataLayer';
import ConfigDataLayer from '../../sections/ConfigDataLayer';

const TEMPDATALAYERS = require('../../../stores/tempDataLayers');

//function getStateFromStores() {
//	return {
//		dataLayers: DataLayerStore.all();
//	}
//}
//var initialState = {
//	selectorValue: "geonode:puma_srb_lulc_change_2000_2011"
//};

@withStyles(styles)
class ScreenDataLayersBase extends Component{

	constructor(props) {
		super(props);

		// temp
		this.state = {
			selectorValue: null,
			dataLayers: TEMPDATALAYERS
		};

		//this.state = _.extend({},initialState,getStateFromStores());
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
