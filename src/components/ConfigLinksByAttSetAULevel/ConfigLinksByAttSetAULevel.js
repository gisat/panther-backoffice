import React, { PropTypes, Component } from 'react';
import styles from './ConfigLinksByAttSetAULevel.css';
import withStyles from '../../decorators/withStyles';

import SelectorAttSetAULevel from '../SelectorAttSetAULevel';

@withStyles(styles)
class ConfigLinksByAttSetAULevel extends Component{
  render() {
    return (
      <div>
        <span className="todo">(config)</span>
				
      </div>
    );

  }
}

export default ConfigLinksByAttSetAULevel;
