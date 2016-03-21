import React, { PropTypes, Component } from 'react';
import styles from './ScreenDashboardBase.css';
import withStyles from '../../../decorators/withStyles';

import { publicPath } from '../../../config';

import { Icon } from '../../SEUI/elements';

import Dashboard from '../../temp/Dashboard';

@withStyles(styles)
class ScreenDashboardBase extends Component{
	render() {

		// todo config
		var geoNodeAddress = "http://37.205.9.78/";
		var geoServerAddress = "http://37.205.9.78/geoserver/";

		return (
			<div>
				<div className="screen-content"><div>

					<div className="flex-block">

						<div className="pumalogo">

						</div>

						<div className="frame-wrapper flexchild">
							<span className="row">GeoNode</span>
							<a
								className="row right-icon"
								target="_blank"
								href={geoNodeAddress+"layers/upload"}
							>
								<span>Upload data layers</span>
								<Icon name="external" className="right"/>
							</a>
							<a
								className="row right-icon"
								target="_blank"
								href={geoNodeAddress+"people"}
							>
								<span>Users</span>
								<Icon name="external" className="right"/>
							</a>
						</div>

						<div className="frame-wrapper flexchild">
							<span className="row">GeoServer</span>
							<a
								className="row right-icon"
								target="_blank"
								href={geoServerAddress+"web/?wicket:bookmarkablePage=:org.geoserver.wms.web.data.StylePage"}
							>
								<span>Manage styles</span>
								<Icon name="external" className="right"/>
							</a>
						</div>

						<div className="frame-wrapper flexchild">
							<span className="row left-icon">
								<Icon name="user" />
								Franz Maria van de la Smith-Kreuzbergbauer
							</span>
							<a
								className="row left-icon right-icon"
								href={publicPath + "/user/settings"}
							>
								<Icon name="setting"/>
								<span>Settings</span>
								<Icon name="angle double right" className="right"/>
							</a>
							<a
								className="row left-icon"
								href={publicPath + "/logout"}
							>
								<Icon name="sign out"/>
								<span>Log out</span>
							</a>
						</div>

						<div className="frame-wrapper flexchild">
							<a className="row left-icon right-icon">
								<Icon name="help" />
								Help
								<Icon name="angle double right" className="right"/>
							</a>
						</div>

					</div>

				</div></div>
			</div>
		);

	}
}

export default ScreenDashboardBase;
