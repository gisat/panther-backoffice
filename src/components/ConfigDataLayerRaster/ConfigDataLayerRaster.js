import React, { PropTypes, Component } from 'react';
import styles from './ConfigDataLayerRaster.css';
import withStyles from '../../decorators/withStyles';

import { Icon, IconButton, Buttons } from '../SEUI/elements';
import { CheckboxFields, Checkbox } from '../SEUI/modules';
import { Table } from '../SEUI/collections';
import Select from 'react-select';
import _ from 'underscore';

const SCOPES = [
			{ key: 1, scope: 'Local' },
			{ key: 2, scope: 'National' },
			{ key: 3, scope: 'Regional' }
		];
const PLACES = [
			{ key: 1, scope: 1, place: 'Cebu City' },
			{ key: 2, scope: 1, place: 'Hai Phong' },
			{ key: 3, scope: 1, place: 'Ho Chi Minh City' },
			{ key: 4, scope: 1, place: 'Surabaya' },
			{ key: 52, scope: 2, place: 'Brunei' },
			{ key: 74, scope: 2, place: 'Japan' },
			{ key: 82, scope: 2, place: 'Laos' },
			{ key: 135, scope: 2, place: 'Vietnam' },
			{ key: 625, scope: 3, place: 'East Asia and Pacific' },
		];
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

@withStyles(styles)
class ConfigDataLayerRaster extends Component{
	
	constructor(props) {
		super(props);

		this.state = {
			valueScope: 1,
			valuesPlaces: [2,3],
			valuesTopics: [12,22],
			valueGroup: 2
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
	
	onChangeScope (value) {
		this.state.valueScope = value;
	}
	onChangePlaces (values) {
		this.state.valuesPlaces = values;
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
					
				
				<div className="input-wrapper">
					<div>
						<label className="container">
							Scope
							<Select 
								onChange={this.onChangeScope.bind(this)}
								//loadOptions={this.getScopes}
								options={SCOPES}
								valueKey="key" 
								labelKey="scope" 
								inputProps={selectInputProps} 
								value={this.state.valueScope}
							/>
						</label>
					</div>
					<div>
						<Buttons basic icon>
							<IconButton name="write" />
							<IconButton name="plus" />
						</Buttons>
					</div>
				</div>
					
				<div className="input-wrapper">
					<div>
						<label className="container">
							Places
							<Select 
								multi
								onChange={this.onChangePlaces.bind(this)}
								//loadOptions={this.getScopes}
								options={PLACES}
								valueKey="key" 
								labelKey="place" 
								inputProps={selectInputProps} 
								value={this.state.valuesPlaces}
							/>
						</label>
					</div>
					<div>
						<Buttons basic icon>
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
						<Buttons basic icon>
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
						<Buttons basic icon>
							<IconButton name="write" />
							<IconButton name="plus" />
						</Buttons>
					</div>
				</div>

				
			</div>
    );

  }
}

export default ConfigDataLayerRaster;
