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
	{ key: "sum", name: "SUM" },
	{ key: "avgarea", name: "AVERAGE, weighted by area/length" },
	{ key: "avgattr", name: "AVERAGE, weighted by attribute" }
];

class ConfigAnalysisRulesLevel extends Component {

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

				let row = (
					<tr>
						<td>{record.attribute.name}</td>
						<td>{operation.name}</td>
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

export default ConfigAnalysisRulesLevel;
