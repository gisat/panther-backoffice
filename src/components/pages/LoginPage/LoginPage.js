import React, {PropTypes, Component} from 'react';
import styles from './LoginPage.css';
import withStyles from '../../../decorators/withStyles';
import {login} from '../../../models/UserModel';

import {Input, Button} from '../../SEUI/elements';

@withStyles(styles)
class LoginPage extends Component {
	constructor() {
		super();

		this.state = {
			valueName: "",
			valuePassword: ""
		};
	}

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
	};

	onClick() {
		login(this.state.valueName, this.state.valuePassword);
	}

	nameChanged(event){
		this.setState({valueName: event.target.value});
	}

	passwordChanged(event){
		this.setState({valuePassword: event.target.value});
	}

	render() {
		const title = 'Log In';
		this.context.onSetTitle(title);
		return (
			<div className="full-viewport login-page">
				<div className="login-box frame-wrapper filled">
					<label className="container">
						User
						<Input
							type="text"
							name="name"
							placeholder=" "
							value={this.state.valueName}
							onChange={this.nameChanged.bind(this)}
						/>
					</label>
					<label className="container">
						Passphrase
						<Input
							type="password"
							name="name"
							placeholder=" "
							value={this.state.valuePassword}
							onChange={this.passwordChanged.bind(this)}
						/>
					</label>
					<Button
						basic
						color="blue"
						onClick={this.onClick.bind(this)}
					>
						Log in
					</Button>
				</div>
			</div>
		);
	}

}

export default LoginPage;
