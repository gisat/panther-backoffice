import React, { PropTypes, Component } from 'react';
import styles from './ScreenDataLayersBase.css';
import withStyles from '../../decorators/withStyles';



@withStyles(styles)
class ScreenDataLayersBase extends Component{
  render() {
    return (
      <div>
        <div className="screen-content"><div>
					<h1>Data layers</h1>
        </div></div>
      </div>
    );

  }
}

export default ScreenDataLayersBase;
