import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataObject.css';
import withStyles from '../../../decorators/withStyles';

import path from "path";

import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import ActionCreator from '../../../actions/ActionCreator';

//import PeriodStore from '../../../stores/PeriodStore';
import SelectorMetadataObject from '../../sections/SelectorMetadataObject';
import ConfigMetadataPeriod from '../../sections/ConfigMetadataPeriod';

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
		this.state = initialState;

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

	componentDidMount() {
		if(this.props.data.objectType) {
			this.addChangeListener();
			this.context.setStateFromStores.call(this, this.store2state());
		}
	}

	componentWillUnmount() {
		if(this.props.data.objectType) {
			this.removeChangeListener();
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

	addChangeListener(props) {
		if(!props) {
			props = this.props;
		}
		Store[props.data.objectType].addChangeListener(this._onStoreChange.bind(this));
	}
	removeChangeListener(props) {
		if(!props) {
			props = this.props;
		}
		Store[props.data.objectType].removeChangeListener(this._onStoreChange.bind(this));
	}

	onSelectorChange (value) {
		this.setState({
			selectorValue: value
		});
	}

	onNewEmptyObject () {
		console.log("onNewEmptyObject");
		let objectType = ObjectTypes.PERIOD;
		let model = new Model[objectType]({active:false});
		console.log(model);
		ActionCreator.createObjectAndSetState(model, objectType, "", "");
	}

	render() {

		var configComponent = "";
		var headline = "";
		if (this.props.data.objectType) {
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
					//configComponent = <ConfigMetadataScope {...props} />;
					break;
				case ObjectTypes.PERIOD:
					configComponent = <ConfigMetadataPeriod {...props} />;
					break;
			}
		}


		return (
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
}

export default ScreenMetadataObject;
