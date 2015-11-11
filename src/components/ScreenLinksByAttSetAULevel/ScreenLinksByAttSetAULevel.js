import React, { PropTypes, Component } from 'react';
import styles from './ScreenLinksByAttSetAULevel.css';
import withStyles from '../../decorators/withStyles';

import SelectorAttSetAULevel from '../SelectorAttSetAULevel';
import ConfigLinksByAttSetAULevel from '../ConfigLinksByAttSetAULevel';

@withStyles(styles)
class ScreenLinksByAttSetAULevel extends Component{
  render() {
    return (
      <div>
        <div className="screen-setter"><div>
					<h3>Attribute set data linking</h3>
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
