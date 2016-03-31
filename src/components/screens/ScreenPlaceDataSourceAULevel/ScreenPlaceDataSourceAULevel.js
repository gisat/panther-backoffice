import React, { PropTypes, Component } from 'react';

import path from "path";
import _ from 'underscore';

import utils from '../../../utils/utils';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import ActionCreator from '../../../actions/ActionCreator';
import AULevelStore from '../../../stores/AULevelStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import PlaceStore from '../../../stores/PlaceStore';
import ScopeStore from '../../../stores/ScopeStore';

import SelectorPlaceAULevel from '../../sections/SelectorPlaceAULevel';
import ConfigPlaceDataSourceAULevel from '../../sections/ConfigPlaceDataSourceAULevel';

import ListenerHandler from '../../../core/ListenerHandler';


var initialState = {
	scope: null,
	places: [],
	attributeSets: [],
	layers: [],
	selectorValuePlace: null,
	selectorValueAULevel: null
};


class ScreenPlaceDataSourceAULevel extends Component {

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
		this.changeListener = new ListenerHandler(this, this._onStoreChange, "addChangeListener", "removeChangeListener");

		if(this.props.data) {
			if (this.props.data.placeKey) {
				this.state.selectorValuePlace = this.props.data.placeKey;
			}
			if (this.props.data.auLevelKey) {
				this.state.selectorValueAULevel = this.props.data.auLevelKey;
			}
		}
	}

	//getUrl() {
	//	return path.join(this.props.parentUrl, "links/" + this.state.selectorValuePlace + "-" + this.state.selectorValueAULevel); // todo
	//}

	store2state(props) {
		if (!props) {
			props = this.props;
		}
		return {
			scope: ScopeStore.getById(props.data.scopeKey),
			attributeSets: utils.getAttSetsForLayers(props.data.layerKey)
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(
			props.data.scopeKey &&
			props.data.placeKey
		) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			let setStatePromise = this.context.setStateFromStores.call(this, store2state, keys);

			setStatePromise.then(function () {
				let next2state = {
					places: PlaceStore.getFiltered({scope: thisComponent.state.scope})
				};
				thisComponent.context.setStateFromStores.call(thisComponent, next2state);
			});
		}
	}

	_onStoreChange(keys) {
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		this.changeListener.add(PlaceStore, ["places"]);
		this.changeListener.add(AULevelStore);

		this.setStateFromStores();
	}

	componentWillUnmount() {
		this.changeListener.clean();
	}

	componentWillReceiveProps(newProps) {
		if(newProps.data.placeKey && (this.props.data.placeKey != newProps.data.placeKey)) {
			this.setState({
				selectorValuePlace: newProps.data.placeKey
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
		this._stateHash = utils.stringHash(state.selectorValuePlace + state.selectorValueLayer + state.selectorValueAttSet);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}


	onSelectorChange (select, value) {
		switch(select) {
			case "place":
				this.setState({
					selectorValuePlace: value
				});
				break;
			case "auLevel":
				this.setState({
					selectorValueAULevel: value
				});
				break;
		}
	}

	render() {

		if (this.state.scope) {
			var selectorDataPlace = utils.deepClone(this.state.places);
			selectorDataPlace.sort(function (a, b) {
				if (!a.scope && b.scope) return 1;
				if (a.scope && !b.scope) return -1;
				if (a.key > b.key) return 1;
				if (a.key < b.key) return -1;
				return 0;
			});

			return (
				<div>
					<div className="screen-setter">
						<div>
							<h2>Data source selection: Analytical units level</h2>
							<SelectorPlaceAULevel
								disabled={this.props.disabled}
								dataPlace={selectorDataPlace}
								dataAULevel={this.state.scope.levels}
								valuePlace={this.state.selectorValuePlace}
								valueAULevel={this.state.selectorValueAULevel}
								onChange={this.onSelectorChange.bind(this)}
							/>
						</div>
					</div>
					<div className="screen-content">
						<div>
							<ConfigPlaceDataSourceAULevel
								disabled={this.props.disabled}
								screenKey={this.props.screenKey}
								selectorValuePlace={this.state.selectorValuePlace}
								selectorValueAULevel={this.state.selectorValueAULevel}
							/>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default ScreenPlaceDataSourceAULevel;
