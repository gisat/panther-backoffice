import React, { PropTypes, Component } from 'react';
import styles from './FabulousNewScreen.css';
import withStyles from '../../../decorators/withStyles';


@withStyles(styles)
class FabulousNewScreen extends Component{


	render() {
		return (
			<div>
				This is fabulous new screen.<br/>
				And this is a message:<br/>

			</div>
		);
	}

}


export default FabulousNewScreen;
