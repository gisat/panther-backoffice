import React, { PropTypes, Component } from 'react';
import styles from './ScreenPermissionsBaseController.css';
import withStyles from '../../../decorators/withStyles';
import classnames from 'classnames';
import utils from '../../../utils/utils';

import ControllerComponent from '../../common/ControllerComponent';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';
import LayerObjectTypes from '../../../layers/constants/ObjectTypes';

import UserStore from '../../../stores/UserStore';
import GroupStore from '../../../stores/GroupStore';
import ScopeStore from '../../../stores/ScopeStore';
import PlaceStore from '../../../stores/PlaceStore';
import TopicStore from '../../../stores/TopicStore';
import GeonodeStore from '../../../layers/stores/GeonodeStore';
import WmsStore from '../../../layers/stores/WmsStore';

import ActionCreator from '../../../actions/ActionCreator';
import ObjectList from '../../elements/ObjectList';
import ScreenPermissionsObject from '../ScreenPermissionsObject';
import Invitation from "../../elements/Invitation/Invitation";

@withStyles(styles)
class ScreenPermissionsBaseController extends ControllerComponent {
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

		this._tabs = [
			{data: "places", dataType: ObjectTypes.PLACE, allowAdd: false},
			{data: "scopes", dataType: ObjectTypes.SCOPE, allowAdd: false},
			{data: "topics", dataType: ObjectTypes.TOPIC, allowAdd: false},
			{data: "wms_layers", dataType: LayerObjectTypes.WMS_LAYER, allowAdd: false},
			{data: "users", dataType: ObjectTypes.USER, allowAdd: false},
			{data: "groups", dataType: ObjectTypes.GROUP, allowAdd: true}
		];
		for (let tab of this._tabs) {
			if(!tab.header) {
				tab.key = objectTypesMetadata[tab.dataType].url;
				tab.name = objectTypesMetadata[tab.dataType].name;
				if(objectTypesMetadata[tab.dataType].isTemplate) {
					tab.isTemplate = true;
				}
			}
		}
	}

	componentDidMount(){
		super.componentDidMount();

		this.responseListener.add(ScopeStore);
		this.responseListener.add(PlaceStore);
		this.responseListener.add(TopicStore);
		this.responseListener.add(UserStore);
		this.responseListener.add(GroupStore);
		this.responseListener.add(GeonodeStore);
		this.responseListener.add(WmsStore);
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
			component: ScreenPermissionsObject,
			parentUrl: this.props.parentUrl,
			size: 40,
			data: {
				objectType: itemType,
				objectKey:item.key
			}
		};
		ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
	}

	onObjectListAddClick(itemType, event) {
		// TODO: Update actions related to the User and Group other than permission handling.
		this.context.onInteraction().call();
		let model = new Model[itemType]();
		let responseData = {
			objectType: itemType
		};
		ActionCreator.createObjectAndRespond(model,itemType,responseData,this.getStateHash(),this.instance);
	}

	/**
	 * Differentiate between states
	 * - when receiving response for asynchronous action, ensure state has not changed in the meantime
	 */
	updateStateHash() {
		// todo hash influenced by screen/page instance / active screen (unique every time it is active)
		this._stateHash = utils.stringHash("ScreenMetadataObject" + this.state.ui.activeMenuItem);
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
							key={"metadata-tabs-" + tab.key}
						>
							{tab.name}
						</a>
					);
					contentElement = "";
				} else {
					tabElement = (
						<a
							className={this.state.ui.activeMenuItem == tab.key ? 'item active' : 'item'}
							onClick={this.context.onInteraction(this.onChangeActive.bind(this, tab.key))}
							key={"metadata-tabs-" + tab.key}
						>
							{tab.name}
						</a>
					);
					contentElement = (
						<div
							className={this.state.ui.activeMenuItem == tab.key ? 'items active' : 'items'}
							id={"metadata-items-" + tab.key}
							key={"metadata-items-" + tab.key}
						>
							<ObjectList
								data={this.props.store[tab.data]}
								allowAdd = {tab.allowAdd}
								onItemClick={this.onObjectListItemClick.bind(this, tab.dataType)}
								onAddClick={this.onObjectListAddClick.bind(this, tab.dataType)}
								itemClasses={classnames({'template': tab.isTemplate})}
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
							<h1>Permissions</h1>

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

						<Invitation />
					</div>
				</div>
			);
		}

		return ret;
	}
}

export default ScreenPermissionsBaseController;
