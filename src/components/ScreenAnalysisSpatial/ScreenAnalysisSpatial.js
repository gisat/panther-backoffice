import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisSpatial.css';
import withStyles from '../../decorators/withStyles';

import SelectorAnalysisSpatial from '../SelectorAnalysisSpatial';
import ConfigAnalysisSpatial from '../ConfigAnalysisSpatial';

@withStyles(styles)
class ScreenAnalysisSpatial extends Component{
  static contextTypes = {
    onSetScreenData: PropTypes.func.isRequired
  };
  render() {
    return (
      <div>
        <a onClick={this.context.onSetScreenData.bind(null, "analyses3", {nastaveno: "jo"})}>nastav</a>
				<div className="screen-setter"><div>
					<h2>Analysis</h2>
					<SelectorAnalysisSpatial data={this.props.data} />
				</div></div>
				<div className="screen-content"><div>
					<ConfigAnalysisSpatial data={this.props.data} />
				</div></div>
      </div>
    );

  }
}

export default ScreenAnalysisSpatial;
