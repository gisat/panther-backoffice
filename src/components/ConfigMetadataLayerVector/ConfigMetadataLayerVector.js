import React, { PropTypes, Component } from 'react';
import styles from './ConfigMetadataLayerVector.css';
import withStyles from '../../decorators/withStyles';

import { Input, Icon, IconButton, Buttons } from '../SEUI/elements';
import { CheckboxFields, Checkbox } from '../SEUI/modules';
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
const LAYERGROUPS = [
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
	onChangeStyles (values) {
		this.state.valuesStyles = values;
	}
	
	
	componentDidMount() {
		
		
		
	}
	
	render() {
		
		var selectInputProps = {
			className: "" //"ui input"
		};
		
		return (
      <div>
				
				<div className="input-wrapper">
					<div>
						<label className="container">
							Name
							<Input type="text" name="name" placeholder=" " value="Land cover" />
						</label>
					</div>
					<div>
						<Buttons icon>
							<IconButton name="write" />
							<IconButton name="plus" />
						</Buttons>
					</div>
				</div>
				

				
				
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
				
				<span><b>Themes:</b> Land cover, Population</span>
				
				
				<div className="input-wrapper">
					<div>
						<label className="container">
							Layer group
							<Select 
								onChange={this.onChangeGroup.bind(this)}
								//loadOptions={this.getScopes}
								options={LAYERGROUPS}
								valueKey="key" 
								labelKey="name" 
								inputProps={selectInputProps} 
								value={this.state.valueGroup}
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
