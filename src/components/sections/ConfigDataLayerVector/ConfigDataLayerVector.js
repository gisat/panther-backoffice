import React, { PropTypes, Component } from 'react';
import _ from 'underscore';
import Select from 'react-select';

import { Table } from '../../SEUI/collections';

import UIObjectSelect from '../../atoms/UIObjectSelect';
import OptionDestination from '../../atoms/UICustomSelect/OptionDestination';
import SingleValueDestination from '../../atoms/UICustomSelect/SingleValueDestination';
import ColumnTableRow from '../../elements/ColumnTableRow/ColumnTableRow';



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
		columnMap: React.PropTypes.object.isRequired,
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

		let tableRows = [];
		_.each(this.props.columnMap, function(column, columnName){
			let destinationValue = null;
			if(column.valueUseAs.length) {
				let destination = _.findWhere(this.props.destinations, {attributeKey: column.valueUseAs[0]});
				if(!destination){ // Probably I, P or N. (todo) This is really no pretty code.
					destination = _.findWhere(this.props.destinations, {key: column.valueUseAs[0]});
				}
				if(destination && destination.hasOwnProperty("key")) {
					destinationValue = [destination.key];
				}else{
					destinationValue = "[" + (column.valueUseAs[0]) + "]";
					console.error("Attribute "+ column.valueUseAs[0] +" doesn't exist in destinations!");
				}
			}

			tableRows.push((
				<ColumnTableRow
					key={columnName}
					columnName={columnName}
					destinations={this.props.destinations}
					destinationValue={destinationValue}
					periods={this.props.periods}
					selectedPeriods={column.valuesPeriods}
				/>
			));
		}, this);

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



				<h3>Tabular data</h3>{/* todo: Rename? */}
				<Table celled className="fixed" id="ConfigDataLayerVectorColumnTable">
					<thead>
						<tr>
							<th>Source column</th>
							<th>Use as</th>
							<th>Imaging/reference periods</th>
						</tr>
					</thead>
					<tbody>
						{tableRows}
					</tbody>
				</Table>

			</div>
		);

	}
}

export default ConfigDataLayerVector;
