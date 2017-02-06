import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../../../components/common/ControllerComponent';

import withStyles from '../../../../decorators/withStyles';
import styles from './ScreenLayersObjectController.css';

import utils from '../../../../utils/utils';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';
import LayerObjectTypes from '../../../constants/ObjectTypes';
import ActionCreator from '../../../../actions/ActionCreator';

import SelectorMetadataObject from '../../../../components/sections/SelectorMetadataObject';

import ConfigGeonodeLayer from '../../sections/ConfigGeonodeLayer';
import ConfigWmsLayer from '../../sections/ConfigWmsLayer';

import logger from '../../../../core/Logger';

let initialState = {
	selectorValue: null
};

@withStyles(styles)
class ScreenLayersObjectController extends ControllerComponent {
	constructor(props) {
		super(props);
		this.state.ui = _.assign(this.state.ui, utils.deepClone(initialState));

		if(this.props.data && this.props.data.objectKey) {
			this.state.ui.selectorValue = this.props.data.objectKey;
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
	}

	addListeners(props) {
		if(!props) {
			props = this.props;
		}
		this.responseListener.add(Store[props.data.objectType]);
	}

	removeListeners() {
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
				store: this.props.store,
				screenKey: this.props.screenKey
			};
			switch (this.props.data.objectType) {
				case ObjectTypes.GEONODE_LAYER:
					configComponent = <ConfigGeonodeLayer {...props} />;
					selectorData = this.props.store.geonode;
					break;
				case ObjectTypes.WMS_LAYER:
					configComponent = <ConfigWmsLayer {...props} />;
					selectorData = this.props.store.wms;
					break;
			}

			ret = (
				<div>
					<div className="screen-setter"><div>
						<div className="screen-setter-section">{headline}</div>
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

export default ScreenLayersObjectController;
