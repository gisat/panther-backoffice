import React, { PropTypes, Component } from 'react';
import styles from './ConfigDataLayer.css';
import withStyles from '../../decorators/withStyles';

import { Icon, IconButton, Buttons } from '../SEUI/elements';
import { CheckboxFields, Checkbox } from '../SEUI/modules';
import { Table } from '../SEUI/collections';
import Select from 'react-select';
import _ from 'underscore';

import ConfigDataLayerVector from '../ConfigDataLayerVector';
import ConfigDataLayerRaster from '../ConfigDataLayerRaster';
import ConfigDataLayerAnalytical from '../ConfigDataLayerAnalytical';


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

@withStyles(styles)
class ConfigDataLayer extends Component{
	
	constructor(props) {
		super(props);

		this.state = {
			layerType: -1
		};
		
	}
	
	onChangeType (key) {
		this.setState({
			layerType: key
		});
	}
	
	componentDidMount() {
		
	}
	
	render() {
		
		// TODO overwrite to hide and keep state
		var layerTypeConfig;
		if(this.state.layerType==0){
			layerTypeConfig = <ConfigDataLayerVector/>;
		}
		else if(this.state.layerType==1){
			layerTypeConfig = <ConfigDataLayerRaster/>;
		}
		else if(this.state.layerType==2){
			layerTypeConfig = <ConfigDataLayerAnalytical/>;
		}
		else {
			layerTypeConfig = <span>Select layer type</span>;
		}
		
		return (
      <div>
				
				<div className="dataLayerTypeSelect">
				<span>Layer type</span>
				<CheckboxFields 
					type="grouped" 
					radio 
					name="dl-722" 
					onChange={this.onChangeType.bind(this)}
				>
					<Checkbox key="0">
						Vector layer
					</Checkbox>
					<Checkbox key="1">
						Raster layer
					</Checkbox>
					<Checkbox key="2">
						Analytical units layer
					</Checkbox>
				</CheckboxFields>
				</div>
				
				
				{layerTypeConfig}
				
			</div>
    );

  }
}

export default ConfigDataLayer;
