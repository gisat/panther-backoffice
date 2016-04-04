import React, { PropTypes, Component } from 'react';

import styles from './ScreenDashboardBase.css';
import withStyles from '../../../decorators/withStyles';

import { geonodeProtocol, geonodeHost } from '../../../config';

import utils from '../../../utils/utils';
import ObjectTypes, {Model, objectTypesMetadata} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';

import { Icon } from '../../SEUI/elements';

import ScreenHelpIndex from '../../screens/ScreenHelpIndex';


@withStyles(styles)
class ScreenDashboardBase extends Component {

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	onOpenHelp() {
		var screenName = this.props.screenKey + "-ScreenHelpIndex";
		let options = {
			component: ScreenHelpIndex,
			parentUrl: this.props.parentUrl,
			contentSize: 40
		};
		ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
	}

	render() {

		var geoNodeAddress = geonodeProtocol + geonodeHost + "/";
		var geoServerAddress = geoNodeAddress + "geoserver/";

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
							<a
								href="#"
								className="row left-icon right-icon"
								onClick={this.onOpenHelp.bind(this)}
							>
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
