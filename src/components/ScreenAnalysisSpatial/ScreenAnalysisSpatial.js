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
			idAnalysisSpatial: 1
		};
	}

	onChangeId(newId) {
		this.setState({
			idAnalysisSpatial: newId
		});
	}

	getUrl() {
		return this.props.parentUrl + "/analysis-spatial-" + this.state.idAnalysisSpatial;
	}

	render() {
		return (
			<div>
				<a onClick={this.context.onSetScreenData("analyses3", {nastaveno: "jo"})}>nastav</a>
				<p style={{backgroundColor: "yellow"}}>getUrl: {this.getUrl()}</p>
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
