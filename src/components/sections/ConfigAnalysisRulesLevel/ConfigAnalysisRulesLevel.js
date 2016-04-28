import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

import _ from 'underscore';
import utils from '../../../utils/utils';
import logger from '../../../core/Logger';
import ActionCreator from '../../../actions/ActionCreator';
import ListenerHandler from '../../../core/ListenerHandler';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';
import AnalysisOperations, {analysisOperationsMetadata} from '../../../constants/AnalysisOperations';

import { Input, Button } from '../../SEUI/elements';
import { Table } from '../../SEUI/collections';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

import PlaceStore from '../../../stores/PlaceStore';
import ScopeStore from '../../../stores/ScopeStore';

import ScreenMetadataObject from '../../screens/ScreenMetadataObject';

const OPERATIONS = [
	{ key: "sum", name: "SUM" },
	{ key: "avgarea", name: "AVERAGE, weighted by area/length" },
	{ key: "avgattr", name: "AVERAGE, weighted by attribute" }
];

class ConfigAnalysisRulesLevel extends PantherComponent {

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
			if (this.props.analysis.attributeMap.length) {

				let rowsInsert = [];
				for (let record of this.props.analysis.attributeMap) {

					let operationCellInsert = null;
					if (record.operationType) {

						let operation = _.findWhere(OPERATIONS, {key: record.operationType});

						let operationDetails = false,
							weightingInsert = null,
							operationName = "";
						switch (record.operationType) {
							case analysisOperationsMetadata.LEVEL[AnalysisOperations.LEVEL.AVG_WEIGHT_AREA].key:
								operationDetails = true;
								operationName = "AVERAGE";
								weightingInsert = (
									<span>
										<br/>
										weighted by area/length
									</span>
								);
								break;
							case analysisOperationsMetadata.LEVEL[AnalysisOperations.LEVEL.AVG_WEIGHT_ATTRIBUTE].key:
								operationDetails = true;
								operationName = "AVERAGE";
								weightingInsert = (
									<span>
										<br/>
										weighted by
										<br/>
										{record.weightingAttribute.name}
									</span>
								);
								break;
						}
						if (!operationDetails) {
							operationCellInsert = operation.name;
						} else {
							operationCellInsert = (
								<span>
									{operationName}
									{weightingInsert}
								</span>
							);

						}

					}

					let row = (
						<tr>
							<td>{record.attribute.name}</td>
							<td>{operationCellInsert}</td>
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
			} else {
				ret = (
					<div className="prod">
						Not configured
					</div>
				);
			}

		}

		return ret;

	}
}

export default ConfigAnalysisRulesLevel;
