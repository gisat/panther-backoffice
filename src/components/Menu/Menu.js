import React, { PropTypes, Component } from 'react';
import styles from './Menu.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import UISVG from '../atoms/UISVG';

import { publicPath } from '../../config';


@withStyles(styles)
class Menu extends Component {

	static propTypes = {
		activeScreenSet: PropTypes.string,
		className: PropTypes.string
	};


	//  className="current"
	render() {
		return (
			<nav id="menu" className={this.props.className} >
				<ul>
					<li>
						<a
							href={publicPath + "/"}
							onClick={Link.handleClick}
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
							onClick={Link.handleClick}
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
							onClick={Link.handleClick}
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
							onClick={Link.handleClick}
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
							onClick={Link.handleClick}
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

	componentDidMount() { this.mounted = true;

		$("#menu").focusin(function() {
			$(this).addClass("open");
		});
		$("#menu").focusout(function() {
			$(this).removeClass("open");
		});
	}

}




export default Menu;
