import React, { PropTypes, Component } from 'react';
//import styles from './ColumnTableRow.css';
//import withStyles from '../../../decorators/withStyles';

import Select from 'react-select';
import UIObjectSelect from '../../atoms/UIObjectSelect';

import OptionDestination from '../../atoms/UICustomSelect/OptionDestination';
import SingleValueDestination from '../../atoms/UICustomSelect/SingleValueDestination';


//@withStyles(styles)
class ColumnTableRow extends Component {

	static propTypes = {
		columnName: React.PropTypes.string.isRequired,
		destinations: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		periods: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		onChangeDestination: React.PropTypes.func,
		onChangePeriods: React.PropTypes.func,
		destinationValue: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		])),
		selectedPeriods: React.PropTypes.arrayOf(React.PropTypes.number)
	};

	render() {

		var periodSelect = "";

		if(!this.props.destinationValue || (this.props.destinationValue[0]!="I" && this.props.destinationValue[0]!="N" && this.props.destinationValue[0]!="P")) {
			periodSelect = (
				<UIObjectSelect
					//onChange={this.props.onChangePeriods.bind(this,this.props.columnName)}
					//loadOptions={this.getPlaces}
					multi
					options={this.props.periods}
					valueKey="key"
					labelKey="name"
					allowCreate
					newOptionCreator={this.props.keyNameOptionFactory}
					//inputProps={selectInputProps}
					value={this.props.selectedPeriods}
				/>
			);
		}

		return(
			<tr>
				<td className="header">{this.props.columnName}</td>
				<td className="allowOverflow resetui">
					<Select
						onChange={this.props.onChangeDestination.bind(null,this.props.columnName)}
						//loadOptions={this.getPlaces}
						options={this.props.destinations}
						optionComponent={OptionDestination}
						singleValueComponent={SingleValueDestination}
						valueKey="key"
						labelKey="name"
						//inputProps={selectInputProps}
						value={this.props.destinationValue}
					/>
				</td>
				<td className="allowOverflow resetui">
					{periodSelect}
				</td>
			</tr>
		);
	}
}

export default ColumnTableRow;
