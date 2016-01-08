import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysesBase.css';
import withStyles from '../../../decorators/withStyles';
import path from "path";

import AnalysesListSpatial from '../../temp/AnalysesListSpatial';

const TABS = [
	{ key: "spatial", name: "Spatial" },
	{ key: "level", name: "Level aggregation" },
	{ key: "math", name: "Math" }
];
// todo add to TABS: what to display in ObjectList & what to do onClick

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
		var tabsInsert = [];
		var contentInsert = [];
		for(var tab of TABS) {
			var tabElement;
			if(tab.header) {
				tabElement = (
					<a
						className="header item"
						key={"analyses-tabs-"+tab.key}
					>
						{tab.name}
					</a>
				);
			} else {
				tabElement = (
					<a
						className={this.state.activeMenuItem==tab.key ? 'item active' : 'item'}
						onClick={this.context.onInteraction( this.onChangeActive.bind(this,tab.key) )}
						key={"analyses-tabs-"+tab.key}
					>
						{tab.name}
					</a>
				);
			}
			var contentElement = (
				<div
					className={this.state.activeMenuItem==tab.key ? 'items active' : 'items'}
					id={"analyses-items-"+tab.key}
					key={"analyses-items-"+tab.key}
				>
					<AnalysesListSpatial/>
				</div>
			);
			// todo replace <AnalysesListSpatial/> with <ObjectList data={tab.data} /> or similar
			tabsInsert.push(tabElement);
			contentInsert.push(contentElement);
		}


		return (
			<div>
				<p style={{backgroundColor: "yellow"}}>DATA: {JSON.stringify(this.state.data)}</p>
				<p style={{backgroundColor: "yellow"}}>getUrl: {this.getUrl()}</p>
				<div className="screen-content"><div>
					<h1>Analyses</h1>

					<div className="analyses-grid">
						<div className="analyses-grid-types">
							<div className="ui smaller vertical tabular menu">
								{tabsInsert}
							</div>
						</div>
						<div className="analyses-grid-items">
							{contentInsert}
						</div>
					</div>

				</div></div>
			</div>
		);

	}
}

export default ScreenAnalysesBase;
