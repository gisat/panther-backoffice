import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysesBase.css';
import withStyles from '../../decorators/withStyles';



@withStyles(styles)
class ScreenAnalysesBase extends Component{
  render() {
    return (
      <div>
        <div className="screen-content"><div>
					<h1>Analyses</h1>
        </div></div>
      </div>
    );

  }
}

export default ScreenAnalysesBase;
