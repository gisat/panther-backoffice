import React, { PropTypes, Component } from 'react';
import ControllerComponent from '../../common/ControllerComponent';

import withStyles from '../../../decorators/withStyles';
import styles from './ScreenPermissionsObjectController.css';

import utils from '../../../utils/utils';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';

import SelectorMetadataObject from '../../sections/SelectorMetadataObject';

import ConfigPermissionsUser from '../../sections/ConfigPermissionsUser';
import ConfigPermissionsPlace from '../../sections/ConfigPermissionsPlace';
import ConfigPermissionsTopic from '../../sections/ConfigPermissionsTopic';
import ConfigPermissionsScope from '../../sections/ConfigPermissionsScope';
import ConfigPermissionsGroup from '../../sections/ConfigPermissionsGroup';

import logger from '../../../core/Logger';

let initialState = {
	selectorValue: null
};

@withStyles(styles)
class ScreenPermissionsObjectController extends ControllerComponent {
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
				case ObjectTypes.SCOPE:
					configComponent = <ConfigPermissionsScope {...props} />;
					selectorData = this.props.store.scopes;
					break;
				case ObjectTypes.PLACE:
					configComponent = <ConfigPermissionsPlace {...props} />;
					selectorData = this.props.store.places;
					break;
				case ObjectTypes.TOPIC:
					configComponent = <ConfigPermissionsTopic {...props} />;
					selectorData = this.props.store.topics;
					break;
				case ObjectTypes.USER:
					configComponent = <ConfigPermissionsUser {...props} />;
					selectorData = this.props.store.users;
					break;
				case ObjectTypes.GROUP:
					configComponent = <ConfigPermissionsGroup {...props} />;
					selectorData = this.props.store.groups;
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

export default ScreenPermissionsObjectController;
