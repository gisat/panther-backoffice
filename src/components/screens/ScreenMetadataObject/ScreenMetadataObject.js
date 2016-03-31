import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataObject.css';
import withStyles from '../../../decorators/withStyles';

import path from "path";

import utils from '../../../utils/utils';
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
	selectorValue: null
};


@withStyles(styles)
class ScreenMetadataObject extends Component{

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		if(this.props.data && this.props.data.objectType) {
			this.state.objectType = this.props.data.objectType;
		}
		if(this.props.data && this.props.data.objectKey) {
			this.state.selectorValue = this.props.data.objectKey;
		}
	}

	getUrl() {
		return path.join(this.props.parentUrl, "metadata/" + this.state.selectorValue); // todo
	}

	store2state(props) {
		if (!props) {
			props = this.props;
		}
		return {
			selectorData: Store[props.data.objectType].getAll()
		};
	}

	_onStoreChange() {
		this.context.setStateFromStores.call(this, this.store2state());
	}

	_onStoreResponse(result,responseData,stateHash) {
		if (stateHash === this.getStateHash()) {
			if (result) {
				this.setState({
					selectorValue: result[0].key
				});
			}
		}
	}

	componentDidMount() {
		if(this.props.data.objectType) {
			this.addListeners();
			this.context.setStateFromStores.call(this, this.store2state());
		}
	}

	componentWillUnmount() {
		if(this.props.data.objectType) {
			this.removeListeners();
		}
	}

	componentWillReceiveProps(newProps) {
		if(this.props.data.objectKey != newProps.data.objectKey) {
			this.setState({
				selectorValue: newProps.data.objectKey
			});
		}
		if(this.props.data.objectType != newProps.data.objectType) {
			this.removeChangeListener();
			this.addChangeListener(newProps);
			this.setState({
				objectType: newProps.data.objectType
			});
			this.context.setStateFromStores.call(this, this.store2state(newProps));
		}
	}

	addListeners(props) {
		if(!props) {
			props = this.props;
		}
		Store[props.data.objectType].addChangeListener(this._onStoreChange.bind(this));
		Store[props.data.objectType].addResponseListener(this._onStoreResponse.bind(this));
	}
	removeListeners(props) {
		if(!props) {
			props = this.props;
		}
		Store[props.data.objectType].removeChangeListener(this._onStoreChange.bind(this));
		Store[props.data.objectType].removeResponseListener(this._onStoreResponse.bind(this));
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
		this._stateHash = utils.stringHash(state.selectorValue);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}


	onSelectorChange (value) {
		this.setState({
			selectorValue: value
		});
	}

	onNewEmptyObject () {
		console.log("onNewEmptyObject");
		let objectType = this.props.data.objectType;
		let model = new Model[objectType]({active:false});
		console.log(model);
		ActionCreator.createObjectAndRespond(model, objectType, {}, this.getStateHash());
	}

	render() {

		let ret = null;
		var configComponent = "";
		var headline = "";
		if (this.props.data.objectType && this.state.selectorData) {
			headline = objectTypesMetadata[this.props.data.objectType].name;
			if(objectTypesMetadata[this.props.data.objectType].isTemplate) {
				headline = headline + " (template)";
			}

			var props = {
				disabled: this.props.disabled,
				selectorValue: this.state.selectorValue,
				parentUrl: this.getUrl()
			};
			switch (this.props.data.objectType) {
				case ObjectTypes.SCOPE:
					configComponent = <ConfigMetadataScope {...props} />;
					break;
				case ObjectTypes.PLACE:
					configComponent = <ConfigMetadataPlace {...props} />;
					break;
				case ObjectTypes.PERIOD:
					configComponent = <ConfigMetadataPeriod {...props} />;
					break;
				case ObjectTypes.VECTOR_LAYER_TEMPLATE:
					configComponent = <ConfigMetadataLayerVector {...props} />;
					break;
				case ObjectTypes.RASTER_LAYER_TEMPLATE:
					configComponent = <ConfigMetadataLayerRaster {...props} />;
					break;
				case ObjectTypes.AU_LEVEL:
					configComponent = <ConfigMetadataAULevel {...props} />;
					break;
				case ObjectTypes.ATTRIBUTE:
					configComponent = <ConfigMetadataAttribute {...props} />;
					break;
				case ObjectTypes.ATTRIBUTE_SET:
					configComponent = <ConfigMetadataAttributeSet {...props} />;
					break;
				case ObjectTypes.TOPIC:
					configComponent = <ConfigMetadataTopic {...props} />;
					break;
				case ObjectTypes.THEME:
					configComponent = <ConfigMetadataTheme {...props} />;
					break;
				case ObjectTypes.LAYER_GROUP:
					configComponent = <ConfigMetadataLayerGroup {...props} />;
					break;
				case ObjectTypes.STYLE:
					configComponent = <ConfigMetadataStyle {...props} />;
					break;
			}

			ret = (
				<div>
					<div className="screen-setter"><div>
						<h2>{headline}</h2>
						<SelectorMetadataObject
							disabled={this.props.disabled}
							data={this.state.selectorData}
							value={this.state.selectorValue}
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

export default ScreenMetadataObject;
