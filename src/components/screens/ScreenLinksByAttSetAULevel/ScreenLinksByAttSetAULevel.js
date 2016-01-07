import React, { PropTypes, Component } from 'react';
import styles from './ScreenLinksByAttSetAULevel.css';
import withStyles from '../../../decorators/withStyles';

import SelectorAttSetAULevel from '../../sections/SelectorAttSetAULevel';
import ConfigLinksByAttSetAULevel from '../../sections/ConfigLinksByAttSetAULevel';

@withStyles(styles)
class ScreenLinksByAttSetAULevel extends Component{
render() {
		return (
			<div>
				<div className="screen-setter"><div>
					<h2>Data source selection</h2>
					<SelectorAttSetAULevel />
				</div></div>
				<div className="screen-content"><div>
					<ConfigLinksByAttSetAULevel />
				</div></div>
			</div>
		);
	}
}

export default ScreenLinksByAttSetAULevel;
