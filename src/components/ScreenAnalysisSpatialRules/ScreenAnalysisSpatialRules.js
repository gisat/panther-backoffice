import React, { PropTypes, Component } from 'react';
import styles from './ScreenAnalysisSpatialRules.css';
import withStyles from '../../decorators/withStyles';

import { Icon, IconButton } from '../SEUI/elements';
import { Table } from '../SEUI/collections';
import Select from 'react-select';

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

@withStyles(styles)
class ScreenAnalysisSpatialRules extends Component{
  render() {
    return (
      <div><div className="screen-content"><div>

				<span className="todo">result and filter attribute setting</span>

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
							<td colSpan="4">Continuous Urban Fabric (S.L. > 80%)</td>
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
							<td colSpan="4">Discontinuous High Dense Urban Fabric (S.L. 50% - 80%)</td>
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
							<td colSpan="4">Discontinuous Low Dense Urban Fabric (S.L.: 10% - 50%)</td>
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
					
      </div></div></div>
    );

  }
}

export default ScreenAnalysisSpatialRules;
