import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisRulesMath.css';
import withStyles from '../../../decorators/withStyles';
import path from "path";

import { Input, Icon, IconButton, Buttons } from '../../SEUI/elements';
import { Table } from '../../SEUI/collections';
import Select from 'react-select';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

import utils from '../../../utils/utils';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

const ATTSETS = [
			{ key: 352, name: "Land Cover classes L3" },
			{ key: 623, name: "Aggregated LC Classes Formation" },
			{ key: 18, name: "Populations1" },
			{ key: 28, name: "Status code" }
		];

@withStyles(styles)
class ScreenAnalysisRulesMath extends Component{

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			valueResultAttSets: [352],
			valueMapMathAttSets: {
				352: {
					1: [28],
					2: [18]
				}
			},
			valueMapUseSum: {
				352: true
			},
			data: this.props.data
		};

	}

	//getUrl() {
	//	return path.join(this.props.parentUrl, "rules");
	//}

	onChangeResultAttSets (value, values) {
		//values = utils.handleNewObjects(values, ObjectTypes.ATTRIBUTE_SET, {stateKey: "valueResultAttSet"}, this.getStateHash());
		values = value; // temp
		this.setState({
			valueResultAttSets: values
		});
	}

	onChangeMathAttSet (resultAttSetKey, mathAttSetIndex, value, values) {
		//values = utils.handleNewObjects(values, ObjectTypes.ATTRIBUTE_SET, {stateKey: "valueResultAttSet"}, this.getStateHash());
		values = value; // temp
		let newState = {
			valueMapMathAttSets: {
				[resultAttSetKey]: {
					[mathAttSetIndex]: {$set: values}
				}
			}
		};
		this.context.setStateDeep.call(this,newState);
	}

	onChangeOperation (resultAttSetKey) {
		let newState = {
			valueMapUseSum: {
				[resultAttSetKey]: {$set: !this.state.valueMapUseSum[resultAttSetKey]}
			}
		};
		this.context.setStateDeep.call(this,newState);
	}


	onObjectClick (value, event) {
		console.log("yay! " + value["key"]);
	}


	render() {
		return (
			<div>
				<div className="screen-content"><div>

					<div className="frame-input-wrapper">
						<label className="container">
							Result attribute sets
							<UIObjectSelect
								multi
								onChange={this.onChangeResultAttSets.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								options={ATTSETS}
								valueKey="key"
								labelKey="name"
								value={this.state.valueResultAttSets}
								className="template"
							/>
						</label>
					</div>

				<Table celled className="fixed" id="AnalysisSpatialRuleTable">
					<thead>
						<tr>
							<th>Result attribute set</th>
							<th>Operation</th>
						</tr>
					</thead>
					<tbody>

						<tr>
							<td className="allowOverflow resetui">
								Land Cover classes L3
							</td>
							<td className="allowOverflow resetui">
								<div className="ptr-analysis-operation-row">
									<div className="ptr-analysis-operation-symbol none">
									</div>
									<UIObjectSelect
										onChange={this.onChangeMathAttSet.bind(this,'352','1')}
										onOptionLabelClick={this.onObjectClick.bind(this)}
										options={ATTSETS}
										valueKey="key"
										labelKey="name"
										value={this.state.valueMapMathAttSets['352']['1']}
										className="template"
									/>
								</div>
								<div className="ptr-analysis-operation-row">
									<div className="ptr-analysis-operation-symbol plus">
										<IconButton
											basic
											name={this.state.valueMapUseSum['352'] ? "plus" : "minus"}
											size="smaller"
											onClick={this.onChangeOperation.bind(this,'352')}
										/>
									</div>
									<UIObjectSelect
										onChange={this.onChangeMathAttSet.bind(this,'352','2')}
										onOptionLabelClick={this.onObjectClick.bind(this)}
										options={ATTSETS}
										valueKey="key"
										labelKey="name"
										value={this.state.valueMapMathAttSets['352']['2']}
										className="template"
									/>
								</div>
							</td>
						</tr>

					</tbody>

				</Table>

					<SaveButton saved />

			</div></div></div>
		);

	}
}

export default ScreenAnalysisRulesMath;
