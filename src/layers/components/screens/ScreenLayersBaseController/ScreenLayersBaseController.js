import React, { PropTypes, Component } from 'react';
import styles from './ScreenLayersBaseController.css';
import withStyles from '../../../../decorators/withStyles';
import classnames from 'classnames';
import utils from '../../../../utils/utils';

import ControllerComponent from '../../../../components/common/ControllerComponent';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../../constants/ObjectTypes';
import LayerObjectTypes from '../../../constants/ObjectTypes';

import GeonodeStore from '../../../../layers/stores/GeonodeStore';
import WmsStore from '../../../../layers/stores/WmsStore';

import ActionCreator from '../../../../actions/ActionCreator';
import ObjectList from '../../../../components/elements/ObjectList';
import ScreenLayersObject from '../ScreenLayersObject';

@withStyles(styles)
class ScreenLayersBaseController extends ControllerComponent {
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
			{data: "wms", dataType: LayerObjectTypes.WMS_LAYER, allowAdd: true}
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
			component: ScreenLayersObject,
			parentUrl: this.props.parentUrl,
			size: 40,
			data: {
				objectType: itemType,
				objectKey: item.key
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

		console.log("Render: ", this.state.built);
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
							<h1>Layers</h1>

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

export default ScreenLayersBaseController;
