import React, { PropTypes, Component } from 'react';
import styles from './SelectorAttSetAULevel.css';
import withStyles from '../../decorators/withStyles';



@withStyles(styles)
class SelectorAttSetAULevel extends Component{
  render() {
    return (
      <div>
        <span className="todo">(AttSet &amp; AU level selector)</span>
        
      </div>
    );

  }
}

export default SelectorAttSetAULevel;
