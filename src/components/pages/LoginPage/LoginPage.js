import React, {PropTypes, Component} from 'react';
import styles from './LoginPage.css';
import withStyles from '../../../decorators/withStyles';
import {login} from '../../../models/UserModel';
import Location from '../../../core/Location';
import {publicPath} from '../../../config';

import {Input, Button} from '../../SEUI/elements';

@withStyles(styles)
class LoginPage extends Component {
	constructor() {
		super();

		this.state = {
			valueName: "",
			valuePassword: "",
			error: ""
		};
	}

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired
	};

	onClick() {
		this.setState({error: ''});
		login(this.state.valueName, this.state.valuePassword, this.requestEnd.bind(this));
	}

	requestEnd(result) {
		if(result.err) {
			this.setState({error: "Invalid login information"});
		} else {
			Location.pushState(
				null, publicPath + "/"
			);
		}
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
					<label className="container">
						{this.state.error}
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
