import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataBase.css';
import withStyles from '../../../decorators/withStyles';

import ObjectList from '../../elements/ObjectList';
import classnames from 'classnames';

const SCOPES = [
	{ key: 1, name: 'Local' },
	{ key: 2, name: 'National' },
	{ key: 3, name: 'Regional' },
	{ key: 4, name: 'Local (EOW2)' }
];
const VECTORLAYERTEMPLATES = [
	{ key: 1, name: 'Road network' },
	{ key: 2, name: 'Hospitals' },
	{ key: 3, name: 'Land cover' },
	{ key: 4, name: 'Land cover change' },
	{ key: 5, name: 'Possible low-income settlements (areals)' },
	{ key: 7, name: 'Possible low-income settlements (mid-points)' }
];
const TABS = [
	{ key: "scope", name: "Scope", data: SCOPES },
	{ key: "header-templates", name: "Templates", header: true },
	{ key: "vector-layer", name: "Vector layer", data: VECTORLAYERTEMPLATES, isTemplate: true },
	{ key: "raster-layer", name: "Raster layer", data: VECTORLAYERTEMPLATES, isTemplate: true },
	{ key: "attribute-set", name: "Attribute set", data: VECTORLAYERTEMPLATES, isTemplate: true },
	{ key: "attribute", name: "Attribute", data: VECTORLAYERTEMPLATES, isTemplate: true },
	{ key: "header-metadata", name: "Metadata", header: true },
	{ key: "place", name: "Place", data: VECTORLAYERTEMPLATES },
	{ key: "period", name: "Imaging/reference period", data: VECTORLAYERTEMPLATES },
	{ key: "theme", name: "Theme", data: VECTORLAYERTEMPLATES },
	{ key: "topic", name: "Topic", data: VECTORLAYERTEMPLATES },
	{ key: "header-display", name: "Display", header: true  },
	{ key: "layer-group", name: "Layer group", data: VECTORLAYERTEMPLATES },
	{ key: "style", name: "Style", data: VECTORLAYERTEMPLATES }
];

@withStyles(styles)
class ScreenMetadataBase extends Component{

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		var initialActiveObjectListItems = {};
		for (var tab in TABS) {
			initialActiveObjectListItems[tab.key] = null;
		}

		this.state = {
			activeMenuItem: "vector-layer",
			activeObjectListItems: initialActiveObjectListItems
		};

	}

	onChangeActive(key) {
		this.setState({
			activeMenuItem: key
		});
	}

	changeActiveObjectListItem(itemType, value){
		var newActiveObjectListItems = this.state.activeObjectListItems;
		newActiveObjectListItems[itemType] = value;
		this.setState({
			activeObjectListItems: newActiveObjectListItems
		});
		// todo replace selection with screen-opener logic
	}

	onObjectListItemClick(itemType, item, event) {
		this.context.onInteraction().call();
		// todo open screen with item
		this.changeActiveObjectListItem(itemType,item.key);
	}
	onObjectListAddClick(itemType, event) {
		this.context.onInteraction().call();
		// todo create item + open screen
		this.changeActiveObjectListItem(itemType,null);
	}

	getUrl() {
		return path.join(this.props.parentUrl, "metadata/" + this.state.activeMenuItem);
	}

	render() {
		var tabsInsert = [];
		var contentInsert = [];
		for(var tab of TABS) {
			var tabElement;
			var contentElement;
			if(tab.header) {
				tabElement = (
					<a
						className="header item"
						key={"metadata-tabs-"+tab.key}
					>
						{tab.name}
					</a>
				);
				contentElement = "";
			} else {
				tabElement = (
					<a
						className={this.state.activeMenuItem==tab.key ? 'item active' : 'item'}
						onClick={this.context.onInteraction( this.onChangeActive.bind(this,tab.key) )}
						key={"metadata-tabs-"+tab.key}
					>
						{tab.name}
					</a>
				);
				contentElement = (
					<div
						className={this.state.activeMenuItem==tab.key ? 'items active' : 'items'}
						id={"metadata-items-"+tab.key}
						key={"metadata-items-"+tab.key}
					>
						<ObjectList
							data={tab.data}
							onItemClick={this.onObjectListItemClick.bind(this,tab.key)}
							onAddClick={this.onObjectListAddClick.bind(this,tab.key)}
							itemClasses={classnames({'template' : tab.isTemplate})}
							selectedItemKey={this.state.activeObjectListItems[tab.key]}
						/>
					</div>
				);
			}
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
