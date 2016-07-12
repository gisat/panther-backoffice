import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataObjectController.css';
import withStyles from '../../../decorators/withStyles';

import path from "path";

import utils from '../../../utils/utils';
import _ from 'underscore';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import ActionCreator from '../../../actions/ActionCreator';

//import PeriodStore from '../../../stores/PeriodStore';
import SelectorMetadataObject from '../../sections/SelectorMetadataObject';
import ConfigMetadataScope from '../../sections/ConfigMetadataScope';
import ConfigMetadataPlace from '../../sections/ConfigMetadataPlace';
import ConfigMetadataPeriod from '../../sections/ConfigMetadataPeriod';
import ConfigMetadataLayerVector from '../../sections/ConfigMetadataLayerVector';
import ConfigMetadataLayerRaster from '../../sections/ConfigMetadataLayerRaster';
import ConfigMetadataAULevel from '../../sections/ConfigMetadataAULevel';
import ConfigMetadataAttribute from '../../sections/ConfigMetadataAttribute';
import ConfigMetadataAttributeSet from '../../sections/ConfigMetadataAttributeSet';
import ConfigMetadataTopic from '../../sections/ConfigMetadataTopic';
import ConfigMetadataTheme from '../../sections/ConfigMetadataTheme';
import ConfigMetadataLayerGroup from '../../sections/ConfigMetadataLayerGroup';
import ConfigMetadataStyle from '../../sections/ConfigMetadataStyle';
import ListenerHandler from '../../../core/ListenerHandler';

import logger from '../../../core/Logger';
import ControllerComponent from "../../common/ControllerComponent";

var initialState = {
	selectorValue: null
};


@withStyles(styles)
class ScreenMetadataObjectController extends ControllerComponent {

	constructor(props) {
		super(props);
		this.state.ui = _.assign(this.state.ui, utils.deepClone(initialState));

		if(this.props.data && this.props.data.objectKey) {
			this.state.ui.selectorValue = this.props.data.objectKey;
		}
	}

	//getUrl() {
	//	return path.join(this.props.parentUrl, "metadata/" + this.state.selectorValue); // todo
	//}


	_onStoreResponse(result,responseData,stateHash) {
		if (stateHash === this.getStateHash()) {
			if (result && this.mounted) {
				this.setUIState({
					selectorValue: result[0].key
				});
			}
		}
	}

	componentDidMount() {
		super.componentDidMount();

		if(this.props.data.objectType) {
			this.addListeners();
		}
	}

	componentWillReceiveProps(newProps) {
		if(this.props.data.objectKey != newProps.data.objectKey) {
			this.setUIState({
				selectorValue: newProps.data.objectKey
			});
		}
		if(this.props.data.objectType != newProps.data.objectType) {
			this.removeListeners();
			this.addListeners(newProps);
		}
		super.componentWillReceiveProps(newProps);
	}

	addListeners(props) {
		if(!props) {
			props = this.props;
		}
		//this.changeListener.add(Store[props.data.objectType]);
		this.responseListener.add(Store[props.data.objectType]);
	}
	removeListeners() {
		//this.changeListener.clean();
		this.responseListener.clean();
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
		this._stateHash = utils.stringHash("ScreenMetadataObject" + state.ui.selectorValue);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}


	onSelectorChange (value) {
		this.setUIState({
			selectorValue: value
		});
	}

	onNewEmptyObject () {
		let objectType = this.props.data.objectType;
		let model = new Model[objectType]({active:false});
		logger.trace("ScreenMetadataObject# onNewEmptyObject(), Model: ", model);
		ActionCreator.createObjectAndRespond(model, objectType, {}, this.getStateHash());
	}

	render() {

		let ret = null;
		var configComponent = "";
		var selectorData = {};
		var headline = "";
		if (this.props.data.objectType) {
			headline = objectTypesMetadata[this.props.data.objectType].name;
			if(objectTypesMetadata[this.props.data.objectType].isTemplate) {
				headline = headline + " (template)";
			}

			var props = {
				disabled: this.props.disabled,
				selectorValue: this.state.ui.selectorValue,
				store: this.props.store
				//parentUrl: this.getUrl()
			};
			switch (this.props.data.objectType) {
				case ObjectTypes.SCOPE:
					configComponent = <ConfigMetadataScope {...props} />;
					selectorData = this.props.store.scopes;
					break;
				case ObjectTypes.PLACE:
					configComponent = <ConfigMetadataPlace {...props} />;
					selectorData = this.props.store.places;
					break;
				case ObjectTypes.PERIOD:
					configComponent = <ConfigMetadataPeriod {...props} />;
					selectorData = this.props.store.periods;
					break;
				case ObjectTypes.VECTOR_LAYER_TEMPLATE:
					configComponent = <ConfigMetadataLayerVector {...props} />;
					selectorData = this.props.store.layers;
					break;
				case ObjectTypes.RASTER_LAYER_TEMPLATE:
					configComponent = <ConfigMetadataLayerRaster {...props} />;
					selectorData = this.props.store.layers;
					break;
				case ObjectTypes.AU_LEVEL:
					configComponent = <ConfigMetadataAULevel {...props} />;
					selectorData = this.props.store.layers;
					break;
				case ObjectTypes.ATTRIBUTE:
					configComponent = <ConfigMetadataAttribute {...props} />;
					selectorData = this.props.store.attributes;
					break;
				case ObjectTypes.ATTRIBUTE_SET:
					configComponent = <ConfigMetadataAttributeSet {...props} />;
					selectorData = this.props.store.attributeSets;
					break;
				case ObjectTypes.TOPIC:
					configComponent = <ConfigMetadataTopic {...props} />;
					selectorData = this.props.store.topics;
					break;
				case ObjectTypes.THEME:
					configComponent = <ConfigMetadataTheme {...props} />;
					selectorData = this.props.store.themes;
					break;
				case ObjectTypes.LAYER_GROUP:
					configComponent = <ConfigMetadataLayerGroup {...props} />;
					selectorData = this.props.store.layerGroups;
					break;
				case ObjectTypes.STYLE:
					configComponent = <ConfigMetadataStyle {...props} />;
					selectorData = this.props.store.styles;
					break;
			}

			ret = (
				<div>
					<div className="screen-setter"><div>
						<h2>{headline}</h2>
						<SelectorMetadataObject
							disabled={this.props.disabled}
							data={selectorData}
							value={this.state.ui.selectorValue}
							onChange={this.onSelectorChange.bind(this)}
							onNew={this.onNewEmptyObject.bind(this)}
						/>
					</div></div>
					<div className="screen-content"><div>
						{configComponent}
					</div></div>
				</div>
			);

		}


		return ret;

	}
}

export default ScreenMetadataObjectController;
