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

	constructor(props) {
		super(props);

		this.state = {
			idAnalysisSpatial: 15,
			parentUrl: ""
		};
	}

	onChangeId(newId) {
		this.setState({
			idAnalysisSpatial: newId
		});
	}


  render() {
		return (
      <div>
        <a onClick={this.context.onSetScreenData.bind(null, "analyses3", {nastaveno: "jo"})}>nastav</a>
				<div className="screen-setter"><div>
					<h2>Analysis</h2>
					<SelectorAnalysisSpatial id={this.state.idAnalysisSpatial} onChange={this.onChangeId.bind(this)} data={this.props.data} />
				</div></div>
				<div className="screen-content"><div>
					<ConfigAnalysisSpatial id={this.state.idAnalysisSpatial} data={this.props.data} />
				</div></div>
      </div>
    );

  }
}

export default ScreenAnalysisSpatial;
