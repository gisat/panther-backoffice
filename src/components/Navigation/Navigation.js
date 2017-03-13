import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PantherComponent from "../common/PantherComponent";
import { publicPath } from '../../config';

import styles from './Navigation.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import UISVG from '../atoms/UISVG';
import classNames from 'classnames';
import utils from '../../utils/utils';

import ActionCreator from '../../actions/ActionCreator';

import Menu from './Menu';

import UserModel from '../../models/UserModel';

let initialState = {
	showMenu: false
};


@withStyles(styles)
class Navigation extends PantherComponent {

	static propTypes = {
		activeScreenSet: PropTypes.string,
		currentUser: PropTypes.instanceOf(UserModel),
		className: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		this.onDocumentClick = this.onDocumentClick.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.onDocumentClick);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.onDocumentClick);
	}


	onDocumentClick(e) {
		let menuDOMNode = ReactDOM.findDOMNode(this.menuNode);
		let menuOpenerDOMNode = ReactDOM.findDOMNode(this.menuOpenerNode);
		if (menuDOMNode && !menuDOMNode.contains(e.target) && !menuOpenerDOMNode.contains(e.target)) {
			this.setState({
				showMenu: false
			});
		}
	}

	onLinkClick(e) {
		Link.handleClick(e);
		this.setState({
			showMenu: false
		});
	}

	toggleMenu() {
		this.setState({
			showMenu: !this.state.showMenu
		});
	}

	toggleUserMenu() {
		this.setState({
			showUserMenu: !this.state.showUserMenu
		});
	}

	logOut(e) {
		ActionCreator.logout();
		e.preventDefault();
	}


	render() {

		return (
			<div id="navigation">
				<div id="navigation-menu" className={classNames({'open': this.state.showMenu})}>
					<Menu
						ref={node => {this.menuNode = node}}
						onLinkClick={this.onLinkClick.bind(this)}
						activeScreenSet={this.props.activeScreenSet}
					/>
				</div>
				<div
					id="navigation-menu-opener"
					ref={node => {this.menuOpenerNode = node}}
				>
					<a
						onClick={this.toggleMenu.bind(this)}
						tabIndex="-1"
					>
						<UISVG src='menu.isvg' />
					</a>
				</div>
				<div id="navigation-quick-access">
					<Menu
						quickAccess
						onLinkClick={this.onLinkClick.bind(this)}
						activeScreenSet={this.props.activeScreenSet}
					/>
				</div>
				<div id="navigation-filter">

				</div>
				<div id="navigation-user">
					<div className="ptr-navigation-user-info">
						<span>{this.props.currentUser.name}</span>
					</div>
					<div
						id="navigation-user-menu-opener"
						ref={node => {this.userMenuOpenerNode = node}}
					>
						<a
							onClick={this.toggleUserMenu.bind(this)}
							tabIndex="-1"
						>
							<UISVG src='dots.isvg' />
						</a>
					</div>
				</div>
				<div id="navigation-user-menu" className={classNames({'open': this.state.showUserMenu})}>
					<div>
						<ul>
							<li>
								<a
									href={publicPath + "/"}
									onClick={this.logOut.bind(this)}
									tabIndex="-1"
									title="Log out"
								>
									<span>Log out</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}

}




export default Navigation;
