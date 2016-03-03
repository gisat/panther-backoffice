import React, { PropTypes, Component } from 'react';
import styles from './ScreenPlaceDataSourceAttSet.css';
import withStyles from '../../../decorators/withStyles';

import path from "path";

import utils from '../../../utils/utils';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import ActionCreator from '../../../actions/ActionCreator';
import AULevelStore from '../../../stores/AULevelStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import PlaceStore from '../../../stores/PlaceStore';

import SelectorPlaceAttSetAULevel from '../../sections/SelectorPlaceAttSetAULevel';
import ConfigPlaceDataSource from '../../sections/ConfigPlaceDataSource';

var initialState = {
	places: [],
	attributeSets: [],
	auLevels: [],
	selectorValuePlace: null,
	selectorValueAttSet: null,
	selectorValueAULevel: null
};


@withStyles(styles)
class ScreenPlaceDataSourceAttSet extends Component {

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		if(this.props.data) {
			if (this.props.data.placeKey) {
				this.state.selectorValuePlace = this.props.data.placeKey;
			}
			if (this.props.data.attSetKey) {
				this.state.selectorValueAttSet = this.props.data.attSetKey;
			}
			if (this.props.data.auLevelKey) {
				this.state.selectorValueAULevel = this.props.data.auLevelKey;
			}
		}
	}

	getUrl() {
		return path.join(this.props.parentUrl, "links/" + this.state.selectorValuePlace + "-" + this.state.selectorValueAttSet + "-" + this.state.selectorValueAULevel); // todo
	}

	store2state(props) {
		if (!props) {
			props = this.props;
		}
		return {
			places: PlaceStore.getAll(),
			attributeSets: AttributeSetStore.getAll(),
			auLevels: AULevelStore.getAll()
		};
	}

	_onStoreChange(keys) {
		this.context.setStateFromStores.call(this, this.store2state(), keys);
	}

	componentDidMount() {
		PlaceStore.addChangeListener(this._onStoreChange.bind(this,["places"]));
		AttributeSetStore.addChangeListener(this._onStoreChange.bind(this,["attributeSets"]));
		AULevelStore.addChangeListener(this._onStoreChange.bind(this,["auLevels"]));
		this.context.setStateFromStores.call(this, this.store2state());
	}

	componentWillUnmount() {
		PlaceStore.removeChangeListener(this._onStoreChange.bind(this,["places"]));
		AttributeSetStore.removeChangeListener(this._onStoreChange.bind(this,["attributeSets"]));
		AULevelStore.removeChangeListener(this._onStoreChange.bind(this,["auLevels"]));
	}

	componentWillReceiveProps(newProps) {
		if(newProps.data.placeKey && (this.props.data.placeKey != newProps.data.placeKey)) {
			this.setState({
				selectorValuePlace: newProps.data.placeKey
			});
		}
		if(newProps.data.attSetKey && (this.props.data.attSetKey != newProps.data.attSetKey)) {
			this.setState({
				selectorValueAttSet: newProps.data.attSetKey
			});
		}
		if(newProps.data.auLevelKey && (this.props.data.auLevelKey != newProps.data.auLevelKey)) {
			this.setState({
				selectorValueAULevel: newProps.data.auLevelKey
			});
		}
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
		this._stateHash = utils.stringHash(state.selectorValuePlace + state.selectorValueAttSet + state.selectorValueAULevel);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}


	onSelectorChange (select, value) {
		var stateKey;
		switch(select) {
			case "place":
				stateKey = "selectorValuePlace";
				break;
			case "attSet":
				stateKey = "selectorValueAttSet";
				break;
			case "auLevel":
				stateKey = "selectorValueAULevel";
				break;
		}
		if(stateKey) {
			this.setState({
				[stateKey]: value
			});
		}
	}

	render() {

		var selectorData = utils.deepClone(this.state.places);
		selectorData.sort(function(a, b) {
			if(!a.scope && b.scope) return 1;
			if(a.scope && !b.scope) return -1;
			if(a.key > b.key) return 1;
			if(a.key < b.key) return -1;
			return 0;
		});

		return (
			<div>
				<div className="screen-setter"><div>
					<h2>Data source selection</h2>
					<SelectorPlaceAttSetAULevel
						disabled={this.props.disabled}
						dataPlace={selectorData}
						dataAttSet={this.state.attributeSets} // todo filter by scope of selected place
						dataAULevel={this.state.auLevels} // todo filter by scope of selected place
						valuePlace={this.state.selectorValuePlace}
						valueAttSet={this.state.selectorValueAttSet}
						valueAULevel={this.state.selectorValueAULevel}
						onChange={this.onSelectorChange.bind(this)}
					/>
				</div></div>
				<div className="screen-content"><div>
					<ConfigPlaceDataSource
						disabled={this.props.disabled}
						screenKey={this.props.screenKey}
						selectorValuePlace={this.state.selectorValuePlace}
						selectorValueAttSet={this.state.selectorValueAttSet}
						selectorValueAULevel={this.state.selectorValueAULevel}
					/>
				</div></div>
			</div>
		);
	}
}

export default ScreenPlaceDataSourceAttSet;
