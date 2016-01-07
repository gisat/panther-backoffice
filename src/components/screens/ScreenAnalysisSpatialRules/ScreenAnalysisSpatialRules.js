import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisSpatialRules.css';
import withStyles from '../../../decorators/withStyles';
import path from "path";

import { Icon, IconButton, Buttons } from '../../SEUI/elements';
import { Table } from '../../SEUI/collections';
import Select from 'react-select';
import UIObjectSelect from '../../atoms/UIObjectSelect';

const OPERATIONS = [
			{ key: "COUNT", name: "COUNT"	},
			{ key: "SUM", name: "SUM (area/length)" },
			{ key: "SUMATT", name: "SUM (attribute)" },
			{ key: "AVG", name: "AVERAGE (area/length)" },
			{ key: "AVGATT", name: "AVERAGE (attribute)" },
			{ key: "AVGATTATT", name: "AVERAGE (attribute), weighted by attribute" }
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
const STATUSCODES = [
			{
				key: 111
			}, {
				key: 112
			}, {
				key: 113
			}, {
				key: 120
			}, {
				key: 130
			}, {
				key: 140
			}, {
				key: 200
			}, {
				key: 310
			}, {
				key: 320
			}, {
				key: 330
			}, {
				key: 510
			}, {
				key: 520
			}
];
const ATTSETS = [
			{ key: 352, name: "Land Cover classes L3" },
			{ key: 623, name: "Aggregated LC Classes Formation" },
			{ key: 18, name: "Populations1" },
			{ key: 28, name: "Status code" },
		];

@withStyles(styles)
class ScreenAnalysisSpatialRules extends Component{

	constructor(props) {
		super(props);

		this.state = {
			valueResultAttSet: [352],
			valueFilterAttSet: [28],
			themesString: "",
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
		values = this.handleNewObjects(values, ATTSETS);
		this.setState({
			valueResultAttSet: values
		});
	}

	onChangeFilterAttSet (value, values) {
		values = this.handleNewObjects(values, ATTSETS);
		this.setState({
			valueFilterAttSet: values
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
				<p style={{backgroundColor: "yellow"}}>DATA: {JSON.stringify(this.state.data)}</p>
				<p style={{backgroundColor: "yellow"}}>getUrl: {this.getUrl()}</p>
				<div className="screen-content"><div>

				<div className="frame-input-wrapper">
						<label className="container">
							Result attribute set
							<UIObjectSelect
								onChange={this.onChangeResultAttSet.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								//loadOptions={this.getScopes}
								options={ATTSETS}
								allowCreate
								newOptionCreator={this.keyNameOptionFactory.bind(this)}
								valueKey="key"
								labelKey="name"
								value={this.state.valueResultAttSet}
								className="template"
							/>
						</label>
				</div>

				<div className="frame-input-wrapper">
						<label className="container">
							Filter attribute set
							<UIObjectSelect
								onChange={this.onChangeFilterAttSet.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								//loadOptions={this.getScopes}
								options={ATTSETS}
								allowCreate
								newOptionCreator={this.keyNameOptionFactory.bind(this)}
								valueKey="key"
								labelKey="name"
								value={this.state.valueFilterAttSet}
								className="template"
							/>
						</label>
				</div>

				<Table celled className="fixed" id="AnalysisSpatialRuleTable">
					<thead>
						<tr>
							<th>Operation</th>
							<th colSpan="2"></th>
							<th>Filter</th>
						</tr>
					</thead>
					<tbody>

						<tr className="row-header">
							<td colSpan="4" className="resetui">Continuous Urban Fabric (S.L. > 80%)</td>
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
										value="SUM"
									/>
								</label>
							</td>
							<td colSpan="2"></td>
							<td className="allowOverflow resetui">
								<label className="container">
									Status code:
									<Select
										//onChange={this.onChangeAttSet.bind(this)}
										//loadOptions={this.getPlaces}
										options={STATUSCODES}
										valueKey="key"
										labelKey="key"
										//inputProps={selectInputProps}
										value="111"
									/>
								</label>
							</td>
						</tr>

					</tbody>
					<tbody className="internal row">

						<tr className="row-header">
							<td colSpan="4" className="resetui">Discontinuous High Dense Urban Fabric (S.L. 50% - 80%)</td>
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
									Attribute to average
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
										value="162"
									/>
								</label>
							</td>
							<td className="allowOverflow resetui">
								<label className="container">
									Status code:
									<Select
										//onChange={this.onChangeAttSet.bind(this)}
										//loadOptions={this.getPlaces}
										options={STATUSCODES}
										valueKey="key"
										labelKey="key"
										//inputProps={selectInputProps}
										value="112"
									/>
								</label>
							</td>
						</tr>

					</tbody>
					<tbody className="internal row">

						<tr className="row-header">
							<td colSpan="4" className="resetui">Discontinuous Low Dense Urban Fabric (S.L.: 10% - 50%)</td>
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
							<td className="allowOverflow resetui">
								<label className="container">
									Attribute to sum
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
							<td></td>
							<td className="allowOverflow resetui">
								<label className="container">
									Status code:
									<Select
										//onChange={this.onChangeAttSet.bind(this)}
										//loadOptions={this.getPlaces}
										options={STATUSCODES}
										valueKey="key"
										labelKey="key"
										//inputProps={selectInputProps}
										value="113"
									/>
								</label>
							</td>
						</tr>


					</tbody>
				</Table>

				<IconButton name="check" basic color="blue">
					Save
				</IconButton>

			</div></div></div>
		);

	}
}

export default ScreenAnalysisSpatialRules;
