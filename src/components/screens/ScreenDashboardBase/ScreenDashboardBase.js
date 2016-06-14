import React, { PropTypes, Component } from 'react';

import styles from './ScreenDashboardBase.css';
import withStyles from '../../../decorators/withStyles';

import { geonodeProtocol, geonodeHost, frontOfficeProtocol, frontOfficeHost, frontOfficeExplorationUrl } from '../../../config';

import utils from '../../../utils/utils';
import ObjectTypes, {Model, objectTypesMetadata} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';

import { Icon, Input } from '../../SEUI/elements';

import ScreenHelpIndex from '../../screens/ScreenHelpIndex';
import PantherComponent from "../../common/PantherComponent";

import Form from '../../atoms/Form/Form';
import FormField from '../../atoms/FormField/FormField';
import Select from 'react-select';


var initialState = {
	valueName: "Robert",
	valueNickname: "Bob"
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

						{/*<div className="frame-wrapper flexchild">
							<span className="row">GeoServer</span>
							<a
								className="row right-icon"
								target="_blank"
								href={geoServerAddress+"web/?wicket:bookmarkablePage=:org.geoserver.wms.web.data.StylePage"}
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

				<Form>

					<FormField
						//disabled={this.props.disabled}
						name="name"
						required={true}
						active={true}
						valid={this.state.valueName.length > 2}
						changed={this.state.valueName != "Robert"}
						contentLabel="Name"
					>
						<Input
							type="text"
							name="name"
							placeholder=" "
							value={this.state.valueName}
							onChange={this.onChangeName.bind(this)}
						/>
					</FormField>

					<FormField
						//disabled={this.props.disabled}
						name="nickname"
						required={true}
						active={true}
						valid={this.state.valueNickname != this.state.valueName}
						changed={this.state.valueNickname != "Bob"}
						contentLabel="Nickname"
						contentInfo="Has to be different than name"
					>
						<Input
							type="text"
							name="nickname"
							placeholder=" "
							value={this.state.valueNickname}
							onChange={this.onChangeNickname.bind(this)}
						/>
					</FormField>

				</Form>

			</div>
		);

	}
}

export default ScreenDashboardBase;
