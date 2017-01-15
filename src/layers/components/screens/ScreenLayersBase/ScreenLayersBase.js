import React, { PropTypes, Component } from 'react';
import ScreenController from '../../common/ScreenController';

import withStyle from '../../../decorators/withStyles';
import styles from './ScreenLayersBase.css';

import utils from '../../../utils/utils';

import WmsStore from '../../../stores/WmsStore';
import GeonodeStore from '../../../stores/GeonodeStore';

import ScreenLayersBaseController from '../ScreenLayersBaseController';

@withStyle(styles)
class ScreenPermissionsBase extends ScreenController {
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
			geonode: this._load(GeonodeStore),
			wms: this._load(WmsStore)
		}
	}

	componentDidMount(){
		super.componentDidMount();

		this.changeListener.add(GeonodeStore);
		this.changeListener.add(WmsStore);
	}

	getUrl() {
		return path.join(this.props.parentUrl, "layers/" + this.state.activeMenuItem);
	}

	render() {
		if (this.state.ready && Object.keys(this.state.store).length >= 5) {
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

export default ScreenPermissionsBase;
