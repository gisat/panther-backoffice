import React, { PropTypes, Component } from 'react';
import ScreenController from '../../../../components/common/ScreenController';

import withStyles from '../../../../decorators/withStyles';
import styles from './ScreenLayersObject.css';

import utils from '../../../../utils/utils';
import ObjectTypes, {Store} from '../../../constants/ObjectTypes';


import ScopeStore from '../../../../stores/ScopeStore';
import PlaceStore from '../../../../stores/PlaceStore';
import PeriodStore from '../../../../stores/PeriodStore';
import GeonodeStore from '../../../stores/GeonodeStore';
import WmsStore from '../../../stores/WmsStore';

import Loader from '../../../../components/atoms/Loader';

import ScreenLayersObjectController from '../ScreenLayersObjectController';

@withStyles(styles)
class ScreenLayersObject extends ScreenController {
	_getStoreLoads(props) {
		let storeloads = {};
		switch (props.data.objectType) {
			case ObjectTypes.WMS_LAYER:
				storeloads = {
					places: this._load(PlaceStore),
					scopes: this._load(ScopeStore),
					periods: this._load(PeriodStore),
					layers: this._load(WmsStore)
				};
				break;
		}
		storeloads.selectorData = this._load(Store[props.data.objectType]);
		return storeloads;
	}

	componentDidMount() {
		super.componentDidMount();

		if(this.props.data.objectType) {
			this.addListeners();
		}
	}

	addListeners(props) {
		if(!props) {
			props = this.props;
		}
		this.changeListener.add(Store[props.data.objectType]);
	}

	removeListeners() {
		this.changeListener.clean();
	}

	render() {

		if (this.state.ready) {
			let props = utils.clone(this.props);
			//let props = {};
			props.store = this.state.store;
			return React.createElement(ScreenLayersObjectController, props);
		}
		else {
			return (
				<div className="component-loading">
					<Loader />
				</div>
			);
		}

	}
}

export default ScreenLayersObject;
