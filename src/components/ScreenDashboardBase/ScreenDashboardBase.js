import React, { PropTypes, Component } from 'react';
import styles from './ScreenDashboardBase.css';
import withStyles from '../../decorators/withStyles';

import Dashboard from '../Dashboard';

@withStyles(styles)
class ScreenDashboardBase extends Component{
	render() {
		return (
			<div>
				<div className="screen-content"><div>
					<h1>Dashboard</h1>
					<Dashboard/>
				</div></div>
			</div>
		);

	}
}

export default ScreenDashboardBase;
