import React, { PropTypes, Component } from 'react';
import styles from './ConfigMetadataLayerVector.css';
import withStyles from '../../decorators/withStyles';

import { Input, Icon, IconButton, Buttons } from '../SEUI/elements';
import { CheckboxFields, Checkbox } from '../SEUI/modules';
import Select from 'react-select';
import _ from 'underscore';
import UIObjectSelect from '../UIObjectSelect';


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
	
	constructor(props) {
		super(props);

		this.state = {
			valuesTopics: [12,22],
			valueGroup: "",
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
	
	onChangeTopics (value, values) {
		this.state.valuesTopics = value;
//		this.resolveThemes(values);
		console.log(values);
	}
	onChangeGroup (value, values) {
		this.state.valueGroup = value;
		console.log("onChangeGroup:");
		console.log(values);
		for (var singleValue of values) {
			if(singleValue.create){
				// replace with actual object creation and config screen opening
				delete singleValue.create;
				delete singleValue.label;
				delete singleValue.value;
				singleValue.key = Math.floor((Math.random() * 10000) + 1);
				LAYERGROUPS.push(singleValue);
			}
		}
	}
	onChangeStyles (value) {
		this.state.valuesStyles = value;
	}
	onObjectClick (value, event) {
		console.log("yay! " + value["key"]);
	}
	
	layerGroupOptionFactory (inputValue) {
		var newOption = {
//				key: Math.floor((Math.random() * 10000) + 1),
				key: inputValue,
				name: inputValue,
				value: inputValue,
				label: inputValue,
				create: true
			};
		return newOption;
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
				
				<div className="object-input-wrapper">
						<label className="container">
							Topics
							<UIObjectSelect 
								multi
								onChange={this.onChangeTopics.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								//loadOptions={this.getScopes}
								options={TOPICS}
								valueKey="key" 
								labelKey="topic" 
								inputProps={selectInputProps} 
								value={this.state.valuesTopics}
							/>
						</label>
						<div className="object-input-wrapper-info"><b>Themes:</b> Land cover, Population</div>
				</div>
				
				
				
				
				<div className="object-input-wrapper">
						<label className="container">
							Layer group
							<UIObjectSelect 
								onChange={this.onChangeGroup.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								//loadOptions={this.getScopes}
								options={LAYERGROUPS}
								allowCreate
								newOptionCreator={this.layerGroupOptionFactory.bind(this)}
								valueKey="key" 
								labelKey="name" 
								inputProps={selectInputProps} 
								value={this.state.valueGroup}
							/>
						</label>
				</div>
				
				<div className="input-wrapper">
					<div>
						<label className="container">
							Styles (symbologies)
							<Select 
								multi
								onChange={this.onChangeStyles.bind(this)}
								//loadOptions={this.getScopes}
								options={STYLES}
								valueKey="key" 
								labelKey="name" 
								inputProps={selectInputProps} 
								value={this.state.valuesStyles}
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
				
				

				
				
				<IconButton name="check" basic color="blue">
					Save
				</IconButton>
				
			</div>
    );

  }
}

export default ConfigMetadataLayerVector;
