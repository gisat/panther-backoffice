import React, { PropTypes, Component } from 'react';
import styles from './ConfigDataLayerAnalytical.css';
import withStyles from '../../../decorators/withStyles';

import { Icon, IconButton, Buttons } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import { Table } from '../../SEUI/collections';
import Select from 'react-select';
import _ from 'underscore';
import UIObjectSelect from '../../atoms/UIObjectSelect';
import SaveButton from '../../atoms/SaveButton';

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
const PERIODS = [
			{ key: 1, name: '1990' },
			{ key: 2, name: '2000' },
			{ key: 3, name: '2010' }
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

	onChangeLevel (value, values) {
		values = this.handleNewObjects(values, AULEVELS);
		this.setState({
			valueLevel: values
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
							Level
							<UIObjectSelect
								onChange={this.onChangeLevel.bind(this)}
								onOptionLabelClick={this.onObjectClick.bind(this)}
								//loadOptions={this.getScopes}
								options={AULEVELS}
								allowCreate
								newOptionCreator={this.keyNameOptionFactory.bind(this)}
								valueKey="key"
								labelKey="name"
								value={this.state.valueLevel}
							/>
						</label>
				</div>

				<h3>Tabular data</h3>
				<Table celled className="fixed" id="ConfigDataLayerAnalyticalColumnTable">
					<thead>
						<tr>
							<th>Source column</th>
							<th>Use as</th>
							<th>Imaging/reference periods</th>
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


				<SaveButton saved />

			</div>
		);

	}
}

export default ConfigDataLayerAnalytical;
