import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataBase.css';
import withStyles from '../../../decorators/withStyles';

import ObjectList from '../../elements/ObjectList';
import classnames from 'classnames';

import utils from '../../../utils/utils';

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

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';
import PantherComponent from "../../common/PantherComponent";

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
	activeMenuItem: "scope",
	activeObjectListItems: {}
};


@withStyles(styles)
class ScreenMetadataBase extends PantherComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		screenKey: PropTypes.string.isRequired
	};

	static defaultProps = {
		disabled: false
	};

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);

		this.state = utils.deepClone(initialState);
		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
		this.responseListener = new ListenerHandler(this, this._onStoreResponse, 'addResponseListener', 'removeResponseListener');

		this._tabs = [
			{ data: "places", dataType: ObjectTypes.PLACE },
			{ data: "scopes", dataType: ObjectTypes.SCOPE },
			{ data: "auLevels", dataType: ObjectTypes.AU_LEVEL },
			{ data: "periods", dataType: ObjectTypes.PERIOD},
			{ header: true, key: "header-templates", name: "Templates" },
			{ data: "vectorLayerTemplates", dataType: ObjectTypes.VECTOR_LAYER_TEMPLATE },
			{ data: "rasterLayerTemplates", dataType: ObjectTypes.RASTER_LAYER_TEMPLATE },
			{ data: "attributeSets", dataType: ObjectTypes.ATTRIBUTE_SET },
			{ data: "attributes", dataType: ObjectTypes.ATTRIBUTE },
			{ header: true, key: "header-filters", name: "Themes" },
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
		logger.trace("ScreenMetadataBase# _onStoreChange(), Keys:", keys);
		super.setStateFromStores(this.store2state(), keys);
	}

	_onStoreResponse(result,responseData,stateHash) {
		if (stateHash === this.getStateHash()) {
			if (result) {
				var screenName = this.props.screenKey + "-ScreenMetadata" + responseData.objectType;
				let options = {
					component: ScreenMetadataObject,
					parentUrl: this.props.parentUrl,
					size: 40,
					data: {
						objectType: responseData.objectType,
						objectKey: result[0].key
					}
				};
				ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
			}
		}
	}

	componentDidMount() { this.mounted = true;
		this.changeListener.add(ScopeStore, ["scopes"]);
		this.responseListener.add(ScopeStore);
		this.changeListener.add(VectorLayerStore, ["vectorLayerTemplates"]);
		this.responseListener.add(VectorLayerStore);
		this.changeListener.add(RasterLayerStore, ["rasterLayerTemplates"]);
		this.responseListener.add(RasterLayerStore);
		this.changeListener.add(AULevelStore, ["auLevels"]);
		this.responseListener.add(AULevelStore);
		this.changeListener.add(AttributeSetStore, ["attributeSets"]);
		this.responseListener.add(AttributeSetStore);
		this.changeListener.add(AttributeStore, ["attributes"]);
		this.responseListener.add(AttributeStore);
		this.changeListener.add(PlaceStore, ["places"]);
		this.responseListener.add(PlaceStore);
		this.changeListener.add(PeriodStore, ["periods"]);
		this.responseListener.add(PeriodStore);
		this.changeListener.add(ThemeStore, ["themes"]);
		this.responseListener.add(ThemeStore);
		this.changeListener.add(TopicStore, ["topics"]);
		this.responseListener.add(TopicStore);
		this.changeListener.add(LayerGroupStore, ["layerGroups"]);
		this.responseListener.add(LayerGroupStore);
		this.changeListener.add(StyleStore, ["styles"]);
		this.responseListener.add(StyleStore);

		super.setStateFromStores(this.store2state());
	}

	componentWillUnmount() { this.mounted = false;
		this.changeListener.clean();
		this.responseListener.clean();
	}

	//componentWillReceiveProps(newProps) {
	//	// no props we need to react to
	//}

	//shouldComponentUpdate() {
	//	return false; // can we only rerender children?
	//}


	componentWillUpdate(newProps, newState) {
		if(newState.activeMenuItem!=this.state.activeMenuItem) {
			this.updateStateHash(newState);
		}
	}

	/**
	 * Differentiate between states
	 * - when receiving response for asynchronous action, ensure state has not changed in the meantime
	 */
	updateStateHash(state) {
		if(!state){
			state = this.state;
		}
		// todo hash influenced by screen/page instance / active screen (unique every time it is active)
		this._stateHash = utils.stringHash(state.activeMenuItem);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}



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
		var screenName = this.props.screenKey + "-ScreenMetadata" + itemType;
		let options = {
			component: ScreenMetadataObject,
			parentUrl: this.props.parentUrl,
			size: 40,
			data: {
				objectType: itemType,
				objectKey:item.key
			}
		};
		ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);

		//todo highlighting screen opener.
		//this.changeActiveObjectListItem(itemType,item.key);
	}
	onObjectListAddClick(itemType, event) {
		this.context.onInteraction().call();
		let model = new Model[itemType]({active:false});
		let responseData = {
			objectType: itemType
		};
		ActionCreator.createObjectAndRespond(model,itemType,responseData,this.getStateHash());
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
