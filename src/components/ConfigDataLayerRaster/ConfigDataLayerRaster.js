import React, { PropTypes, Component } from 'react';
import styles from './ConfigDataLayerRaster.css';
import withStyles from '../../decorators/withStyles';

import { Icon, IconButton, Buttons } from '../SEUI/elements';
import { CheckboxFields, Checkbox } from '../SEUI/modules';
import { Table } from '../SEUI/collections';
import Select from 'react-select';
import _ from 'underscore';

const LAYERTEMPLATES = [
			{ key: 1, name: 'Population grid' },
			{ key: 2, name: 'Population density grid' },
			{ key: 3, name: 'Urban expansion grid' },
			{ key: 4, name: 'Urban areas' },
			{ key: 5, name: 'Global urban footprint' }
		];
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
const PERIODS = [
			{ key: 1, name: '1990' },
			{ key: 2, name: '2000' },
			{ key: 3, name: '2010' }
		];

@withStyles(styles)
class ConfigDataLayerRaster extends Component{
	
	constructor(props) {
		super(props);

		this.state = {
			valueTemplate: 2,
			valueScope: 1,
			valuesPlaces: [2,3],
			valuesPeriods: [2]
		};
		
	}
	
	onChangeTemplate (value) {
		this.state.valueTemplate = value;
	}
	onChangeScope (value) {
		this.state.valueScope = value;
	}
	onChangePlaces (values) {
		this.state.valuesPlaces = values;
	}
	onChangePeriods (values) {
		this.state.valuesPeriods = values;
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
							Layer template (Name)
							<Select 
								onChange={this.onChangeTemplate.bind(this)}
								//loadOptions={this.getScopes}
								options={LAYERTEMPLATES}
								valueKey="key" 
								labelKey="name" 
								inputProps={selectInputProps} 
								value={this.state.valueTemplate}
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
						<Buttons icon>
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
						<Buttons icon>
							<IconButton name="write" />
							<IconButton name="plus" />
						</Buttons>
					</div>
				</div>
				
				
				<div className="input-wrapper">
					<div>
						<label className="container">
							Imaging/reference periods
							<Select 
								multi
								onChange={this.onChangePeriods.bind(this)}
								//loadOptions={this.getScopes}
								options={PERIODS}
								valueKey="key" 
								labelKey="name" 
								inputProps={selectInputProps} 
								value={this.state.valuesPeriods}
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
				
				<IconButton name="check" primary>
					Save
				</IconButton>
				
			</div>
    );

  }
}

export default ConfigDataLayerRaster;
