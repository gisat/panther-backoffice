import React, { PropTypes, Component } from 'react';
import styles from './ConfigDataLayerAnalytical.css';
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
const AULEVELS = [
			{ key: 1, name: "AOI" },
			{ key: 2, name: "Core City x Outer Urban Zone" },
			{ key: 3, name: "GADM2" },
			{ key: 4, name: "GADM3" },
			{ key: 5, name: "GADM4" }
		];
const DESTINATIONS = [
			{ key: "I", isAttribute: false, name: 'FID (feature identifier)' },
			{ key: "N", isAttribute: false, name: 'Feature name' },
			{ key: "P", isAttribute: false, name: 'Parent feature identifier' }
		];

@withStyles(styles)
class ConfigDataLayerAnalytical extends Component{
	
	constructor(props) {
		super(props);

		this.state = {
			valueScope: 1,
			valuesPlaces: [2,3],
			valueLevel: 2
		};
		
	}


	onChangeScope (value) {
		this.state.valueScope = value;
	}
	onChangePlaces (values) {
		this.state.valuesPlaces = values;
	}
	onChangeLevel (value) {
		this.state.valueLevel = value;
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
							Level
							<Select 
								onChange={this.onChangeLevel.bind(this)}
								//loadOptions={this.getScopes}
								options={AULEVELS}
								valueKey="key" 
								labelKey="name" 
								inputProps={selectInputProps} 
								value={this.state.valueLevel}
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
				
				<h3>Tabular data</h3>
				<Table celled className="fixed" id="ConfigDataLayerAnalyticalColumnTable">
					<thead>
						<tr>
							<th>Source column</th>
							<th>Use as</th>
						</tr>
					</thead>
					<tbody>

						<tr>
							<td className="header">C_L1_1</td>
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
						</tr>

						<tr>
							<td className="header">C_L2_11</td>
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
						</tr>

						<tr>
							<td className="header">C_L2_12</td>
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
						</tr>

						<tr>
							<td className="header">C_L2_14</td>
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
						</tr>

						<tr>
							<td className="header">ID_0</td>
							<td className="allowOverflow resetui">
								<Select 
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={DESTINATIONS}
									valueKey="key" 
									labelKey="name" 
									//inputProps={selectInputProps} 
									value="P"
								/>
							</td>
						</tr>

						<tr>
							<td className="header">ID_1_CC</td>
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
						</tr>

						<tr>
							<td className="header">ID_2</td>
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
						</tr>

						<tr>
							<td className="header">NAME_0</td>
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
						</tr>

						<tr>
							<td className="header">NAME_1_CC</td>
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
						</tr>

						<tr>
							<td className="header">NAME_2</td>
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
						</tr>

						<tr>
							<td className="header">SUM_pop_00</td>
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
						</tr>

						<tr>
							<td className="header">SUM_pop_10</td>
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
						</tr>

					</tbody>
				</Table>
				
				
				<IconButton name="check" primary>
					Save
				</IconButton>
				
			</div>
    );

  }
}

export default ConfigDataLayerAnalytical;
