import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataLayerVector.css';
import withStyles from '../../decorators/withStyles';

import SelectorMetadataLayerVector from '../SelectorMetadataLayerVector';
import ConfigMetadataLayerVector from '../ConfigMetadataLayerVector';

@withStyles(styles)
class ScreenMetadataLayerVector extends Component{
  render() {
    return (
      <div>
				<div className="screen-setter"><div>
					<h2>Vector layer template</h2>
					<SelectorMetadataLayerVector />
				</div></div>
				<div className="screen-content"><div>
					<ConfigMetadataLayerVector />
				</div></div>
      </div>
    );

  }
}

export default ScreenMetadataLayerVector;
