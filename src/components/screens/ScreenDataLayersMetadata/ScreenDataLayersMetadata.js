import React, { PropTypes, Component } from 'react';
//import styles from './ScreenDataLayersMetadata.css';
//import withStyles from '../../../decorators/withStyles';

import path from "path";

import utils from '../../../utils/utils';
import _ from 'underscore';

import ActionCreator from '../../../actions/ActionCreator';

//import PeriodStore from '../../../stores/PeriodStore';
import ListenerHandler from '../../../core/ListenerHandler';

import logger from '../../../core/Logger';
import ControllerComponent from "../../common/ControllerComponent";




//@withStyles(styles)
class ScreenDataLayersMetadata extends Component {

	
	render() {

		let ret = null;
		
			ret = (
				<div>
					<div className="screen-setter"><div>
						<div className="screen-setter-section">Data layer metadata</div>
						
					</div></div>
					<div className="screen-content"><div>
					
					</div></div>
				</div>
			);

		


		return ret;

	}
}

export default ScreenDataLayersMetadata;
