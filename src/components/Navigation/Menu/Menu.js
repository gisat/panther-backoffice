import React, { PropTypes, Component } from 'react';
import PantherComponent from "../../common/PantherComponent";
import { publicPath } from '../../../config';

import styles from './Menu.css';
import withStyles from '../../../decorators/withStyles';
import Link from '../../Link';
import UISVG from '../../atoms/UISVG';
import classNames from 'classnames';
import utils from '../../../utils/utils';
import UserStore from '../../../stores/UserStore';

var initialState = {
	isFocused: false,
	isHovered: false,
	forceClose: false
};


@withStyles(styles)
class Menu extends PantherComponent {

	static propTypes = {
		activeScreenSet: PropTypes.string,
		className: PropTypes.string,
		quickAccess: PropTypes.bool
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


	//  className="current"
	render() {

		let classes = classNames(
			this.props.className,
		{
			'open': !this.state.forceClose && this.state.isFocused,
			'hover': !this.state.forceClose && this.state.isHovered
		});

		let elementType = this.props.quickAccess ? 'div' : 'nav';

		let elementProps = {
			id: this.props.quickAccess ? null : 'menu',
			className: classes,
			onFocus: this.onFocus.bind(this),
			onBlur: this.onBlur.bind(this),
			onMouseEnter: this.onMouseEnter.bind(this),
			onMouseLeave: this.onMouseLeave.bind(this)
		};

		let items = [];
		items.push(this.renderExternalLink('/geobrowser/?id=portfolio', 'images/utep/urban_geobrowser.png', 'Product Portfolio'));
		items.push(this.renderExternalLink('/puma/tool', 'images/utep/urban_data.png', 'Analytics Toolbox'));
		items.push(this.renderExternalLink('/geobrowser/?id=eoservices', 'images/utep/urban_eoservices.png', 'Earth Observation Services'));
		items.push(this.renderExternalLink('/#!communities', 'images/utep/urban_community_hub.png', 'Community Hub'));

		items.push(this.renderItem('', 'dashboard', 'icon-dashboard', 'Dashboard', 'Dashboard'));
		//items.push(this.renderItem('scopes', 'scopes', 'scopes', 'Scopes', 'Scopes'));
		items.push(this.renderItem('places', 'places', 'icon-places', 'Places', 'Places'));
		items.push(this.renderItem('datalayers', 'dataLayers', 'icon-datalayers', 'Data layers', 'Data layers'));
		items.push(this.renderItem('analyses', 'analyses', 'icon-analyses', 'Analyses', 'Analyses'));
		items.push(this.renderItem('metadata', 'metadata', 'icon-metadata', 'Metadata structures', 'Metadata structures'));
		//items.push(this.renderItem('data', 'data', 'objects', 'Data structures', 'All data structures'));
		const user = UserStore.loggedIn();
		const groupIds = user && user.groups && user.groups.map(group => group.key) || [];
		if(groupIds.indexOf(1) !== -1) {
			items.push(this.renderItem('permissions', 'permissions', 'users', 'Permissions', 'Users, groups & permissions'));
		}

		items.push(this.renderItem('layers', 'layers', 'icon-datalayers', 'WMS data layers', 'WMS data layers'));

		return React.createElement(elementType, elementProps, React.createElement('ul', null, items));

	}

	renderExternalLink(url, icon, title) {
		return (
			<li>
				<a
					href={url}
					tabIndex="-1"
					className={""}
					title={title}
				>
					<img src={icon} alt={title} />
					{!this.props.quickAccess ? (
						<span>{title}</span>
					) : null}
				</a>
			</li>
		);
	}

	renderItem(path, screenSet, icon, caption, title) {
		return (
			<li>
				<a
					href={publicPath + "/" + path}
					onClick={this.props.onLinkClick}
					tabIndex="-1"
					className={this.props.activeScreenSet == screenSet ? "current" : ""}
					title={title}
				>
					<UISVG src={icon + '.isvg'} />
					{!this.props.quickAccess ? (
					<span>{caption}</span>
					) : null}
				</a>
			</li>
		);
	}

}




export default Menu;
