import React, {PropTypes, Component} from 'react';
import ActionCreator from '../../../actions/ActionCreator';

class Invitation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			processing: false,
			message: null,
			error: null,

			valueEmail: ''
		}
	}

	onEmailChangeListener(e) {
		this.setState({
			valueEmail: e.target.value
		});
	}

	onInviteUserListener() {
		this.setState({
			processing: true,
			error: '',
			message: ''
		});
		ActionCreator.inviteUser(this.state.valueEmail, this.onResponseListener.bind(this));
	}

	onResponseListener(response) {
		let state = {
			valueEmail: '',
			processing: false
		};
		if(response.error) {
			state.error = true;
			state.message = response.error;
		} else {
			state.message = response.message
		}
		this.setState(state);
	}

	render() {
		let html = '';

		if(!this.state.processing) {
			let info = '';
			if(this.state.message && !this.state.error) {
				info = (
					<div>
						The user was invited
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
					<h1>Invite user.</h1>

					<div>
						Email: <input type="text" onChange={this.onEmailChangeListener.bind(this)}/>
					</div>
					<div>
						<input type="button" value="Invite" onClick={this.onInviteUserListener.bind(this)}/>
					</div>

					{info}
				</div>
			);
		} else {
			html = (
				<div>
					<h1>Invite user.</h1>

					<div>Sending the invitation.</div>
				</div>
			);
		}

		return html;
	}
}

export default Invitation;
