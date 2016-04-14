import React, { PropTypes, Component } from 'react';
import styles from './ConfigAnalysisSpatial.css';
import withStyles from '../../../decorators/withStyles';

import UIScreenButton from '../../atoms/UIScreenButton';
import SaveButton from '../../atoms/SaveButton';

import { Input, Icon, IconButton, Buttons } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import { Table } from '../../SEUI/collections';
import Select from 'react-select';
import _ from 'underscore';
import UIObjectSelect from '../../atoms/UIObjectSelect';

import logger from '../../../core/Logger';

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
			idAnalysisSpatial: this.props.id,
			valuesTopics: [12,22],
			themesString: "",
			data: this.props.data
		};

	}

	componentWillReceiveProps(newProps) {
		if (newProps.id != this.state.idAnalysisSpatial) {
			this.setState({idAnalysisSpatial: newProps.id});
		}
	}

	resolveThemes(topics) {
		var stringThemes = "";
		if(topics) {
			var themes = [];
			if (!Array.isArray(topics)) {
				topics = topics.split(",");
			}
			for(var topicKey of topics) {
				var topic = _.findWhere(TOPICS, {key: Number(topicKey)});
				themes = _.union(themes, topic.themes);
			}
			themes = themes.sort(function (a, b) {return a - b});
			for(var themeKey of themes) {
				var theme = _.findWhere(THEMES, {key: themeKey});
				if(stringThemes) {
					stringThemes += ", ";
				}
				stringThemes += theme.theme;
			}
		}
		this.setState({
			themesString: stringThemes
		});
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

	onChangeTopics (value, values) {
		values = this.handleNewObjects(values, TOPICS);
		this.setState({
			valuesTopics: values
		});
		this.resolveThemes(values);
	}


	onObjectClick (value, event) {
		logger.trace("ConfigAnalysisSpatial# onObjectClick(), Value:" + value["key"]);
	}


	topicOptionFactory (inputValue) {
		var newOption = {
				key: inputValue,
				topic: inputValue,
				value: inputValue,
				label: inputValue,
				create: true
			};
		return newOption;
	}


	componentDidMount() { this.mounted = true;



	}

	onChangeName(){
		logger.trace("ConfigAnalysisSpatial# onChangeName(), Name changed");
	}

	render() {

		var selectInputProps = {
			className: "" //"ui input"
		};

		return (
			<div>
				<div className="frame-input-wrapper">
					<label className="container">
						Name
						<Input type="text" name="name" placeholder=" " defaultValue="Land cover status" onChange={this.onChangeName.bind(this)} />
					</label>
				</div>

				<div className="frame-input-wrapper">
						<label className="container">
							Topics
							<UIObjectSelect
								multi
								onChange={this.onChangeTopics.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								//loadOptions={this.getScopes}
								options={TOPICS}
								allowCreate
								newOptionCreator={this.topicOptionFactory.bind(this)}
								valueKey="key"
								labelKey="topic"
								value={this.state.valuesTopics}
							/>
						</label>
						<div className="frame-input-wrapper-info"><b>Themes:</b> {this.state.themesString}</div>
				</div>

				<SaveButton saved />


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
