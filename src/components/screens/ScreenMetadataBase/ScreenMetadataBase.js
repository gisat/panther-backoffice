import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataBase.css';
import withStyles from '../../../decorators/withStyles';

import ObjectList from '../../elements/ObjectList';
import classnames from 'classnames';

import ScreenMetadataObject from '../ScreenMetadataObject'

import ObjectTypes, {Model, objectTypesMetadata} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import ScopeStore from '../../../stores/ScopeStore';
import VectorLayerStore from '../../../stores/VectorLayerStore';
import RasterLayerStore from '../../../stores/RasterLayerStore';
import AULevelStore from '../../../stores/AULevelStore';
import AttributeStore from '../../../stores/AttributeStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import PlaceStore from '../../../stores/PlaceStore';
import PeriodStore from '../../../stores/PeriodStore';
import ThemeStore from '../../../stores/ThemeStore';
import TopicStore from '../../../stores/TopicStore';
import LayerGroupStore from '../../../stores/LayerGroupStore';
import StyleStore from '../../../stores/StyleStore';


var initialState = {
	scopes: [],
	vectorLayerTemplates: [],
	rasterLayerTemplates: [],
	auLevels: [],
	attributeSets: [],
	attributes: [],
	places: [],
	periods: [],
	themes: [],
	topics: [],
	layerGroups: [],
	styles: [],
	activeMenuItem: "vector-layer",
	activeObjectListItems: {}
};


@withStyles(styles)
class ScreenMetadataBase extends Component{

	static propTypes = {
		disabled: React.PropTypes.bool
	};

	static defaultProps = {
		disabled: false
	};

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		onSetScreenData: PropTypes.func.isRequired,
		openScreen: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.state = initialState;

