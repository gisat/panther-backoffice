import React, { PropTypes, Component } from 'react'; 
import PantherComponent from '../../common/PantherComponent';
import _ from 'underscore';
import Select from 'react-select';

import { Table } from '../../SEUI/collections';

import utils from '../../../utils/utils';
import ObjectTypes from '../../../constants/ObjectTypes';

import UIObjectSelect from '../../atoms/UIObjectSelect';
import OptionDestination from '../../atoms/UICustomSelect/OptionDestination';
import SingleValueDestination from '../../atoms/UICustomSelect/SingleValueDestination';
import ColumnTableRow from '../../elements/ColumnTableRow/ColumnTableRow';

import logger from '../../../core/Logger';

class ConfigDataLayerAnalytical extends PantherComponent{

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
		onChangeColumnTableDestination: React.PropTypes.func,
		onChangeColumnTablePeriods: React.PropTypes.func
	};

	static defaultProps = {
		disabled: false
	};

	render() {

		let layerPeriods = [];
		if(this.props.valueScope && this.props.valueScope.length) {
			let scope = _.findWhere(this.props.scopes,{key: this.props.valueScope[0]});
			layerPeriods = scope.periods;
		}

		let tableRows = [];
		_.each(this.props.columnMap, function(column, columnName){
			let destinationValue = null;
			let destination = null;
			if(column.valueUseAs.length) {
				destination = _.findWhere(this.props.destinations, {key: column.valueUseAs[0]});
				if(destination && destination.hasOwnProperty("key")) {
					destinationValue = [destination.key];
				}else{
					destination = null;
					column.valuesPeriods = null;
					// destinationValue = "[" + (column.valueUseAs[0]) + "]";
					logger.error("ConfigDataLayerAnalytical# render(), Attribute "+ column.valueUseAs[0] +" doesn't exist in AU destinations!");
				}
			}

			tableRows.push((
				<ColumnTableRow
					key={columnName}
					columnName={columnName}
					destinations={this.props.destinations}
					destinationValue={destinationValue}
					destinationObject={destination}
					periods={layerPeriods}
					selectedPeriods={column.valuesPeriods}
					onChangeDestination={this.props.onChangeColumnTableDestination.bind(null,"au")}
					onChangePeriods={this.props.onChangeColumnTablePeriods.bind(null,"au")}
					onObjectClick={this.props.onObjectClick}
				/>
			));
		}, this);

		return (
			<div>

				<div className="frame-input-wrapper">
					<label className="container">
						Scope
						<UIObjectSelect
							onChange={this.props.onChangeScope}
							onOptionLabelClick={this.props.onObjectClick.bind(this, ObjectTypes.SCOPE)}
							options={this.props.scopes}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
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
							onOptionLabelClick={this.props.onObjectClick.bind(this, ObjectTypes.PLACE)}
							options={this.props.places}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
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
							onOptionLabelClick={this.props.onObjectClick.bind(this, ObjectTypes.AU_LEVEL)}
							options={this.props.levels}
							allowCreate
							newOptionCreator={utils.keyNameOptionFactory}
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
						{tableRows}
					</tbody>
				</Table>

			</div>
		);

	}
}

export default ConfigDataLayerAnalytical;
