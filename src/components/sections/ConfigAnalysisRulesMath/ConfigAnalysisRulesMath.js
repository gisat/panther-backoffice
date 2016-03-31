import React, { PropTypes, Component } from 'react';

import utils from '../../../utils/utils';

import { Input, Button, Icon } from '../../SEUI/elements';
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


class ConfigAnalysisRulesMath extends Component {

	static propTypes = {
		disabled: PropTypes.bool,
		analysis: PropTypes.object.isRequired
	};

	static defaultProps = {
		disabled: false
	};

	render() {

		let ret = null;
		if (this.props.analysis) {

			console.log("analysis",this.props.analysis);

			let rowsInsert = [];

			let operationInsert = [];
			for (let index in this.props.analysis.attributeSets) {

				let operationRow = null;
				console.log("index",index);
				if (index != 0) {
					operationRow = (
						<div>
							<Icon
								name="minus"
								/>
							{this.props.analysis.attributeSets[index].name}
						</div>
					);
				} else {
					operationRow = (
						<div>
							<span className="ptr-analysis-placeholder"></span>
							{this.props.analysis.attributeSets[index].name}
						</div>
					);
				}
				operationInsert.push(operationRow);
			}

			let row = (
				<tr>
					<td>{this.props.analysis.attributeSet.name}</td>
					<td>{operationInsert}</td>
				</tr>
			);

			rowsInsert.push(row);



			ret = (
				<Table celled className="fixed">
					<thead>
					<tr>
						<th>Result attribute set</th>
						<th>Operation</th>
					</tr>
					</thead>
					<tbody>

					{rowsInsert}

					</tbody>
				</Table>
			);

		}

		return ret;

	}
}

export default ConfigAnalysisRulesMath;
