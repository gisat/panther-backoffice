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


class ConfigAnalysisRulesSpatial extends PantherComponent {

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
					let filter = null;
					if (record.operationType) {
						let operation = _.findWhere(analysisOperationsMetadata.SPATIAL, {key: record.operationType});

						if (this.props.analysis.filterAttribute) {
							filter = this.props.analysis.filterAttribute.name + ": " + record.filterValue;
						}

						let operationDetails = false,
							weightingInsert = null,
							operationName = "";
						switch (record.operationType) {
							case analysisOperationsMetadata.SPATIAL[AnalysisOperations.SPATIAL.SUM_ATTRIBUTE].key:
								operationDetails = true;
								operationName = "SUM";
								break;
							case analysisOperationsMetadata.SPATIAL[AnalysisOperations.SPATIAL.AVG_ATTRIBUTE_WEIGHT_AREA].key:
								operationDetails = true;
								operationName = "AVERAGE";
								weightingInsert = (
									<span>
									<br/>
									weighted by area/length
								</span>
								);
								break;
							case analysisOperationsMetadata.SPATIAL[AnalysisOperations.SPATIAL.AVG_ATTRIBUTE_WEIGHT_ATTRIBUTE].key:
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
									<br/>
								(<b>{record.valueAttribute.name}</b>)
									{weightingInsert}
							</span>
							);

						}
					}

					let row = (
						<tr>
							<td>{record.attribute.name}</td>
							<td>{operationCellInsert}</td>
							<td>{filter}</td>
						</tr>
					);

					rowsInsert.push(row);

				}

				ret = (
					<div>
						<div className="ptr-analysis-operations-details">
							<div className="label">Feature layer</div>
							<div>{this.props.analysis.layerObject.key + "\xa0" + this.props.analysis.layerObject.name}</div>
							<div className="label">Result attribute set</div>
							<div>{this.props.analysis.attributeSet.key + "\xa0" + this.props.analysis.attributeSet.name}</div>
						</div>
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
					</div>
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

export default ConfigAnalysisRulesSpatial;
