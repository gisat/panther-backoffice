import React, { PropTypes, Component } from 'react';
import styles from './ConfigMetadataLayerVector.css';
import withStyles from '../../../decorators/withStyles';

import { Input, Icon, IconButton, Buttons } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import Select from 'react-select';
import _ from 'underscore';
import UIObjectSelect from '../../atoms/UIObjectSelect';


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
var LAYERGROUPS = [
			{ key: 1, name: 'Information layers' },
			{ key: 2, name: 'Reference satellite images' }
		];
const STYLES = [
			{ key: 10, name: 'detailed' },
			{ key: 18, name: 'aggregated' },
			{ key: 23, name: 'urban fabric' },
			{ key: 30, name: 'flows' }
		];



@withStyles(styles)
class ConfigMetadataLayerVector extends Component{

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			valuesTopics: [12,22],
			valueGroup: [],
			valuesStyles: [30],
			themesString: ""
		};

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

	onChangeName (e) {
		console.log(e.target.value);
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

	onChangeGroup (value, values) {
		values = this.handleNewObjects(values, LAYERGROUPS);
		this.setState({
			valueGroup: values
		});
	}

	onChangeStyles (value, values) {
		values = this.handleNewObjects(values, STYLES);
		this.setState({
			valuesStyles: values
		});
	}


	onObjectClick (value, event) {
		console.log("yay! " + value["key"]);
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



	componentDidMount() {

		this.resolveThemes(this.state.valuesTopics);

	}

	render() {

		return (
			<div>

				<div className="frame-input-wrapper">
					<label className="container">
						Name
						<Input
							type="text"
							name="name"
							placeholder=" "
							defaultValue="Land cover"
							onChange={this.onChangeName.bind(this)}
						/>
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


				<div className="frame-input-wrapper">
					<label className="container">
						Layer group
						<UIObjectSelect
							onChange={this.onChangeGroup.bind(this)}
							onOptionLabelClick={this.onObjectClick.bind(this)}
							//loadOptions={this.getScopes}
							options={LAYERGROUPS}
							allowCreate
							newOptionCreator={this.keyNameOptionFactory.bind(this)}
							valueKey="key"
							labelKey="name"
							value={this.state.valueGroup}
						/>
					</label>
				</div>

				<div className="frame-input-wrapper">
					<label className="container">
						Styles
						<UIObjectSelect
							multi
							onChange={this.onChangeStyles.bind(this)}
							onOptionLabelClick={this.onObjectClick.bind(this)}
							//loadOptions={this.getScopes}
							options={STYLES}
							allowCreate
							newOptionCreator={this.keyNameOptionFactory.bind(this)}
							valueKey="key"
							labelKey="name"
							value={this.state.valuesStyles}
						/>
					</label>
				</div>


				<IconButton name="check" basic color="blue">
					Save
				</IconButton>

			</div>
		);

	}
}

export default ConfigMetadataLayerVector;
