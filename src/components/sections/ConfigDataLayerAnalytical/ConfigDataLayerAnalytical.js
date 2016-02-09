import React, { PropTypes, Component } from 'react';
//import styles from './ConfigDataLayerAnalytical.css';
//import withStyles from '../../../decorators/withStyles';

import { Table } from '../../SEUI/collections';
import Select from 'react-select';
import UIObjectSelect from '../../atoms/UIObjectSelect';

import OptionDestination from '../../atoms/UICustomSelect/OptionDestination';
import SingleValueDestination from '../../atoms/UICustomSelect/SingleValueDestination';
import ColumnTableRow from '../../elements/ColumnTableRow/ColumnTableRow';


//@withStyles(styles)
class ConfigDataLayerAnalytical extends Component{

	static propTypes = {
		disabled: React.PropTypes.bool,
		levels: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		scopes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		places: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		periods: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		destinations: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		valueLevel: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		valueScope: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		valuesPlaces: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		columnMap: React.PropTypes.object.isRequired,
		onChangeLevel: React.PropTypes.func.isRequired,
		onChangeScope: React.PropTypes.func.isRequired,
		onChangePlaces: React.PropTypes.func.isRequired,
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
						Level
						<UIObjectSelect
							onChange={this.props.onChangeLevel}
							onOptionLabelClick={this.props.onObjectClick}
							options={this.props.levels}
							allowCreate
							newOptionCreator={this.props.keyNameOptionFactory}
							valueKey="key"
							labelKey="name"
							value={this.props.valueLevel}
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


					<ColumnTableRow
						columnName="TEST2"
						destinations={this.props.destinations}
						destinationValue="P"
						periods={this.props.periods}
						selectedPeriods={[278]}
					/>
					<ColumnTableRow
						columnName="TEST3"
						destinations={this.props.destinations}
						periods={this.props.periods}
					/>


					{/*<tr>
							<td className="header">C_L1_1</td>
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
							<td className="header">C_L2_11</td>
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
							<td className="header">C_L2_12</td>
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
							<td className="header">C_L2_14</td>
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
							<td className="header">ID_0</td>
							<td className="allowOverflow resetui">
								<Select
									//onChange={this.onChangeAttSet.bind(this)}
									//loadOptions={this.getPlaces}
									options={this.props.destinations}
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
									options={this.props.periods}
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
							<td className="header">ID_2</td>
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
							<td className="header">NAME_0</td>
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
							<td className="header">NAME_1_CC</td>
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
							<td className="header">NAME_2</td>
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
							<td className="header">SUM_pop_00</td>
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
							<td className="header">SUM_pop_10</td>
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
						</tr>*/}

					</tbody>
				</Table>

			</div>
		);

	}
}

export default ConfigDataLayerAnalytical;
