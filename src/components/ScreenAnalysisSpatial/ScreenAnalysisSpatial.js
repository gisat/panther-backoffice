import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisSpatial.css';
import withStyles from '../../decorators/withStyles';

import SelectorAnalysisSpatial from '../SelectorAnalysisSpatial';
import ConfigAnalysisSpatial from '../ConfigAnalysisSpatial';

@withStyles(styles)
class ScreenAnalysisSpatial extends Component{
  render() {
    return (
      <div>
				<div className="screen-setter"><div>
					<h2>Analysis</h2>
					<SelectorAnalysisSpatial />
				</div></div>
				<div className="screen-content"><div>
					<ConfigAnalysisSpatial />
				</div></div>
      </div>
    );

  }
}

export default ScreenAnalysisSpatial;
