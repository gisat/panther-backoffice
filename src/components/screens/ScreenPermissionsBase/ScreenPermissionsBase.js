import ScreenController from '../../common/ScreenController';
import styles from './ScreenPermissionsBase.css';
import withStyle from '../../../decorators/withStyles';

import UserStore from '../../../stores/UserStore';
import GroupStore from '../../../stores/GroupStore';
import ScopeStore from '../../../stores/ScopeStore';
import PlaceStore from '../../../stores/PlaceStore';
import TopicStore from '../../../stores/TopicStore';

@withStyle(styles)
class ScreenPermissionsBase extends ScreenController {
	_getStoreLoads(){
		return {
			scopes: this._load(ScopeStore),
			places: this._load(PlaceStore),
			topics: this._load(TopicStore),
			users: this._load(UserStore),
			groups: this._load(GroupStore)
		}
	}

	componentDidMount(){
		super.componentDidMount();

		this.changeListener.add(ScopeStore, ["scopes"]);
		this.changeListener.add(PlaceStore, ["places"]);
		this.changeListener.add(TopicStore, ["topics"]);
		this.changeListener.add(UserStore, ["users"]);
		this.changeListener.add(GroupStore, ["groups"]);
	}

	render() {
		return (
			<div></div>
		)
	}
}

export default ScreenPermissionsBase;
