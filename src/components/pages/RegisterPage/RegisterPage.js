import React, {PropTypes, Component} from 'react';
import ActionCreator from '../../../actions/ActionCreator';
import {baseUrl} from '../../../config';

class RegisterPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			error: false,
			message: null,
			valueName: '',
			valuePassword: '',
			valuePasswordConfirmation: ''
		}
	}

	onChangeNameListener(e){
		this.setState({
			valueName: e.target.value
		});
	}

	onChangePasswordListener(e) {
		this.setState({
			valuePassword: e.target.value
		});
	}

	onChangePasswordConfirmationListener(e) {
		this.setState({
			valuePasswordConfirmation: e.target.value
		});
	}

	onCreateUserListener() {
		if(this.state.valuePassword != this.state.valuePasswordConfirmation) {
			this.setState({
				error: true,
				message: 'The password and confirmation password differs.'
			});
		} else {
			this.setState({
				error: false,
				message: null,
				processing: true
			});
			let parsedUrl = new URL(window.location.href);
			ActionCreator.createUser(parsedUrl.searchParams.get("hash"), this.state.valueName, this.state.valuePassword, this.onCreateUserResponseListener.bind(this));
		}
	}

	onCreateUserResponseListener(response) {
		// If the user was correctly registered, log him in and redirect to the system.
		if(!response.error) {
			ActionCreator.login(this.state.valueName, this.state.valuePassword, new UUID().toString(), this.onLoginResponse.bind(this));
		} else {
			this.setState({
				valueName: '',
				valuePassword: '',
				valuePasswordConfirmation: '',
				processing: false,
				error: true,
				message: response.error
			});
		}
	}

	onLoginResponse(response) {
		window.location = baseUrl;
	}

	render() {
		let html = '';

		if(!this.state.processing) {
			let info = '';
			if(this.state.message && !this.state.error) {
				info = (
					<div>
						The user was created
					</div>
				);
			} else if(this.state.error) {
				info = (
					<div className="error">
						{this.state.message}
					</div>
				)
			}

			html = (
				<div>
					<h1>Register.</h1>

					<div>
						<label>Name: <input type="text" onChange={this.onChangeNameListener.bind(this)} /></label>
					</div>

					<div>
						<label>Password: <input type="password" onChange={this.onChangePasswordListener.bind(this)} /></label>
					</div>

					<div>
						<label>Password (Retype): <input type="password"  onChange={this.onChangePasswordConfirmationListener.bind(this)}/></label>
					</div>

					<div>
						<input type="button" value="Create" onClick={this.onCreateUserListener.bind(this)} />
					</div>

					{info}
				</div>
			);
		} else {
			html = (
				<div>
					<h1>Register.</h1>

					<div>Registration is in progress.</div>
				</div>
			);
		}

		return html;
	}
}

export default RegisterPage;
