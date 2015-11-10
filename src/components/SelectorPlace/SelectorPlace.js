import React, { PropTypes, Component } from 'react';
import styles from './SelectorPlace.css';
import withStyles from '../../decorators/withStyles';



@withStyles(styles)
class SelectorPlace extends Component{
  render() {
    return (
      <div>
        <span className="todo">(place selector)</span>
        
      </div>
    );

  }
}

export default SelectorPlace;
