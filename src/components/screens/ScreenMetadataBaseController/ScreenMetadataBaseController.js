import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataBaseController.css';
import withStyles from '../../../decorators/withStyles';


import utils from '../../../utils/utils';
import _ from 'underscore';
import classnames from 'classnames';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

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
import ScreenStore from '../../../stores/ScreenStore';

import ScreenMetadataObject from '../ScreenMetadataObject'
import ObjectList from '../../elements/ObjectList';

import logger from '../../../core/Logger';
import ControllerComponent from "../../common/ControllerComponent";

var initialState = {
	activeMenuItem: "scope"
};


@withStyles(styles)
class ScreenMetadataBaseController extends ControllerComponent {

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
		this.state.ui = _.assign(this.state.ui, utils.deepClone(initialState));

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

	//getUrl() {
	//	return path.join(this.props.parentUrl, "metadata/" + this.state.selectorValue); // todo
	// }

	_onStoreResponse(result,responseData,stateHash, instanceId) {
		if (
			(stateHash === this.getStateHash())
			&& (instanceId === this.instance)
		) {
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


	componentDidMount() {
		super.componentDidMount();
		this.responseListener.add(ScopeStore);
		this.responseListener.add(VectorLayerStore);
		this.responseListener.add(RasterLayerStore);
		this.responseListener.add(AULevelStore);
		this.responseListener.add(AttributeSetStore);
		this.responseListener.add(AttributeStore);
		this.responseListener.add(PlaceStore);
		this.responseListener.add(PeriodStore);
		this.responseListener.add(ThemeStore);
		this.responseListener.add(TopicStore);
		this.responseListener.add(LayerGroupStore);
		this.responseListener.add(StyleStore);
	}

	/**
	 * Differentiate between states
	 * - when receiving response for asynchronous action, ensure state has not changed in the meantime
	 */
	updateStateHash() {
		// todo hash influenced by screen/page instance / active screen (unique every time it is active)
		this._stateHash = utils.stringHash("ScreenMetadataObject" + this.state.ui.activeMenuItem);
	}


	onChangeActive(value) {
		this.setUIState({
			activeMenuItem: value
		});
	}

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


	render() {
		let ret = null;

		if(this.state.built) {
			var tabsInsert = [];
			var contentInsert = [];
			for (var tab of this._tabs) {
				var tabElement;
				var contentElement;
				if (tab.header) {
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
							className={this.state.ui.activeMenuItem==tab.key ? 'item active' : 'item'}
							onClick={this.context.onInteraction( this.onChangeActive.bind(this,tab.key) )}
							key={"metadata-tabs-"+tab.key}
						>
							{tab.name}
						</a>
					);
					contentElement = (
						<div
							className={this.state.ui.activeMenuItem==tab.key ? 'items active' : 'items'}
							id={"metadata-items-"+tab.key}
							key={"metadata-items-"+tab.key}
						>
							<ObjectList
								data={this.props.store[tab.data]}
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

			ret = (
				<div>
					<div className="screen-content">
						<div>
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

						</div>
					</div>
				</div>
			);
		}

		return ret;

	}

}

export default ScreenMetadataBaseController;
