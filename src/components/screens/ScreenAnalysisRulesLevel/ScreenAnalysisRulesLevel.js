import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisRulesLevel.css';
import withStyles from '../../../decorators/withStyles';
import path from "path";

import { Input, Icon, IconButton, Buttons } from '../../SEUI/elements';
import { Table } from '../../SEUI/collections';
import Select from 'react-select';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

const OPERATIONS = [
			{ key: "SUMATT", name: "SUM" },
			{ key: "AVGATTAREA", name: "AVERAGE, weighted by area/length" },
			{ key: "AVGATTATT", name: "AVERAGE, weighted by attribute" }
		];
const ATTRIBUTES = [
			{
				key: 135,
				attset: "Land cover classes",
				name: "Continuous Urban Fabric (S.L. > 80%)"
			}, {
				key: 136,
				attset: "Land cover classes",
				name: "Discontinuous High Dense Urban Fabric (S.L. 50% - 80%)"
			}, {
				key: 137,
				attset: "Land cover classes",
				name: "Discontinuous Low Dense Urban Fabric (S.L.: 10% - 50%)"
			}, {
				key: 138,
				attset: "Land cover classes",
				name: "Industrial, Commercial and Transport Units"
			}, {
				key: 139,
				attset: "Land cover classes",
				name: "Construction sites"
			}, {
				key: 140,
				attset: "Land cover classes",
				name: "Urban greenery"
			}, {
				key: 160,
				attset: "Land cover feature data",
				name: "Population"
			}, {
				key: 162,
				attset: "Land cover feature data",
				name: "Drawing a blank"
			}
		];
const ATTSETS = [
			{ key: 352, name: "Land Cover classes L3" },
			{ key: 623, name: "Aggregated LC Classes Formation" },
			{ key: 18, name: "Populations1" },
			{ key: 28, name: "Status code" },
		];

@withStyles(styles)
class ScreenAnalysisRulesLevel extends Component{

	constructor(props) {
		super(props);

		this.state = {
			valueResultAttSets: [352,18],
			data: this.props.data
		};

	}

	getUrl() {
		return path.join(this.props.parentUrl, "rules");
	}


	handleNewObjects(values, store) {
		var newValues = [];
		for (var singleValue of values) {
			if(singleValue.create){
				// replace with actual object creation and config screen opening
				delete singleValue.create;
				delete singleValue.label;
				delete singleValue.value;
				singleValue.key = Math.floor((Math.random() * 10000) + 1);
				store.push(singleValue);
			}
			newValues.push(singleValue.key);
		}
		return newValues;
	}

	onChangeResultAttSet (value, values) {
		value = this.handleNewObjects(values, ATTSETS);
		this.setState({
			valueResultAttSet: value
		});
	}


	onObjectClick (value, event) {
		console.log("yay! " + value["key"]);
	}


	keyNameOptionFactory (inputValue) {
		var newOption = {
				key: inputValue,
				name: inputValue,
				value: inputValue,
				label: inputValue,
				create: true
			};
		return newOption;
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
								onChange={this.onChangeResultAttSet.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								//loadOptions={this.getScopes}
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
							<th>Operation</th>
							<th></th>
						</tr>
					</thead>
					<tbody>

						<tr className="row-header">
							<td colSpan="2" className="resetui">Continuous Urban Fabric (S.L. > 80%)</td>
						</tr>
						<tr>
							<td className="allowOverflow resetui">
								<label className="container">
									Operation
									<Select
										//onChange={this.onChangeAttSet.bind(this)}
										//loadOptions={this.getPlaces}
										options={OPERATIONS}
										valueKey="key"
										labelKey="name"
										//inputProps={selectInputProps}
										value="SUMATT"
									/>
								</label>
							</td>
							<td></td>
						</tr>

					</tbody>
					<tbody className="internal row">

						<tr className="row-header">
							<td colSpan="2" className="resetui">Discontinuous High Dense Urban Fabric (S.L. 50% - 80%)</td>
						</tr>
						<tr>
							<td className="allowOverflow resetui">
								<label className="container">
									Operation
									<Select
										//onChange={this.onChangeAttSet.bind(this)}
										//loadOptions={this.getPlaces}
										options={OPERATIONS}
										valueKey="key"
										labelKey="name"
										//inputProps={selectInputProps}
										value="AVGATTATT"
									/>
								</label>
							</td>
							<td className="allowOverflow resetui">
								<label className="container">
									Weighting attribute
									<Select
										//onChange={this.onChangeAttSet.bind(this)}
										//loadOptions={this.getPlaces}
										options={ATTRIBUTES}
										valueKey="key"
										labelKey="name"
										//inputProps={selectInputProps}
										value="160"
									/>
								</label>
							</td>
						</tr>

					</tbody>
					<tbody className="internal row">

						<tr className="row-header">
							<td colSpan="2" className="resetui">Discontinuous Low Dense Urban Fabric (S.L.: 10% - 50%)</td>
						</tr>
						<tr>
							<td className="allowOverflow resetui">
								<label className="container">
									Operation
									<Select
										//onChange={this.onChangeAttSet.bind(this)}
										//loadOptions={this.getPlaces}
										options={OPERATIONS}
										valueKey="key"
										labelKey="name"
										//inputProps={selectInputProps}
										value="SUMATT"
									/>
								</label>
							</td>
							<td></td>
						</tr>


					</tbody>
				</Table>

					<SaveButton saved />

			</div></div></div>
		);

	}
}

export default ScreenAnalysisRulesLevel;
