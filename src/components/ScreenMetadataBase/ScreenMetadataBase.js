import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataBase.css';
import withStyles from '../../decorators/withStyles';



@withStyles(styles)
class ScreenMetadataBase extends Component{
  render() {
    return (
      <div>
        <div className="screen-content"><div>
					<h1>Metadata structures</h1>
        </div></div>
      </div>
    );

  }
}

export default ScreenMetadataBase;
