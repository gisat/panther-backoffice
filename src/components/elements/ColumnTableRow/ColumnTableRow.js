import React, { PropTypes, Component } from 'react';
//import styles from './ColumnTableRow.css';
//import withStyles from '../../../decorators/withStyles';

import Select from 'react-select';
import UIObjectSelect from '../../atoms/UIObjectSelect';

//@withStyles(styles)
class ColumnTableRow extends Component {

	static propTypes = {
		columnName: React.PropTypes.string.isRequired,
		destinations: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		periods: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		destinationValue: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
		selectedPeriods: React.PropTypes.arrayOf(React.PropTypes.number)
	};

	render() {
		return(
			<tr>
				<td className="header">{this.props.columnName}</td>
				<td className="allowOverflow resetui">
					<Select
						//onChange={this.onChangeDestination.bind(this)}
						//loadOptions={this.getPlaces}
						options={this.props.destinations}
						valueKey="key"
						labelKey="name"
						//inputProps={selectInputProps}
						value={this.props.destinationValue}
					/>
				</td>
				<td className="allowOverflow resetui">
					<UIObjectSelect
						//onChange={this.onChangePeriod.bind(this)}
						//loadOptions={this.getPlaces}
						multi
						options={this.props.periods}
						valueKey="key"
						labelKey="name"
						//inputProps={selectInputProps}
						value={this.props.selectedPeriods}
					/>
				</td>
			</tr>
		);
	}
}

export default ColumnTableRow;
