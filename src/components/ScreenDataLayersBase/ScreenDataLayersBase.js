import React, { PropTypes, Component } from 'react';
import styles from './ScreenDataLayersBase.css';
import withStyles from '../../decorators/withStyles';

import SelectorDataLayer from '../SelectorDataLayer';
import ConfigDataLayer from '../ConfigDataLayer';

@withStyles(styles)
class ScreenDataLayersBase extends Component{
	render() {

		return (
			<div>
				<div className="screen-setter"><div>
					<SelectorDataLayer disabled={this.props.disabled}/>
				</div></div>
				<div className="screen-content"><div>

					<ConfigDataLayer disabled={this.props.disabled} />

				</div></div>
			</div>
		);

	}
}

export default ScreenDataLayersBase;
