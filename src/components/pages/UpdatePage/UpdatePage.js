import React, {PropTypes, Component} from 'react';
import ActionCreator from '../../../actions/ActionCreator';
import UserStore from '../../../stores/UserStore';

import utils from '../../../utils/utils';

let initialState = {
	error: false,
	message: null,
	valueName: '',
	valueUsername: '',
	valuePassword: '',
	valuePasswordConfirmation: ''
};

class UpdatePage extends Component {
	constructor(props) {
		super(props);
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

	onChangeUsernameListener(e) {
		this.setState({
			valueUsername: e.target.value
		});
	}

	onUpdateUserListener() {
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
			UserStore.getLogged().then(user => {
				ActionCreator.createUser(user.id, this.state.valueName, this.state.valuePassword, this.state.valueUsername, this.onUpdateUserResponseListener.bind(this));
			});
		}
	}

	onUpdateUserResponseListener(response) {
		// If the user was correctly registered, log him in and redirect to the system.
		if(!response.error) {
			ActionCreator.login(this.state.valueName, this.state.valuePassword,new UUID().toString());
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
					<h1>Update user information.</h1>

					<div>
						<label>Username: <input type="text" onChange={this.onChangeUsernameListener.bind(this)} /></label>
					</div>

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
						<input type="button" value="Create" onClick={this.onUpdateUserListener.bind(this)} />
					</div>

					{info}
				</div>
			);
		} else {
			html = (
				<div>
					<h1>Update user information.</h1>

					<div>Update is in progress.</div>
				</div>
			);
		}

		return html;
	}
}

export default UpdatePage;
