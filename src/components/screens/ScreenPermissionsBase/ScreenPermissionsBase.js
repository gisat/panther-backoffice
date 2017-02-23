import React, { PropTypes, Component } from 'react';
import ScreenController from '../../common/ScreenController';

import withStyle from '../../../decorators/withStyles';
import styles from './ScreenPermissionsBase.css';

import utils from '../../../utils/utils';

import UserStore from '../../../stores/UserStore';
import GroupStore from '../../../stores/GroupStore';
import ScopeStore from '../../../stores/ScopeStore';
import PlaceStore from '../../../stores/PlaceStore';
import TopicStore from '../../../stores/TopicStore';
import GeonodeStore from '../../../layers/stores/GeonodeStore';
import WmsStore from '../../../layers/stores/WmsStore';

import Loader from '../../atoms/Loader';

import ScreenPermissionsBaseController from '../ScreenPermissionsBaseController';

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
			scopes: this._load(ScopeStore),
			places: this._load(PlaceStore),
			topics: this._load(TopicStore),
			users: this._load(UserStore),
			groups: this._load(GroupStore),
			wms_layers: this._load(WmsStore)
		}
	}

	componentDidMount(){
		super.componentDidMount();

		this.changeListener.add(ScopeStore, ["scopes"]);
		this.changeListener.add(PlaceStore, ["places"]);
		this.changeListener.add(TopicStore, ["topics"]);
		this.changeListener.add(UserStore, ["users"]);
		this.changeListener.add(GroupStore, ["groups"]);
		this.changeListener.add(WmsStore, ["wms_layers"]);
	}

	getUrl() {
		return path.join(this.props.parentUrl, "permissions/" + this.state.activeMenuItem);
	}

	render() {
		if (this.state.ready && Object.keys(this.state.store).length >= 5) {
			let props = utils.clone(this.props);
			props.store = this.state.store;
			return React.createElement(ScreenPermissionsBaseController, props);
		} else {
			return (
				<div className="component-loading">
					<Loader />
				</div>
			);
		}
	}
}

export default ScreenPermissionsBase;
