import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysesBase.css';
import withStyles from '../../../decorators/withStyles';
import path from "path";

import AnalysesListSpatial from '../../temp/AnalysesListSpatial';

@withStyles(styles)
class ScreenAnalysesBase extends Component{

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		onSetScreenData: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			activeMenuItem: "spatial",
			data: this.props.data
		};
	}

	onChangeActive(key) {
		this.setState({
			activeMenuItem: key
		});
	}

	getUrl() {
		return path.join(this.props.parentUrl, "analyses/" + this.state.activeMenuItem);
	}

	render() {
		return (
			<div>
				<p style={{backgroundColor: "yellow"}}>DATA: {JSON.stringify(this.state.data)}</p>
				<p style={{backgroundColor: "yellow"}}>getUrl: {this.getUrl()}</p>
				<div className="screen-content"><div>
					<h1>Analyses</h1>

					<div className="analyses-grid">
						<div className="analyses-grid-types">

							<div className="ui smaller vertical tabular menu">
								<a
									className={this.state.activeMenuItem=="spatial" ? 'item active' : 'item'}
									onClick={this.context.onInteraction( this.onChangeActive.bind(this,"spatial") )}
								>
									Spatial
								</a>
								<a
									className={this.state.activeMenuItem=="level" ? 'item active' : 'item'}
									onClick={this.context.onInteraction( this.onChangeActive.bind(this,"level") )}
								>
									Level aggregation
								</a>
								<a
									className={this.state.activeMenuItem=="math" ? 'item active' : 'item'}
									onClick={this.context.onInteraction( this.onChangeActive.bind(this,"math") )}
								>
									Math
								</a>
							</div>


						</div>
						<div className="analyses-grid-items">

							<div
								className={this.state.activeMenuItem=="spatial" ? 'items active' : 'items'}
								id="analyses-items-spatial"
							>
								<AnalysesListSpatial/>
							</div>

							<div
								className={this.state.activeMenuItem=="level" ? 'items active' : 'items'}
								id="analyses-items-level"
							>
								(level)
							</div>

							<div
								className={this.state.activeMenuItem=="math" ? 'items active' : 'items'}
								id="analyses-items-math"
							>
								(math)
							</div>

						</div>
					</div>

				</div></div>
			</div>
		);

	}
}

export default ScreenAnalysesBase;
