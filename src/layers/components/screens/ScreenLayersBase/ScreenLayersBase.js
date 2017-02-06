import React, { PropTypes, Component } from 'react';
import ScreenController from '../../../../components/common/ScreenController';

import withStyle from '../../../../decorators/withStyles';
import styles from './ScreenLayersBase.css';

import utils from '../../../../utils/utils';

import WmsStore from '../../../stores/WmsStore';
import GeonodeStore from '../../../stores/GeonodeStore';
import ScopeStore from '../../../../stores/ScopeStore';
import PlaceStore from '../../../../stores/PlaceStore';
import PeriodStore from '../../../../stores/PeriodStore';

import ScreenLayersBaseController from '../ScreenLayersBaseController';

@withStyle(styles)
class ScreenLayersBase extends ScreenController {
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

	_getStoreLoads(){
		return {
			periods: this._load(PeriodStore),
			scopes: this._load(ScopeStore),
			places: this._load(PlaceStore),
			wms: this._load(WmsStore)
		}
	}

	componentDidMount(){
		super.componentDidMount();

		this.changeListener.add(WmsStore);
	}

	getUrl() {
		return path.join(this.props.parentUrl, "layers/" + this.state.activeMenuItem);
	}

	render() {
		if (this.state.ready && Object.keys(this.state.store).length >= 4) {
			let props = utils.clone(this.props);
			props.store = this.state.store;
			return React.createElement(ScreenLayersBaseController, props);
		} else {
			return (
				<div className="component-loading"></div>
			);
		}
	}
}

export default ScreenLayersBase;