		this._tabs = [
			{ data: "scopes", dataType: ObjectTypes.SCOPE },
			{ header: true, key: "header-templates", name: "Templates" },
			{ data: "vectorLayerTemplates", dataType: ObjectTypes.VECTOR_LAYER_TEMPLATE },
			{ data: "rasterLayerTemplates", dataType: ObjectTypes.RASTER_LAYER_TEMPLATE },
			{ data: "auLevels", dataType: ObjectTypes.AU_LEVEL },
			{ data: "attributeSets", dataType: ObjectTypes.ATTRIBUTE_SET },
			{ data: "attributes", dataType: ObjectTypes.ATTRIBUTE },
			{ header: true, key: "header-metadata", name: "Metadata" },
			{ data: "places", dataType: ObjectTypes.PLACE },
			{ data: "periods", dataType: ObjectTypes.PERIOD},
			{ data: "themes", dataType: ObjectTypes.THEME },
			{ data: "topics", dataType: ObjectTypes.TOPIC },
			{ header: true, key: "header-display", name: "Display"  },
			{ data: "layerGroups", dataType: ObjectTypes.LAYER_GROUP },
			{ data: "styles", dataType: ObjectTypes.STYLE }
		];
		for (var tab of this._tabs) {
			if(!tab.header) {
				tab.key = objectTypesMetadata[tab.dataType].url;
				tab.name = objectTypesMetadata[tab.dataType].name;
				if(objectTypesMetadata[tab.dataType].isTemplate) {
					tab.isTemplate = true;
				}
			}
		}

	}

	store2state() {
		return {
			scopes: ScopeStore.getAll(),
			vectorLayerTemplates: VectorLayerStore.getAll(),
			rasterLayerTemplates: RasterLayerStore.getAll(),
			auLevels: AULevelStore.getAll(),
			attributeSets: AttributeSetStore.getAll(),
			attributes: AttributeStore.getAll(),
			places: PlaceStore.getAll(),
			periods: PeriodStore.getAll(),
			themes: ThemeStore.getAll(),
			topics: TopicStore.getAll(),
			layerGroups: LayerGroupStore.getAll(),
			styles: StyleStore.getAll()
		};
	}

	_onStoreChange(keys) {
		this.context.setStateFromStores.call(this, this.store2state(), keys);
	}

	componentDidMount() {
		ScopeStore.addChangeListener(this._onStoreChange.bind(this,["scopes"]));
		VectorLayerStore.addChangeListener(this._onStoreChange.bind(this,["vectorLayerTemplates"]));
		RasterLayerStore.addChangeListener(this._onStoreChange.bind(this,["rasterLayerTemplates"]));
		AULevelStore.addChangeListener(this._onStoreChange.bind(this,["auLevels"]));
		AttributeSetStore.addChangeListener(this._onStoreChange.bind(this,["attributeSets"]));
		AttributeStore.addChangeListener(this._onStoreChange.bind(this,["attributes"]));
		PlaceStore.addChangeListener(this._onStoreChange.bind(this,["places"]));
		PeriodStore.addChangeListener(this._onStoreChange.bind(this,["periods"]));
		ThemeStore.addChangeListener(this._onStoreChange.bind(this,["themes"]));
		TopicStore.addChangeListener(this._onStoreChange.bind(this,["topics"]));
		LayerGroupStore.addChangeListener(this._onStoreChange.bind(this,["layerGroups"]));
		StyleStore.addChangeListener(this._onStoreChange.bind(this,["styles"]));
		this.context.setStateFromStores.call(this, this.store2state());
	}

	componentWillUnmount() {
		ScopeStore.removeChangeListener(this._onStoreChange.bind(this,["scopes"]));
		VectorLayerStore.removeChangeListener(this._onStoreChange.bind(this,["vectorLayerTemplates"]));
		RasterLayerStore.removeChangeListener(this._onStoreChange.bind(this,["rasterLayerTemplates"]));
		AULevelStore.removeChangeListener(this._onStoreChange.bind(this,["auLevels"]));
		AttributeSetStore.removeChangeListener(this._onStoreChange.bind(this,["attributeSets"]));
		AttributeStore.removeChangeListener(this._onStoreChange.bind(this,["attributes"]));
		PlaceStore.removeChangeListener(this._onStoreChange.bind(this,["places"]));
		PeriodStore.removeChangeListener(this._onStoreChange.bind(this,["periods"]));
		ThemeStore.removeChangeListener(this._onStoreChange.bind(this,["themes"]));
		TopicStore.removeChangeListener(this._onStoreChange.bind(this,["topics"]));
		LayerGroupStore.removeChangeListener(this._onStoreChange.bind(this,["layerGroups"]));
		StyleStore.removeChangeListener(this._onStoreChange.bind(this,["styles"]));
	}

	componentWillReceiveProps(newProps) {
		// no props we need to react to
	}

	//shouldComponentUpdate() {
	//	return false; // can we only rerender children?
	//}



	onChangeActive(key) {
		this.setState({
			activeMenuItem: key
		});
	}

	//changeActiveObjectListItem(itemType, value){
	//	var newActiveObjectListItems = this.state.activeObjectListItems;
	//	newActiveObjectListItems[itemType] = value;
	//	this.setState({
	//		activeObjectListItems: newActiveObjectListItems
	//	});
	//	// todo replace selection with screen-opener logic
	//}

	onObjectListItemClick(itemType, item, event) {
		this.context.onInteraction().call();
		// todo open screen with item
		var screenName = "ScreenMetadataBase-ScreenMetadata" + itemType;
		this.context.openScreen(screenName,<ScreenMetadataObject/>,this.props.parentUrl,{size:40},{objectType: itemType,objectKey:item.key});

		//this.changeActiveObjectListItem(itemType,item.key);
	}
	onObjectListAddClick(itemType, event) {
		this.context.onInteraction().call();
		// todo create item + open screen
		//this.changeActiveObjectListItem(itemType,null);
	}

	getUrl() {
		return path.join(this.props.parentUrl, "metadata/" + this.state.activeMenuItem);
	}

	render() {
		var tabsInsert = [];
		var contentInsert = [];
		for(var tab of this._tabs) {
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
							data={this.state[tab.data]}
							onItemClick={this.onObjectListItemClick.bind(this,tab.dataType)}
							onAddClick={this.onObjectListAddClick.bind(this,tab.dataType)}
							itemClasses={classnames({'template' : tab.isTemplate})}
							//selectedItemKey={this.state.activeObjectListItems[tab.dataType]}
						/>
					</div>
				);
			}
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
