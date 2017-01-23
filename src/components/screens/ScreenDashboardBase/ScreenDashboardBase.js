import React, { PropTypes, Component } from 'react';

import styles from './ScreenDashboardBase.css';
import withStyles from '../../../decorators/withStyles';

import { geonodeProtocol, geonodeAddress, geoserverProtocol, geoserverAddress, frontOfficeProtocol, frontOfficeAddress, frontOfficeExplorationPath } from '../../../config';

import utils from '../../../utils/utils';
import ObjectTypes, {Model, objectTypesMetadata} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';

import { Icon, Input } from '../../SEUI/elements';

import ScreenHelpIndex from '../../screens/ScreenHelpIndex';
import PantherComponent from "../../common/PantherComponent";

import Form from '../../atoms/Form/Form';
import FormField from '../../atoms/FormField/FormField';
import FormFieldActivation from '../../atoms/FormFieldActivation/FormFieldActivation';
import Select from 'react-select';


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

		var frontOfficeURL = frontOfficeProtocol + frontOfficeAddress + "/";
		var geoNodeURL = geonodeProtocol + geonodeAddress + "/";
		var geoServerURL = geoserverProtocol + geoserverAddress + "/";

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
							{/*<a
								className="row right-icon"
								target="_blank"
								href={frontOfficeURL+"downloads"}
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
								href={geoNodeURL+"layers/upload"}
							>
								<span>Upload data layers</span>
								<Icon name="external" className="right"/>
							</a>
							<a
								className="row right-icon"
								target="_blank"
								href={geoNodeURL+"layers"}
							>
								<span>Data layers</span>
								<Icon name="external" className="right"/>
							</a>
							<a
								className="row right-icon"
								target="_blank"
								href={geoNodeURL+"people"}
							>
								<span>Users</span>
								<Icon name="external" className="right"/>
							</a>
							<a
								className="row right-icon"
								target="_blank"
								href={geoNodeURL+"account/invite_user/"}
							>
								<span>User invitation</span>
								<Icon name="external" className="right"/>
							</a>
						</div>

						{/*<div className="frame-wrapper flexchild">
							<span className="row">GeoServer</span>
							<a
								className="row right-icon"
								target="_blank"
								href={geoServerURL+"web/?wicket:bookmarkablePage=:org.geoserver.wms.web.data.StylePage"}
							>
								<span>Manage styles</span>
								<Icon name="external" className="right"/>
							</a>
						</div>*/}

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
								href={frontOfficeURL+"help"}
							>
								Front office help
								<Icon name="external" className="right"/>
							</a>
							<a
								className="row right-icon"
								target="_blank"
								href={geoNodeURL+"help-with-geonode/"}
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
