import React, { PropTypes, Component } from 'react';
import styles from './ConfigPlaceDataSource.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';
import utils from '../../../utils/utils';

import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import ConfigPlaceDataSourcePeriod from '../ConfigPlaceDataSourcePeriod';

import PlaceStore from '../../../stores/PlaceStore';
import GeneralLayerStore from '../../../stores/GeneralLayerStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import AULevelStore from '../../../stores/AULevelStore';

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';

var initialState = {
	place: null,
	layer: null,
	attSet: null,
	auLevel: null
};


@withStyles(styles)
class ConfigPlaceDataSource extends Component {

	static propTypes = {
		disabled: PropTypes.bool,
		screenKey: PropTypes.string,
		relationsContext: PropTypes.string.isRequired,
		selectorValuePlace: PropTypes.number,
		selectorValueAttSet: PropTypes.number,
		selectorValueAULevel: PropTypes.number,
		selectorValueLayer: PropTypes.number
};

	static defaultProps = {
		disabled: false,
		selectorValuePlace: null,
		selectorValueAttSet: null,
		selectorValueAULevel: null,
		selectorValueLayer: null
	};

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
	}

	store2state(props) {
		return {
			place: PlaceStore.getById(props.selectorValuePlace),
			layer: GeneralLayerStore.getById(props.selectorValueLayer),
			attSet: AttributeSetStore.getById(props.selectorValueAttSet),
			auLevel: AULevelStore.getById(props.selectorValueAULevel)
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		let condition = false;
		switch(props.relationsContext) {
			case "AttSet":
				condition = (
					props.selectorValuePlace &&
					props.selectorValueAttSet &&
					props.selectorValueAULevel
				);
				break;
			case "Vector":
			case "Raster":
				condition = (
					props.selectorValuePlace &&
					props.selectorValueLayer
				);
				break;
			case "VectorAttSet":
				condition = (
					props.selectorValuePlace &&
					props.selectorValueLayer &&
					props.selectorValueAttSet || props.valueAttSet == null
				);
				break;
		}
		if(condition) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			let setStatePromise = this.context.setStateFromStores.call(this, store2state, keys);

			setStatePromise.then(function () {
				let periods2state = {
					scopePeriods: utils.getPeriodsForScope(thisComponent.state.place.scope)
				};
				thisComponent.context.setStateFromStores.call(thisComponent, periods2state);
			});
		}
	}

	_onStoreChange(keys) {
		logger.trace("ConfigPlaceDataSource# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() { this.mounted = true;
		this.changeListener.add(PlaceStore, ["place"]);
		this.changeListener.add(AttributeSetStore, ["attSet"]);
		this.changeListener.add(AULevelStore, ["auLevel"]);

		this.setStateFromStores();
	}

	componentWillUnmount() { this.mounted = false;
		this.changeListener.clean();
	}

	componentWillReceiveProps(newProps) {
		if(
			(newProps.selectorValuePlace!=this.props.selectorValuePlace) ||
			(newProps.selectorValueAttSet!=this.props.selectorValueAttSet) ||
			(newProps.selectorValueAULevel!=this.props.selectorValueAULevel)
		) {
			this.setStateFromStores(newProps);
		}
	}

	stateCondition() {
		let condition = false;
		switch(this.props.relationsContext) {
			case "AttSet":
				condition = (
					this.state.place &&
					this.state.attSet &&
					this.state.auLevel &&
					this.state.scopePeriods
				);
				break;
			case "Vector":
				condition = (
					this.state.place &&
					this.state.layer &&
					this.state.scopePeriods
				);
				break;
			case "VectorAttSet":
				condition = (
					this.state.place &&
					this.state.layer &&
					this.state.attSet &&
					this.state.scopePeriods
				);
				break;
			case "Raster":
				condition = (
					this.state.place &&
					this.state.layer &&
					this.state.scopePeriods
				);
				break;
		}
		return condition;
	}


	render() {

		var ret = null;
		if(this.stateCondition()) {

			let configComponentProps = {
				disabled: this.props.disabled,
				screenKey: this.props.screenKey,
				parentUrl: this.props.parentUrl,
				relationsContext: this.props.relationsContext,
				place: this.props.selectorValuePlace
			};
			switch (this.props.relationsContext) {
				case "AttSet":
					_.assign(configComponentProps,{
						attributeSet: this.props.selectorValueAttSet,
						auLevel: this.props.selectorValueAULevel
					});
					break;
				case "Vector":
					_.assign(configComponentProps,{
						vectorLayer: this.props.selectorValueLayer
					});
					break;
				case "VectorAttSet":
				_.assign(configComponentProps,{
					attributeSet: this.props.selectorValueAttSet,
					vectorLayer: this.props.selectorValueLayer
				});
				break;
				case "Raster":
					_.assign(configComponentProps,{
						rasterLayer: this.props.selectorValueLayer
					});
					break;
			}

			let configComponentsInsert = [];

			for (let scopePeriod of this.state.scopePeriods.models) {
				let props = _.assign({},configComponentProps);
				props.period = scopePeriod.key;
				props.key = scopePeriod.key;
				configComponentsInsert.push(
					<ConfigPlaceDataSourcePeriod {...props}	/>
				);
			}

			ret = (
				<div>
					{configComponentsInsert}
				</div>
			);

		} else {
			ret = (
				<div>

				</div>
			);
		}


		return ret;

	}
}

export default ConfigPlaceDataSource;
