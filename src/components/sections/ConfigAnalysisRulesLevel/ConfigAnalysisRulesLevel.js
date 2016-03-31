import React, { PropTypes, Component } from 'react';

import utils from '../../../utils/utils';

import { Input, Button } from '../../SEUI/elements';
import { Table } from '../../SEUI/collections';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import _ from 'underscore';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';
import PlaceStore from '../../../stores/PlaceStore';
import ScopeStore from '../../../stores/ScopeStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

import ListenerHandler from '../../../core/ListenerHandler';


var initialState = {
	place: null,
	valueActive: false,
	valueName: "",
	valueBoundingBox: "",
	valueScope: []
};


class ConfigAnalysisRulesLevel extends Component{

	static propTypes = {
		disabled: React.PropTypes.bool,
		selectorValue: React.PropTypes.any
	};

	static defaultProps = {
		disabled: false,
		selectorValue: null
	};

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		// this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
		// this.responseListener = new ListenerHandler(this, this._onStoreResponse, 'addResponseListener', 'removeResponseListener');
	}

	// store2state(props) {
	// 	return {
	// 		place: PlaceStore.getById(props.selectorValue),
	// 		scopes: ScopeStore.getAll()
	// 	};
	// }

	// setStateFromStores(props,keys) {
	// 	if(!props){
	// 		props = this.props;
	// 	}
	// 	if(props.selectorValue) {
	// 		var thisComponent = this;
	// 		let store2state = this.store2state(props);
	// 		this.context.setStateFromStores.call(this, store2state, keys);
	// 		// if stores changed, overrides user input - todo fix
	//
	// 		if(!keys || keys.indexOf("place")!=-1) {
	// 			store2state.place.then(function (place) {
	// 				let newState = {
	// 					valueActive: place.active,
	// 					valueName: place.name,
	// 					valueBoundingBox: place.boundingBox,
	// 					valueScope: place.scope ? [place.scope.key] : []
	// 				};
	// 				newState.savedState = utils.deepClone(newState);
	// 				thisComponent.setState(newState);
	// 			});
	// 		}
	// 	}
	// }



	// componentDidMount() {
	// 	this.changeListener.add(PlaceStore,["place"]);
	// 	this.changeListener.add(ScopeStore,["scopes"]);
	// 	this.responseListener.add(ScopeStore);
	//
	// 	this.setStateFromStores();
	// }
	//
	// componentWillUnmount() {
	// 	this.changeListener.clean();
	// 	this.responseListener.clean();
	// }

	componentWillReceiveProps(newProps) {

	}



	render() {



		return (
		<Table celled className="fixed">
			<thead>
			<tr>
				<th>Result Attribute</th>
				<th>Operation</th>
				<th>Filter</th>
			</tr>
			</thead>
			<tbody>

			<tr>
				<td>Continuous Urban Fabric (S.L. > 80%)</td>
				<td>SUM (area/length)</td>
				<td>Status code: 111</td>
			</tr>

			<tr>
				<td>Discontinuous High Dense Urban Fabric (S.L. 50% - 80%)</td>
				<td>SUM (area/length)</td>
				<td>Status code: 112</td>
			</tr>

			<tr>
				<td>Discontinuous Low Dense Urban Fabric (S.L.: 10% - 50%)</td>
				<td>SUM (area/length)</td>
				<td>Status code: 113</td>
			</tr>

			<tr>
				<td>Industrial, Commercial and Transport Units</td>
				<td>SUM (area/length)</td>
				<td>Status code: 120, 121</td>
			</tr>

			<tr>
				<td>Construction sites</td>
				<td>SUM (area/length)</td>
				<td>Status code: 130</td>
			</tr>

			</tbody>
		</Table>



		);

	}
}

export default ConfigAnalysisRulesLevel;
