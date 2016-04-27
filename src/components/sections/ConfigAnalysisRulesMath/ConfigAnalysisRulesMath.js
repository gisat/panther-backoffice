import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

import utils from '../../../utils/utils';

import { Input, Button, Icon } from '../../SEUI/elements';
import { Table } from '../../SEUI/collections';
import logger from '../../../core/Logger';
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


class ConfigAnalysisRulesMath extends PantherComponent {

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
			if (this.props.analysis.attributeSet) {

				let rowsInsert = [];

				let operationInsert = [];
				for (let index in this.props.analysis.attributeSets) {

					let operationRow = null;
					logger.info("ConfigAnalysisRulesMath# render(), Index:", index);
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

export default ConfigAnalysisRulesMath;
