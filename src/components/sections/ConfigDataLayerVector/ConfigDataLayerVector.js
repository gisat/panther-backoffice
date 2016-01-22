import React, { PropTypes, Component } from 'react';
import styles from './ConfigDataLayerVector.css';
import withStyles from '../../../decorators/withStyles';

import { Table } from '../../SEUI/collections';
import Select from 'react-select';
import UIObjectSelect from '../../atoms/UIObjectSelect';



@withStyles(styles)
class ConfigDataLayerVector extends Component{

	static propTypes = {
		disabled: React.PropTypes.bool,
		layerTemplates: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		scopes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		places: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		periods: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		destinations: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		valueTemplate: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		valueScope: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		valuesPlaces: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		valuesPeriods: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		onChangeTemplate: React.PropTypes.func.isRequired,
		onChangeScope: React.PropTypes.func.isRequired,
		onChangePlaces: React.PropTypes.func.isRequired,
		onChangePeriods: React.PropTypes.func.isRequired,
		onObjectClick: React.PropTypes.func.isRequired,
		keyNameOptionFactory: React.PropTypes.func.isRequired
	};

	static defaultProps = {
		disabled: false
	};

	render() {
		return (
			<div>

				<div className="frame-input-wrapper">
						<label className="container">
							Layer template (Name)
							<UIObjectSelect
								onChange={this.props.onChangeTemplate}
								onOptionLabelClick={this.props.onObjectClick}
								options={this.props.layerTemplates}
								allowCreate
								newOptionCreator={this.props.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.props.valueTemplate}
								className="template"
							/>
						</label>
				</div>

				<div className="frame-input-wrapper">
						<label className="container">
							Scope
							<UIObjectSelect
								onChange={this.props.onChangeScope}
								onOptionLabelClick={this.props.onObjectClick}
								options={this.props.scopes}
								allowCreate
								newOptionCreator={this.props.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.props.valueScope}
							/>
						</label>
				</div>

				<div className="frame-input-wrapper">
						<label className="container">
							Places
							<UIObjectSelect
								multi
								onChange={this.props.onChangePlaces}
								onOptionLabelClick={this.props.onObjectClick}
								options={this.props.places}
								allowCreate
								newOptionCreator={this.props.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.props.valuesPlaces}
							/>
						</label>
				</div>

				<div className="frame-input-wrapper">
						<label className="container">
							Imaging/reference periods
							<UIObjectSelect
								multi
								onChange={this.props.onChangePeriods.bind(this)}
								onOptionLabelClick={this.props.onObjectClick}
								options={this.props.periods}
								allowCreate
								newOptionCreator={this.props.keyNameOptionFactory}
								valueKey="key"
								labelKey="name"
								value={this.props.valuesPeriods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
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
									options={this.props.destinations}
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
									options={this.props.periods}
									valueKey="key"
									labelKey="name"
									//inputProps={selectInputProps}
									value=""
								/>
							</td>
						</tr>


					</tbody>
				</Table>

			</div>
		);

	}
}

export default ConfigDataLayerVector;
