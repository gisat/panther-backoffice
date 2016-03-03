import React, { PropTypes, Component } from 'react';
import styles from './ConfigPlaceDataSource.css';
import withStyles from '../../../decorators/withStyles';

import UISVG from '../../atoms/UISVG';
import UIScreenButton from '../../atoms/UIScreenButton';
import SaveButton from '../../atoms/SaveButton';

import { Icon, IconButton } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import { Table } from '../../SEUI/collections';
import Select from 'react-select';

import ConfigPlaceDataSourcePeriod from '../ConfigPlaceDataSourcePeriod';


@withStyles(styles)
class ConfigPlaceDataSource extends Component {



	render() {
		return (
			<div>

				<ConfigPlaceDataSourcePeriod/>

			</div>
		);

	}
}

export default ConfigPlaceDataSource;
