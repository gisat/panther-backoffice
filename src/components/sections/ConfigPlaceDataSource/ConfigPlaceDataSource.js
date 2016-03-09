import React, { PropTypes, Component } from 'react';
import styles from './ConfigPlaceDataSource.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';
import utils from '../../../utils/utils';

import ConfigPlaceDataSourcePeriod from '../ConfigPlaceDataSourcePeriod';

import PlaceStore from '../../../stores/PlaceStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import AULevelStore from '../../../stores/AULevelStore';

var initialState = {
	place: null,
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
		selectorValueVectorLayer: PropTypes.number,
		selectorValueRasterLayer: PropTypes.number
};

	static defaultProps = {
		disabled: false,
		selectorValuePlace: null,
		selectorValueAttSet: null,
		selectorValueAULevel: null,
		selectorValueVectorLayer: null,
		selectorValueRasterLayer: null
	};

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		onSetScreenData: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}

	store2state(props) {
		return {
			place: PlaceStore.getById(props.selectorValuePlace),
			attSet: AttributeSetStore.getById(props.selectorValueAttSet),
			auLevel: AULevelStore.getById(props.selectorValueAULevel)
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(
			props.selectorValuePlace &&
			props.selectorValueAttSet &&
			props.selectorValueAULevel
		) {
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
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		PlaceStore.addChangeListener(this._onStoreChange.bind(this,["place"]));
		AttributeSetStore.addChangeListener(this._onStoreChange.bind(this,["attSet"]));
		AULevelStore.addChangeListener(this._onStoreChange.bind(this,["auLevel"]));
		this.setStateFromStores();
	}

	componentWillUnmount() {
		PlaceStore.removeChangeListener(this._onStoreChange.bind(this,["place"]));
		AttributeSetStore.removeChangeListener(this._onStoreChange.bind(this,["attSet"]));
		AULevelStore.removeChangeListener(this._onStoreChange.bind(this,["auLevel"]));
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


	render() {

		var ret = null;
		if(
			this.state.place &&
			this.state.attSet &&
			this.state.auLevel &&
			this.state.scopePeriods
		) {

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
						vectorLayer: this.props.selectorValueVectorLayer
					});
					break;
				case "VectorAttSet":
				_.assign(configComponentProps,{
					attributeSet: this.props.selectorValueAttSet,
					vectorLayer: this.props.selectorValueVectorLayer
				});
				break;
				case "Raster":
					_.assign(configComponentProps,{
						rasterLayer: this.props.selectorValueRasterLayer
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
