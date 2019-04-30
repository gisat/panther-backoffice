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
			valueEmail: "",
			valuePassphrase: "",
			errorMessage: "",
			ready: false
		};

		UserStore.addErrorListener((error) => {
			logger.error("LoginPage#onClick Error: ", error);
			this.setState({
				errorMessage: "Invalid credentials"
			});
		});
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
			.login(this.state.valueEmail, this.state.valuePassphrase)
			.then(() => {
				ActionCreator.removeOperation(id);
				var path = window.location.pathname;
				if(!path.endsWith('/')){
					path += '/';
				}
				Location.pushState(
					null, path
				);
			}).catch(error => {
			ActionCreator.removeOperation(id);
			logger.error("LoginPage#onClick Error: ", error);
			this.setState({
				errorMessage: "Invalid credentials"
			});
		});
	}

	onChangeEmail(event){
		this.setState({
			valueEmail: event.target.value
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

			let styles = {
				paddingRight: "5px",
				border: "0px"
			};

			loginBoxInsert = (
				<div>
					<div style={{
						position: "absolute",
						top: "10px",
						left: "10px"
					}}>
						<a className="utep-link" href="/geobrowser/?id=portfolio">
							<img src="../images/utep/urban_geobrowser.png" width="30px" height="30px" style={styles}/>
						</a>
						<a className="utep-link" href="/puma/tool">
							<img src="../images/utep/urban_data.png" width="30px" height="30px" style={styles} />
						</a>
						<a className="utep-link" href="/geobrowser/?id=eoservices">
							<img src="../images/utep/urban_eoservices.png" width="30px" height="30px" style={styles} />
						</a>
						<a className="utep-link" href="/#!communities">
							<img src="../images/utep/urban_community_hub.png" width="30px" height="30px" style={styles} />
						</a>
					</div>
					<div className="login-box frame-wrapper filled">
						<div className="login-box-content">
							<div style={{
								width: "20rem",
								height: "2.5rem",
								textAlign: "center"
							}}>
							<a style={{fontSize: "1.125rem",
								textDecoration: "none",
								padding: ".75rem 1.5rem",
								marginTop: "1rem",
								width: "20rem",
								textAlign: "center",
								background: "#99364b",
								color: "#ddd"}} href="https://urban-tep.eu/umsso?r=https%3A%2F%2Furban-tep.eu%2Fpuma%2Ftool%2Fbackoffice%2F" target="_blank">Login via EO-SSO</a>
							</div>
							<div style={{
								width: "20rem",
								height: "2.5rem",
								textAlign: "center",
								marginBottom: "2rem"
							}}>
							<a style={{fontSize: "1.125rem",
								textDecoration: "none",
								padding: ".75rem 1.5rem",
								marginTop: "1rem",
								width: "20rem",
								textAlign: "center",
								color: "#ccc"}} href="https://eo-sso-idp.eo.esa.int/idp/umsso20/registration" target="_blank">Sign Up</a>
							</div>

							<label className="container">
								E-mail
								<Input
									type="text"
									name="email"
									placeholder=" "
									value={this.state.valueEmail}
									onChange={this.onChangeEmail.bind(this)}
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
