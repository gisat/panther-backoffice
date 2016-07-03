import React, { PropTypes, Component } from 'react';
import PantherComponent from "../common/PantherComponent";
import { publicPath } from '../../config';

import styles from './Menu.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import UISVG from '../atoms/UISVG';
import classNames from 'classnames';
import utils from '../../utils/utils';

var initialState = {
	isFocused: false,
	isHovered: false,
	forceClose: false
};


@withStyles(styles)
class Menu extends PantherComponent {

	static propTypes = {
		activeScreenSet: PropTypes.string,
		className: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}


	onFocus() {
		this.setState({
			isFocused: true
		});
	}

	onBlur() {
		this.setState({
			isFocused: false
		});
	}

	onMouseEnter() {
		this.setState({
			isHovered: true
		});
	}

	onMouseLeave() {
		this.setState({
			isHovered: false,
			forceClose: false
		});
	}

	onLinkClick(e) {
		this.setState({
			forceClose: true
		});
		Link.handleClick(e);
	}

	//  className="current"
	render() {

		let classes = classNames(
			this.props.className,
		{
			'open': !this.state.forceClose && this.state.isFocused,
			'hover': !this.state.forceClose && this.state.isHovered
		});

		return (
			<nav
				id="menu"
				className={classes}
				onFocus={this.onFocus.bind(this)}
				onBlur={this.onBlur.bind(this)}
				onMouseEnter={this.onMouseEnter.bind(this)}
				onMouseLeave={this.onMouseLeave.bind(this)}
			>
				<ul>
					<li>
						<a
							href={publicPath + "/"}
							onClick={this.onLinkClick.bind(this)}
							tabIndex="-1"
							className={this.props.activeScreenSet == "dashboard" ? "current" : ""}
						>
							<UISVG src='icon-dashboard.isvg' />
							<span>Dashboard</span>
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
							<span>Places</span>
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
							<span>Data layers</span>
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
							<span>Analyses</span>
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
							<span>Metadata structures</span>
						</a>
					</li>
				</ul>
			</nav>
		);
	}

}




export default Menu;
