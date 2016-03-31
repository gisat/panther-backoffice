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

const OPERATIONS = [
	{ key: "count", name: "COUNT"	},
	{ key: "sumarea", name: "SUM (area/length)" },
	{ key: "sumattr", name: "SUM (attribute)" },
	{ key: "avgarea", name: "AVERAGE (area/length)" },
	{ key: "avgattrarea", name: "AVERAGE (attribute), weighted by area/length" },
	{ key: "avgattrattr", name: "AVERAGE (attribute), weighted by attribute" }
];

class ConfigAnalysisRulesSpatial extends Component {

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

			let rowsInsert = [];
			for (let record of this.props.analysis.attributeMap) {

				let operation = _.findWhere(OPERATIONS,{key: record.operationType});

				let filter = "";
				if (this.props.analysis.filterAttribute) {
					filter = this.props.analysis.filterAttribute.name + ": " + record.filterValue;
				}

				let row = (
					<tr>
						<td>{record.attribute.name}</td>
						<td>{operation.name}</td>
						<td>{filter}</td>
					</tr>
				);

				rowsInsert.push(row);

			}

			ret = (
				<Table celled className="fixed">
					<thead>
					<tr>
						<th>Result attribute</th>
						<th>Operation</th>
						<th>Filter</th>
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

export default ConfigAnalysisRulesSpatial;
