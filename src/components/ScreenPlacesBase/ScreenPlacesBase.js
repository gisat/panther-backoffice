import React, { PropTypes, Component } from 'react';
import styles from './ScreenPlacesBase.css';
import withStyles from '../../decorators/withStyles';

import LinkTableByScopePlace from '../LinkTableByScopePlace';

@withStyles(styles)
class ScreenPlacesBase extends Component{
  render() {
    return (
      <div>
        <h1>Places</h1>
        <LinkTableByScopePlace/>
      </div>
    );

  }
}

export default ScreenPlacesBase;
