import React, { PropTypes, Component } from 'react';
import styles from './ScreenPlacesBase.css';
import withStyles from '../../../decorators/withStyles';

import path from "path";

import utils from '../../../utils/utils';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import ActionCreator from '../../../actions/ActionCreator';

import PlaceStore from '../../../stores/PlaceStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';
import SelectorPlace from '../../sections/SelectorPlace';
import PlaceRelations from '../../sections/PlaceRelations';

var initialState = {
	places: [],
	selectorValue: null
};


@withStyles(styles)
class ScreenPlacesBase extends Component{

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		onSetScreenData: PropTypes.func.isRequired,
		openScreen: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

	}

	getUrl() {
		return path.join(this.props.parentUrl, "places/" + this.state.selectorValue); // todo
	}

	store2state(props) {
		if (!props) {
			props = this.props;
		}
		return {
			places: PlaceStore.getAll()
		};
	}

	_onStoreChange() {
		this.context.setStateFromStores.call(this, this.store2state());
	}

	_onStoreResponse(result,responseData,stateHash) {
		if (stateHash === this.getStateHash()) {
			if (result) {
				var screenComponent,screenName,screenObjectType;
				screenComponent = ScreenMetadataObject;
				screenObjectType =  ObjectTypes.PLACE;
				screenName = "ScreenPlacesBase-ScreenMetadata" + screenObjectType;
				this.context.openScreen(screenName,screenComponent,this.props.parentUrl,{size:40},{objectType: screenObjectType,objectKey:result[0].key});
				this.setState({
					selectorValue: result[0].key
				});
			}
		}
	}

	componentDidMount() {
		PlaceStore.addChangeListener(this._onStoreChange.bind(this,["places"]));
		PlaceStore.addResponseListener(this._onStoreResponse.bind(this));
		this.context.setStateFromStores.call(this, this.store2state());
	}

	componentWillUnmount() {
		PlaceStore.removeChangeListener(this._onStoreChange.bind(this,["places"]));
		PlaceStore.removeResponseListener(this._onStoreResponse.bind(this));
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
		this._stateHash = utils.stringHash(state.selectorValue);
	}
	getStateHash() {
		if(!this._stateHash) {
			this.updateStateHash();
		}
		return this._stateHash;
	}


	onSelectorChange (value) {
		this.setState({
			selectorValue: value
		});
	}

	onNewEmptyObject () {
		let objectType = ObjectTypes.PLACE;
		let model = new Model[objectType]({active:false});
		ActionCreator.createObjectAndRespond(model, objectType, {}, this.getStateHash());
	}

	openScreenScopeExample(openerKey,scopeKey,e) {
		this.setState({
			activeScreenOpener: openerKey
		});
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
					<SelectorPlace
						disabled={this.props.disabled}
						data={selectorData}
						value={this.state.selectorValue}
						onChange={this.onSelectorChange.bind(this)}
						onNew={this.onNewEmptyObject.bind(this)}
					/>
				</div></div>
				<div className="screen-content"><div>
					<PlaceRelations
						disabled={this.props.disabled}
						places={this.state.places}
						selectorValue={this.state.selectorValue}
						screenKey={this.props.screenKey}
					/>
				</div></div>
			</div>
		);

	}
}

export default ScreenPlacesBase;
