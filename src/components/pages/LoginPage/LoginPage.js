import React, {PropTypes, Component} from 'react';
import logger from '../../../core/Logger';
import styles from './LoginPage.css';
import withStyles from '../../../decorators/withStyles';
import Location from '../../../core/Location';
import ActionCreator from '../../../actions/ActionCreator';
import utils from '../../../utils/utils';
import {publicPath} from '../../../config';
import UserStore from '../../../stores/UserStore';

import {Input, Button} from '../../SEUI/elements';
import Loader from '../../atoms/Loader';

@withStyles(styles)
class LoginPage extends Component {
	constructor() {
		super();

		this.state = {
			valueName: "",
			valuePassphrase: "",
			errorMessage: "",
			ready: false
		};
	}

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired
	};

	componentDidMount() {
		this.setState({
			ready: true
		});
	}

	onClick() {
		this.setState({
			errorMessage: ''
		});
		let id = utils.guid();
		ActionCreator.addOperation(id, {});
		UserStore
			.login(this.state.valueName, this.state.valuePassphrase)
			.then(() => {
				ActionCreator.removeOperation(id);
				Location.pushState(
					null, window.location.pathname 
				);
			}).catch(error => {
			ActionCreator.removeOperation(id);
			logger.error("LoginPage#onClick Error: ", error)
			this.setState({
				errorMessage: "Invalid credentials"
			});
		});
	}

	onChangeName(event){
		this.setState({
			valueName: event.target.value
		});
	}

	onChangePassphrase(event){
		this.setState({
			valuePassphrase: event.target.value
		});
	}

	render() {
		const title = 'Log In';
		this.context.onSetTitle(title);
		let loginBoxInsert = null, errorInsert = null;

		if (this.state.errorMessage) {
			errorInsert = (
				<div className="login-box-error error">
					<div className="login-box-error-message">
						{this.state.errorMessage}
					</div>
				</div>
			);
		} else {
			errorInsert = (
				<div className="login-box-error">
					<div className="login-box-error-message"></div>
				</div>
			);
		}

		if (this.state.ready) {

			loginBoxInsert = (
				<div className="login-box frame-wrapper filled">
					<div className="login-box-content">
						<label className="container">
							User
							<Input
								type="text"
								name="name"
								placeholder=" "
								value={this.state.valueName}
								onChange={this.onChangeName.bind(this)}
							/>
						</label>
						<label className="container">
							Passphrase
							<Input
								type="password"
								name="name"
								placeholder=" "
								value={this.state.valuePassphrase}
								onChange={this.onChangePassphrase.bind(this)}
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
					{errorInsert}
				</div>
			);

		} else {

			loginBoxInsert = (
				<div className="login-box frame-wrapper filled loading">

				</div>
			);

		}
		return (
			<div className="full-viewport login-page">
				<div className="login-page-loader">
					<Loader />
				</div>
				{loginBoxInsert}
			</div>
		);
	}

}

export default LoginPage;
