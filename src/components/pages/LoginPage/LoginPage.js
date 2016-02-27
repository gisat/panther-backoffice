import React, { PropTypes, Component } from 'react';
import styles from './LoginPage.css';
import withStyles from '../../../decorators/withStyles';

@withStyles(styles)
class LoginPage extends Component {

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
	};

	render() {
		const title = 'Log In';
		this.context.onSetTitle(title);
		return (
			<div className="full-viewport">
				<div className="login-box">
					huehuehue
				</div>
			</div>
		);
	}

}

export default LoginPage;
