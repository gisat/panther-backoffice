import React, { PropTypes, Component } from 'react';
import PantherComponent from "../common/PantherComponent";
import { publicPath } from '../../config';

import styles from './Navigation.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import UISVG from '../atoms/UISVG';
import classNames from 'classnames';
import utils from '../../utils/utils';

let initialState = {
	showMenu: false
};


@withStyles(styles)
class Navigation extends PantherComponent {

	static propTypes = {
		activeScreenSet: PropTypes.string,
		className: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}


	onLinkClick(e) {
		Link.handleClick(e);
	}

	toggleMenu() {
		this.setState({
			showMenu: !this.state.showMenu
		});
	}


	render() {

		return (
			<div id="navigation">
				<div id="navigation-menu">

				</div>
				<div id="navigation-menu-opener">
					<a
						onClick={this.toggleMenu.bind(this)}
						tabIndex="-1"
					>
						<UISVG src='menu.isvg' />
					</a>
				</div>
				<div id="navigation-quick-access">
					<ul>
						<li>
							<a
								href={publicPath + "/"}
								onClick={this.onLinkClick.bind(this)}
								tabIndex="-1"
								className={this.props.activeScreenSet == "dashboard" ? "current" : ""}
							>
								<UISVG src='icon-dashboard.isvg' />
							</a>
						</li>
						<li>
							<a
								//href={publicPath + "/scopes"}
								//onClick={this.onLinkClick.bind(this)}
								tabIndex="-1"
								className={this.props.activeScreenSet == "scopes" ? "current" : ""}
							>
								<UISVG src='scopes.isvg' />
							</a>
						</li>
						<li>
							<a
								href={publicPath + "/places"}
								onClick={this.onLinkClick.bind(this)}
								tabIndex="-1"
								className={this.props.activeScreenSet == "places" ? "current" : ""}
							>
								<UISVG src='icon-places.isvg' />
							</a>
						</li>
						<li>
							<a
								href={publicPath + "/datalayers"}
								onClick={this.onLinkClick.bind(this)}
								tabIndex="-1"
								className={this.props.activeScreenSet == "dataLayers" ? "current" : ""}
							>
								<UISVG src='icon-datalayers.isvg' />
							</a>
						</li>
						<li>
							<a
								href={publicPath + "/analyses"}
								onClick={this.onLinkClick.bind(this)}
								tabIndex="-1"
								className={this.props.activeScreenSet == "analyses" ? "current" : ""}
							>
								<UISVG src='icon-analyses.isvg' />
							</a>
						</li>
						<li>
							<a
								href={publicPath + "/metadata"}
								onClick={this.onLinkClick.bind(this)}
								tabIndex="-1"
								className={this.props.activeScreenSet == "metadata" ? "current" : ""}
							>
								<UISVG src='icon-metadata.isvg' />
							</a>
						</li>
						<li>
							<a
								//href={publicPath + "/data"}
								//onClick={this.onLinkClick.bind(this)}
								tabIndex="-1"
								className={this.props.activeScreenSet == "data" ? "current" : ""}
							>
								<UISVG src='objects.isvg' />
							</a>
						</li>
						<li>
							<a
								href={publicPath + "/permissions"}
								onClick={this.onLinkClick.bind(this)}
								tabIndex="-1"
								className={this.props.activeScreenSet == "permissions" ? "current" : ""}
							>
								<UISVG src='users.isvg' />
							</a>
						</li>
						<li>
							<a
								href={publicPath + "/layers"}
								onClick={this.onLinkClick.bind(this)}
								tabIndex="-1"
								className={this.props.activeScreenSet == "layers" ? "current" : ""}
							>
								<UISVG src='icon-datalayers.isvg' />
							</a>
						</li>
					</ul>
				</div>
				<div id="navigation-filter">

				</div>
				<div id="navigation-user">

				</div>
			</div>
		);
	}

}




export default Navigation;
