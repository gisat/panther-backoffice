import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataLayerVector.css';
import withStyles from '../../../decorators/withStyles';

import SelectorMetadataLayerVector from '../../sections/SelectorMetadataLayerVector';
import ConfigMetadataLayerVector from '../../sections/ConfigMetadataLayerVector';

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
