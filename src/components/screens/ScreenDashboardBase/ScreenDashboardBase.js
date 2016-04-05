import React, { PropTypes, Component } from 'react';

import styles from './ScreenDashboardBase.css';
import withStyles from '../../../decorators/withStyles';

import { geonodeProtocol, geonodeHost, frontOfficeProtocol, frontOfficeHost, frontOfficeExplorationUrl } from '../../../config';

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

		var frontOfficeAddress = frontOfficeProtocol + frontOfficeHost + "/";
		var geoNodeAddress = geonodeProtocol + geonodeHost + "/";
		var geoServerAddress = geoNodeAddress + "geoserver/";

		return (
			<div>
				<div className="screen-content"><div>

					<div className="flex-block">

						<div className="pumalogo">

						</div>

						<div className="frame-wrapper flexchild">
							<span className="row">Front Office</span>
							<a
								className="row right-icon"
								target="_blank"
								href={frontOfficeAddress + frontOfficeExplorationUrl}
							>
								<span>Data Exploration</span>
								<Icon name="external" className="right"/>
							</a>
							<a
								className="row right-icon"
								target="_blank"
								href={frontOfficeAddress}
							>
								<span>Project homepage</span>
								<Icon name="external" className="right"/>
							</a>
							{/*<a
								className="row right-icon"
								target="_blank"
								href={frontOfficeAddress+"downloads"}
							>
								<span>Downloads</span>
								<Icon name="external" className="right"/>
							</a>*/}
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
								href={geoNodeAddress+"layers"}
							>
								<span>Data layers</span>
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
								<Icon name="help" />
								Help
							</span>
							<a
								href="#"
								className="row right-icon"
								onClick={this.onOpenHelp.bind(this)}
							>
								Help index
								<Icon name="angle double right" className="right"/>
							</a>
							<a
								className="row right-icon"
								target="_blank"
								href={frontOfficeAddress+"help"}
							>
								Front office help
								<Icon name="external" className="right"/>
							</a>
							<a
								className="row right-icon"
								target="_blank"
								href={geoNodeAddress+"help-with-geonode/"}
							>
								<span>GeoNode help</span>
								<Icon name="external" className="right"/>
							</a>
						</div>

					</div>

				</div></div>
			</div>
		);

	}
}

export default ScreenDashboardBase;
