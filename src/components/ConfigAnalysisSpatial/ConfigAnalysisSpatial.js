import React, { PropTypes, Component } from 'react';
import styles from './ConfigAnalysisSpatial.css';
import withStyles from '../../decorators/withStyles';

import UIScreenButton from '../UIScreenButton';

import { Input, Icon, IconButton, Buttons } from '../SEUI/elements';
import { CheckboxFields, Checkbox } from '../SEUI/modules';
import { Table } from '../SEUI/collections';
import Select from 'react-select';
import _ from 'underscore';


const TOPICS = [
			{ key: 7, topic: 'Land cover structure', themes: [18,23,32] },
			{ key: 12, topic: 'Land cover development', themes: [18,23,32] },
			{ key: 16, topic: 'Urban population', themes: [30] },
			{ key: 19, topic: 'Urban expansions', themes: [30] },
			{ key: 22, topic: 'Total populations', themes: [25] },
			{ key: 23, topic: 'Population density grid', themes: [18,23,25,30,32] },
			{ key: 33, topic: 'Roads', themes: [18,23,32] }
		];
const THEMES = [
			{ key: 18, theme: 'Population' },
			{ key: 23, theme: 'Transportation' },
			{ key: 25, theme: 'Total population' },
			{ key: 30, theme: 'Urban expansion' },
			{ key: 32, theme: 'Land cover' }
		];



@withStyles(styles)
class ConfigAnalysisSpatial extends Component{
	
	constructor(props) {
		super(props);

		this.state = {
			valuesTopics: [12,22],
			valueGroup: 1,
			valuesStyles: [30]
		};
		
	}
	
	resolveThemes(topics) {
//		var themes = [];
//		for(var topicKey of this.state.valuesTopics) {
//			console.log(topicKey);
//			var topic = _.where(TOPICS, {key: topicKey});
//			themes = _.union(themes, topic.themes);
//			//console.log(topic.themes);
//		}
//		console.log(typeof themes);
	}
	
	onChangeTopics (values) {
		this.state.valuesTopics = values;
//		this.resolveThemes(values);
		console.log(values);
	}
	onChangeGroup (value) {
		this.state.valueGroup = value;
	}
	
	
	componentDidMount() {
		
		
		
	}
	
	render() {
		
		var selectInputProps = {
			className: "" //"ui input"
		};
		
		return (
      <div>
				
				
						<label className="container">
							Name
							<Input type="text" name="name" placeholder=" " value="Land cover" />
						</label>
			
				

				
				
				<div className="input-wrapper">
					<div>
						<label className="container">
							Topics
							<Select 
								multi
								onChange={this.onChangeTopics.bind(this)}
								//loadOptions={this.getScopes}
								options={TOPICS}
								valueKey="key" 
								labelKey="topic" 
								inputProps={selectInputProps} 
								value={this.state.valuesTopics}
							/>
						</label>
					</div>
					<div>
						<Buttons icon>
							<IconButton name="write" />
							<IconButton name="plus" />
						</Buttons>
					</div>
				</div>
				
				<span><b>Themes:</b> Land cover, Population</span><br/>
				
				<div className="rsc-controls">
					<IconButton name="check" basic color="blue" disabled>
						Saved
					</IconButton>
				</div>
				
				
				<div className="section-header">
					<h3>Operations</h3>
					<UIScreenButton basic>
						<Icon name="configure" />
						Configure
					</UIScreenButton>
				</div>
				
				<Table celled className="fixed">
					<thead>
						<tr>
							<th>Result Attribute</th>
							<th>Operation</th>
							<th>Filter</th>
						</tr>
					</thead>
					<tbody>

						<tr>
							<td>Continuous Urban Fabric (S.L. > 80%)</td>
							<td>SUM (area/length)</td>
							<td>Status code: 111</td>
						</tr>

						<tr>
							<td>Discontinuous High Dense Urban Fabric (S.L. 50% - 80%)</td>
							<td>SUM (area/length)</td>
							<td>Status code: 112</td>
						</tr>

						<tr>
							<td>Discontinuous Low Dense Urban Fabric (S.L.: 10% - 50%)</td>
							<td>SUM (area/length)</td>
							<td>Status code: 113</td>
						</tr>

						<tr>
							<td>Industrial, Commercial and Transport Units</td>
							<td>SUM (area/length)</td>
							<td>Status code: 120, 121</td>
						</tr>

						<tr>
							<td>Construction sites</td>
							<td>SUM (area/length)</td>
							<td>Status code: 130</td>
						</tr>

					</tbody>
				</Table>
				
				
				<div className="section-header">
					<h3>Runs</h3>
					<UIScreenButton basic>
						<Icon name="plus" />
						New run
					</UIScreenButton>
				</div>
				
				<Table basic="very" className="fixed">
					<thead>
						<tr>
							<th>Place</th>
							<th>Period</th>
							<th>AU levels</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						
						<tr>
							<td>Cebu City</td>
							<td>2000</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>
						
						<tr>
							<td>Cebu City</td>
							<td>2010</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>
						
						<tr>
							<td>Hai Phong</td>
							<td>2000</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>
						
						<tr>
							<td>Hai Phong</td>
							<td>2010</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>
						
						<tr>
							<td>Ulaanbaatar</td>
							<td>2000</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>
						
						<tr>
							<td>Ulaanbaatar</td>
							<td>2010</td>
							<td>GADM2</td>
							<td>2015-11-17</td>
						</tr>
						

					</tbody>
				</Table>
				
			</div>
    );

  }
}

export default ConfigAnalysisSpatial;
