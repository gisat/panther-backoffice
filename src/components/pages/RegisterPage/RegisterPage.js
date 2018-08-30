import React, {Component, PropTypes} from 'react';
import ActionCreator from '../../../actions/ActionCreator';
import {baseUrl} from '../../../config';
import styles from './RegisterPage.css';
import UUID from '../../../utils/UUID';

import {Button, Input} from '../../SEUI/elements';
import Loader from '../../atoms/Loader';
import withStyles from "../../../decorators/withStyles";

@withStyles(styles)
class RegisterPage extends Component {
	
	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired
	};
	
	constructor(props) {
		super(props);

		this.state = {
			error: false,
			message: null,
			valueHash: '',
			valueEmail: '',
			valueName: '',
			valuePhone: '',
			valuePassphrase: '',
			valuePassphraseRepeat: ''
		};
		
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangePhone = this.onChangePhone.bind(this);
		this.onChangePassphrase = this.onChangePassphrase.bind(this);
		this.onChangePassphraseRepeat = this.onChangePassphraseRepeat.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCreateUserResponse = this.onCreateUserResponse.bind(this);
		this.onInvitationLoaded = this.onInvitationLoaded.bind(this);
	}
	
	componentDidMount() {
		this.setState({
			ready: true
		});
		this.loadInvitation()
	}
	
	loadInvitation() {
		let parsedUrl = new URL(window.location.href);
		let hash =  parsedUrl.searchParams.get("hash");
		if (hash) {
			ActionCreator.loadInvitation(hash, this.onInvitationLoaded);
		}
	}
	
	onInvitationLoaded(result) {
		if (result.error) {
			this.setState({
				error: true,
				errorMessage: 'Invalid, used or expired invitation'
			});
		} else if (result.ok && result.ok) {
			this.setState({
				valueHash: result.ok.body.data.hash,
				valueEmail: result.ok.body.data.email
			});
		}
	}

	onChangeName(e){
		this.setState({
			valueName: e.target.value
		});
	}

	onChangePhone(e) {
		this.setState({
			valuePhone: e.target.value
		})
	}
	
	onChangePassphrase(e) {
		this.setState({
			valuePassphrase: e.target.value
		});
	}
	
	onChangePassphraseRepeat(e) {
		this.setState({
			valuePassphraseRepeat: e.target.value
		});
	}

	onSubmit() {
		if(this.state.valuePassphrase !== this.state.valuePassphraseRepeat) {
			this.setState({
				error: true,
				errorMessage: 'The password and confirmation password differs.'
			});
		} else {
			this.setState({
				error: false,
				errorMessage: null,
				processing: true
			});
			ActionCreator.createUser(this.state.valueHash, this.state.valueName, this.state.valuePassphrase, this.state.valuePhone, this.onCreateUserResponse);
		}
	}

	onCreateUserResponse(response) {
		// If the user was correctly registered, log him in and redirect to the system.
		if(!response.error) {
			ActionCreator.login(this.state.valueEmail, this.state.valuePassphrase, new UUID().toString(), this.onLoginResponse);
		} else {
			this.setState({
				valueEmail: '',
				valueName: '',
				valuePhone: '',
				valuePassphrase: '',
				valuePassphraseRepeat: '',
				processing: false,
				error: true,
				errorMessage: response.error
			});
		}
	}

	onLoginResponse(response) {
		window.location = baseUrl; // TODO: Configure properly.
	}

	render() {
		
		const title = 'Register';
		this.context.onSetTitle(title);
		let registerBoxInsert = null, errorInsert = null;
		
		if (this.state.errorMessage) {
			errorInsert = (
				<div className="register-box-error error">
					<div className="register-box-error-message">
						{this.state.errorMessage}
					</div>
				</div>
			);
		} else {
			errorInsert = (
				<div className="register-box-error">
					<div className="register-box-error-message"></div>
				</div>
			);
		}
		
		if(!this.state.processing) {
			if (this.state.ready) {
				
				registerBoxInsert = (
					<div className="register-box frame-wrapper filled">
						<div className="register-box-content">
							<label className="container">
								E-mail (login)
								<Input
									disabled
									type="text"
									name="email"
									placeholder=" "
									value={this.state.valueEmail}
								/>
							</label>
							<label className="container">
								Name
								<Input
									type="text"
									name="name"
									placeholder=" "
									value={this.state.valueName}
									onChange={this.onChangeName}
								/>
							</label>
							<label className="container">
								Phone
								<Input
									type="text"
									name="phone"
									placeholder=" "
									value={this.state.valuePhone}
									onChange={this.onChangePhone}
								/>
							</label>
							<label className="container">
								Passphrase
								<Input
									type="password"
									name="pass"
									placeholder=" "
									value={this.state.valuePassphrase}
									onChange={this.onChangePassphrase}
								/>
							</label>
							<label className="container">
								Passphrase (repeat)
								<Input
									type="password"
									name="passRepeat"
									placeholder=" "
									value={this.state.valuePassphraseRepeat}
									onChange={this.onChangePassphraseRepeat}
								/>
							</label>
							<Button
								basic
								color="blue"
								onClick={this.onSubmit}
								disabled={!(this.state.valueHash && this.state.valueEmail && this.state.valuePassphrase && (this.state.valuePassphrase === this.state.valuePassphraseRepeat))}
							>
								Register
							</Button>
						</div>
						{errorInsert}
					</div>
				);
				
			} else {
				
				registerBoxInsert = (
					<div className="register-box frame-wrapper filled loading">
						<Loader/>
					</div>
				);
				
			}
			
		} else {
			// processing
			registerBoxInsert = (
				<div className="register-box frame-wrapper filled loading">
					<Loader/>
				</div>
			);
			
		}
		
		return (
			<div className="full-viewport register-page">
				{registerBoxInsert}
			</div>
		);
		
	}
}

export default RegisterPage;
