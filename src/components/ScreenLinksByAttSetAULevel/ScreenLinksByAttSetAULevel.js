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
        <SelectorAttSetAULevel />
			
				<h3>
					Aggregated LC classes Formation 
					<br/>
					@ Core City x Outer Urban Zone
				</h3>
				
				<ConfigLinksByAttSetAULevel />
				
      </div>
    );

  }
}

export default ScreenLinksByAttSetAULevel;
