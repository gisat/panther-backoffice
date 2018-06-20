import React, { PropTypes, Component } from 'react';

import styles from './ScreenDashboardBase.css';
import withStyles from '../../../decorators/withStyles';

import { geoserverProtocol, geoserverAddress, frontOfficeProtocol, frontOfficeAddress, frontOfficeExplorationPath } from '../../../config';

import utils from '../../../utils/utils';
import ActionCreator from '../../../actions/ActionCreator';

import { Icon, Input } from '../../SEUI/elements';

import ScreenHelpIndex from '../../screens/ScreenHelpIndex';
import PantherComponent from "../../common/PantherComponent";


var initialState = {
	valueName: "Robert",
	valueNickname: "Bob",
	valueActive: true
};


@withStyles(styles)
class ScreenDashboardBase extends PantherComponent {

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}

	onOpenHelp() {
		var screenName = this.props.screenKey + "-ScreenHelpIndex";
		let options = {
			component: ScreenHelpIndex,
			parentUrl: this.props.parentUrl,
			contentSize: 40
		};
		ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
	}

	onChangeName(e) {
		this.setState({
			valueName: e.target.value
		});
	}

	onChangeNickname(e) {
		this.setState({
			valueNickname: e.target.value
		});
	}

	onChangeActive() {
		this.setState({
			valueActive: !this.state.valueActive
		});
	}

	render() {

		const frontOfficeURL = frontOfficeProtocol + frontOfficeAddress + "/";
		const geoServerURL = geoserverProtocol + geoserverAddress + "/";

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
								href={frontOfficeURL + frontOfficeExplorationPath}
							>
								<span>Data Exploration</span>
								<Icon name="external" className="right"/>
							</a>
							<a
								className="row right-icon"
								target="_blank"
								href={frontOfficeURL}
							>
								<span>Project homepage</span>
								<Icon name="external" className="right"/>
							</a>
						</div>

						{<div className="frame-wrapper flexchild">
							<span className="row">GeoServer</span>
							<a
								className="row right-icon"
								target="_blank"
								href={geoServerURL+"web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage"}
							>
								<span>Download Source Layers</span>
								<Icon name="external" className="right"/>
							</a>
						</div>}

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
								href={frontOfficeURL+"help-frontoffice/"}
							>
								Front office help
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
