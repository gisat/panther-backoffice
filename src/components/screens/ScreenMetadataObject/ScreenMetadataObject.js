import React, { PropTypes, Component } from 'react';
import styles from './ScreenMetadataObject.css';
import withStyles from '../../../decorators/withStyles';

import path from "path";

import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

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
			this.setState({
				objectType: newProps.data.objectType
			});
			this.context.setStateFromStores.call(this, this.store2state(newProps));
		}
	}

	addChangeListener() {
		Store[this.props.data.objectType].addChangeListener(this._onStoreChange.bind(this));
	}
	removeChangeListener() {
		Store[this.props.data.objectType].removeChangeListener(this._onStoreChange.bind(this));
	}

	onSelectorChange (value) {
		this.setState({
			selectorValue: value
		});
	}

	render() {

		var configComponent = "";
		var headline = "";
		if (this.props.data.objectType) {
			headline = objectTypesMetadata[this.props.data.objectType].name;
			if(objectTypesMetadata[this.props.data.objectType].isTemplate) {
				headline = headline + " (template)";
			}

			switch (this.props.data.objectType) {
				case ObjectTypes.SCOPE:
					//configComponent = (
					//	<ConfigMetadataScope
					//		disabled={this.props.disabled}
					//		selectorValue={this.state.selectorValue}
					//		parentUrl={this.getUrl()}
					//	/>
					//);
					break;
				case ObjectTypes.PERIOD:
					configComponent = (
						<ConfigMetadataPeriod
							disabled={this.props.disabled}
							selectorValue={this.state.selectorValue}
							parentUrl={this.getUrl()}
						/>
					);
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
