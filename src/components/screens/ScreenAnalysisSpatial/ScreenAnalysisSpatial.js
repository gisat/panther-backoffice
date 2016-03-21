import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisSpatial.css';
import withStyles from '../../../decorators/withStyles';
import path from "path";

import SelectorAnalysisSpatial from '../../sections/SelectorAnalysisSpatial';
import ConfigAnalysisSpatial from '../../sections/ConfigAnalysisSpatial';

@withStyles(styles)
class ScreenAnalysisSpatial extends Component{

	constructor(props) {
		super(props);

		this.state = {
			idAnalysisSpatial: 1
		};
	}

	onChangeId(newId) {
		this.setState({
			idAnalysisSpatial: newId
		});
	}

	getUrl() {
		return path.join(this.props.parentUrl, "analysis-spatial-" + this.state.idAnalysisSpatial);
	}

	render() {
		return (
			<div>
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
