import React, { PropTypes, Component } from 'react';
import styles from './ConfigDataLayerVector.css';
import withStyles from '../../decorators/withStyles';

import { Icon, IconButton, Buttons } from '../SEUI/elements';
import { CheckboxFields, Checkbox } from '../SEUI/modules';
import { Table } from '../SEUI/collections';
import Select from 'react-select';
import _ from 'underscore';
import UIObjectSelect from '../UIObjectSelect';

const LAYERTEMPLATES = [
			{ key: 1, name: 'Road network' },
			{ key: 2, name: 'Hospitals' },
			{ key: 3, name: 'Land cover' },
			{ key: 4, name: 'Land cover change' },
			{ key: 5, name: 'Possible low-income settlements (areals)' },
			{ key: 7, name: 'Possible low-income settlements (mid-points)' }
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
			{ key: 625, scope: 3, place: 'East Asia and Pacific' }
		];
const DESTINATIONS = [
			{ key: "I", isAttribute: false, name: 'FID (feature identifier)' },
			{ key: "N", isAttribute: false, name: 'Feature name' },
			{ key: 220, isAttribute: true, attset: "Change code", name: 'LCF code' },
			{ key: 221, isAttribute: true, attset: "Change code", name: 'Current code' },
			{ key: 222, isAttribute: true, attset: "Change code", name: 'Previous code' },
			{ key: 223, isAttribute: true, attset: "Change code", name: 'UF code' },
			{ key: 287, isAttribute: true, attset: "Status code", name: 'Code' },
			{ key: 315, isAttribute: true, attset: "Aggregated LC Classes", name: 'Urban fabric' },
			{ key: 316, isAttribute: true, attset: "Aggregated LC Classes", name: 'Artificial areas' },
			{ key: 317, isAttribute: true, attset: "Aggregated LC Classes", name: 'Natural and semi-natural areas' },
			{ key: 318, isAttribute: true, attset: "Aggregated LC Classes", name: 'Water' }
		];
const PERIODS = [
			{ key: 1, name: '1990' },
			{ key: 2, name: '2000' },
			{ key: 3, name: '2010' }
		];

@withStyles(styles)
class ConfigDataLayerVector extends Component{
	
	constructor(props) {
		super(props);

		this.state = {
			valueTemplate: 4,
			valueScope: 1,
			valuesPlaces: [2,3],
			valuesPeriods: [3]
		};
		
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
	
	onChangeTemplate (value, values) {
		values = this.handleNewObjects(values, LAYERTEMPLATES);
		this.setState({
			valueTemplate: values
		});
	}
	
	onChangeScope (value, values) {
		values = this.handleNewObjects(values, SCOPES);
		this.setState({
			valueScope: values
		});
	}
	
	onChangePlaces (value, values) {
		values = this.handleNewObjects(values, PLACES);
		this.setState({
			valuesPlaces: values
		});
	}
	
	onChangePeriods (value, values) {
		values = this.handleNewObjects(values, PERIODS);
		this.setState({
			valuesPeriods: values
		});
	}	
	
	
	onObjectClick (value, event) {
		console.log("yay! " + value["key"]);
	}
	
	
	scopeOptionFactory (inputValue) {
		var newOption = {
				key: inputValue,
				scope: inputValue,
				value: inputValue,
				label: inputValue,
				create: true
			};
		return newOption;
	}
	placeOptionFactory (inputValue) {
		var newOption = {
				key: inputValue,
				place: inputValue,
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
		
		
		
	}
	
	render() {
		
		var selectInputProps = {
			className: "" //"ui input"
		};
		
		return (
      <div>
				
				<div className="frame-input-wrapper">
						<label className="container">
							Layer template (Name)
							<UIObjectSelect 
								onChange={this.onChangeTemplate.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								//loadOptions={this.getScopes}
								options={LAYERTEMPLATES}
								allowCreate
								newOptionCreator={this.keyNameOptionFactory.bind(this)}
								valueKey="key"
								labelKey="name"
								value={this.state.valueTemplate}
								className="template"
							/>
						</label>
				</div>
				
				<div className="frame-input-wrapper">
						<label className="container">
							Scope
							<UIObjectSelect 
								onChange={this.onChangeScope.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								//loadOptions={this.getScopes}
								options={SCOPES}
								allowCreate
								newOptionCreator={this.scopeOptionFactory.bind(this)}
								valueKey="key"
								labelKey="scope"
								value={this.state.valueScope}
							/>
						</label>
				</div>
				
				<div className="frame-input-wrapper">
						<label className="container">
							Places
							<UIObjectSelect 
								multi
								onChange={this.onChangePlaces.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								//loadOptions={this.getScopes}
								options={PLACES}
								allowCreate
								newOptionCreator={this.placeOptionFactory.bind(this)}
								valueKey="key"
								labelKey="place"
								value={this.state.valuesPlaces}
							/>
						</label>
				</div>
				
				<div className="frame-input-wrapper">
						<label className="container">
							Imaging/reference periods
							<UIObjectSelect 
								multi
								onChange={this.onChangePeriods.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								//loadOptions={this.getScopes}
								options={PERIODS}
								allowCreate
								newOptionCreator={this.keyNameOptionFactory.bind(this)}
								valueKey="key"
								labelKey="name"
								value={this.state.valuesPeriods}
							/>
						</label>
				</div>
				
				
				
				<h3>Tabular data</h3>
				<Table celled className="fixed" id="ConfigDataLayerVectorColumnTable">
					<thead>
						<tr>
							<th>Source column</th>
							<th>Use as</th>
							<th>Imaging/reference periods</th>
						</tr>
					</thead>
					<tbody>

						<tr>
							<td className="header">code_00</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value="222"
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">code_10</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value="221"
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">poly_ID</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value="I"
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">CO</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">FO</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">LCF</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">LCF_N</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">Shape_Leng</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">Shape_Area</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">AC_00</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">AC_10</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">UF</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>

						<tr>
							<td className="header">name</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value="N"
								/>
							</td>
							<td className="allowOverflow resetui">
								<UIObjectSelect 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									multi 
									options={PERIODS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value=""
								/>
							</td>
						</tr>


					</tbody>
				</Table>
				
				
				<IconButton name="check" basic color="blue">
					Save
				</IconButton>
				
			</div>
    );

  }
}

export default ConfigDataLayerVector;
