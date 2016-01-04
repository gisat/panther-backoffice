import React, { PropTypes, Component } from 'react';
import styles from './ConfigDataLayerRaster.css';
import withStyles from '../../decorators/withStyles';

import { Icon, IconButton, Buttons } from '../SEUI/elements';
import { CheckboxFields, Checkbox } from '../SEUI/modules';
import { Table } from '../SEUI/collections';
import Select from 'react-select';
import _ from 'underscore';
import UIObjectSelect from '../UIObjectSelect';

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

				<IconButton name="check" basic color="blue">
					Save
				</IconButton>

			</div>
		);

	}
}

export default ConfigDataLayerRaster;
