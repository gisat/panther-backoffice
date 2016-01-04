import React, { PropTypes, Component } from 'react';
import styles from './TestPlaceScreen.css';
import withStyles from '../../decorators/withStyles';

import LinkTableByScopePlace from '../LinkTableByScopePlace';

@withStyles(styles)
class TestPlaceScreen extends Component{
	render() {
		return (
			<div>
				<h1>Place</h1>
				<LinkTableByScopePlace/>
			</div>
		);

	}
}

export default TestPlaceScreen;
