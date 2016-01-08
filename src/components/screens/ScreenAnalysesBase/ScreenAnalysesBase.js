import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysesBase.css';
import withStyles from '../../../decorators/withStyles';
import path from "path";

import ObjectList from '../../elements/ObjectList';

const SPATIALANALYSES = [
	{ key: 1, name: 'Land cover status' },
	{ key: 2, name: 'Land cover status aggregated' },
	{ key: 3, name: 'Land cover change' },
	{ key: 4, name: 'Land cover formation' },
	{ key: 5, name: 'Land cover consumption' },
	{ key: 8, name: 'Road type' },
	{ key: 11, name: 'Road length' }
];
const LEVELANALYSES = [
	{ key: 9, name: 'Road aggregated' },
	{ key: 15, name: 'Status aggregated' },
	{ key: 16, name: 'Change aggregated' },
	{ key: 22, name: 'Road length aggregated' }
];
const MATHANALYSES = [
	{ key: 13, name: 'Net Formation UF' },
	{ key: 24, name: 'Net Formation' }
];
const TABS = [
	{ key: "spatial", name: "Spatial", data: SPATIALANALYSES },
	{ key: "level", name: "Level aggregation", data: LEVELANALYSES },
	{ key: "math", name: "Math", data: MATHANALYSES }
];

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

	onObjectListItemClick(itemType, item, event) {
		this.context.onInteraction().call();
		console.log("-- onObjectListItemClick");
		console.log("itemType:",itemType);
		console.log("item:",item);
		console.log("event:",event);
	}
	onObjectListAddClick(itemType, event) {
		this.context.onInteraction().call();
		console.log("-- onObjectListAddClick");
		console.log("itemType:",itemType);
		console.log("event:",event);
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
					<ObjectList
						data={tab.data}
						onItemClick={this.onObjectListItemClick.bind(this,tab.key+'Analysis')}
						onAddClick={this.onObjectListAddClick.bind(this,tab.key+'Analysis')}
						itemClasses="template"
					/>
				</div>
			);
			// todo replace tab.key+'Analysis' with better reference to type
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
