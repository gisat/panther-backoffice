import React, { PropTypes, Component } from 'react';
import styles from './ScreenDashboardBase.css';
import withStyles from '../../decorators/withStyles';

import DummyDashboard from '../DummyDashboard';

@withStyles(styles)
class ScreenDashboardBase extends Component{
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
				<DummyDashboard/>
      </div>
    );

  }
}

export default ScreenDashboardBase;
