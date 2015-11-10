import React, { PropTypes, Component } from 'react';
import styles from './ScreenPlacesBase.css';
import withStyles from '../../decorators/withStyles';

import LinkTableByScopePlace from '../LinkTableByScopePlace';
import SelectorPlace from '../SelectorPlace';

@withStyles(styles)
class ScreenPlacesBase extends Component{
  render() {
    
		var isParentScreenDisabled = "NA";
		if(this.props.disabled){
			isParentScreenDisabled = "disabled"
		}
		else {
			isParentScreenDisabled = "enabled"
		}
		
		return (
      <div>
        <SelectorPlace/>
				<h1>Ho Chi Minh City</h1>
				<p>disable pass test: <b>{isParentScreenDisabled}</b></p>
				<h2>Attribute sets</h2>
        <LinkTableByScopePlace/>
				
				<h2>Vector layers</h2>
        <LinkTableByScopePlace/>
				
				<h2>Raster layers</h2>
        <LinkTableByScopePlace/>
				
      </div>
    );

  }
}

export default ScreenPlacesBase;
