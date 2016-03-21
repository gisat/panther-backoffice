import React, { PropTypes, Component } from 'react';
import styles from './LoginPage.css';
import withStyles from '../../../decorators/withStyles';

import { Input, Button } from '../../SEUI/elements';

@withStyles(styles)
class LoginPage extends Component {

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
	};

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
							//value={this.state.valueName}
							//onChange={this.onChangeName.bind(this)}
						/>
					</label>
					<label className="container">
						Passphrase
						<Input
							type="password"
							name="name"
							placeholder=" "
							//value={this.state.valueName}
							//onChange={this.onChangeName.bind(this)}
						/>
					</label>
					<Button
						basic
						color="blue"
					>
						Log in
					</Button>
				</div>
			</div>
		);
	}

}

export default LoginPage;
