import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataBase.css';
import withStyles from '../../../decorators/withStyles';

import MetadataListLayerVector from '../../temp/MetadataListLayerVector';

const TABS = [
	{ key: "spatial", name: "Scope" },
	{ key: "header-templates", name: "Templates", header: true },
	{ key: "vectorLayer", name: "Vector layer" },
	{ key: "rasterLayer", name: "Raster layer" },
	{ key: "attributeSet", name: "Attribute set" },
	{ key: "attribute", name: "Attribute" },
	{ key: "header-metadata", name: "Metadata", header: true },
	{ key: "place", name: "Place" },
	{ key: "period", name: "Imaging/reference period" },
	{ key: "theme", name: "Theme" },
	{ key: "topic", name: "Topic" },
	{ key: "header-display", name: "Display", header: true  },
	{ key: "layerGroup", name: "Layer group" },
	{ key: "style", name: "Style" }
];
// todo add to TABS: what to display in ObjectList & what to do onClick

@withStyles(styles)
class ScreenMetadataBase extends Component{

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			activeMenuItem: "vectorLayer"
		};

	}

	onChangeActive(key) {
		this.setState({
			activeMenuItem: key
		});
	}

	render() {
		var tabsInsert = [];
		var contentInsert = [];
		for(var tab of TABS) {
			var tabElement;
			if(tab.header) {
				tabElement = (
					<a className="header item">
						{tab.name}
					</a>
				);
			} else {
				tabElement = (
					<a
						className={this.state.activeMenuItem==tab.key ? 'item active' : 'item'}
						onClick={this.context.onInteraction( this.onChangeActive.bind(this,tab.key) )}
					>
						{tab.name}
					</a>
				);
			}
			var contentElement = (
				<div
					className={this.state.activeMenuItem==tab.key ? 'items active' : 'items'}
					id={"analyses-items-"+tab.key}
				>
					<MetadataListLayerVector/>
				</div>
			);
			// todo replace <MetadataListLayerVector/> with <ObjectList data={tab.data} /> or similar
			tabsInsert.push(tabElement);
			contentInsert.push(contentElement);
		}

		return (
			<div>
				<div className="screen-content"><div>
					<h1>Metadata structures</h1>

					<div className="metadata-grid">
						<div className="metadata-grid-types">
							<div className="ui smaller vertical tabular menu">
								{tabsInsert}
							</div>
						</div>
						<div className="metadata-grid-items">
							{contentInsert}
						</div>
					</div>

				</div></div>
			</div>
		);

	}
}

export default ScreenMetadataBase;
