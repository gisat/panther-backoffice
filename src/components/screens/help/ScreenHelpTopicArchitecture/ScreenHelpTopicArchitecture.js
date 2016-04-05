import React, { PropTypes, Component } from 'react';

import utils from '../../../../utils/utils';
import ObjectTypes, {Model, objectTypesMetadata} from '../../../../constants/ObjectTypes';
import ActionCreator from '../../../../actions/ActionCreator';

import { Icon } from '../../../SEUI/elements';


class ScreenHelpTopicArchitecture extends Component {

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	onHelpLinkClick(helpScreenKey) {
		var screenName = this.props.screenKey + "-ScreenHelp" + helpScreenKey;
		let component = null;
		let size = 50;
		switch (helpScreenKey) {

		}
		if (component) {
			let options = {
				component: component,
				parentUrl: this.props.parentUrl,
				size: size
			};
			ActionCreator.createOpenScreen(screenName, this.context.screenSetKey, options);
		} else {
			console.error("Unknown help screen.");
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-page"><div>
					<h2>Help: PUMA system architecture</h2>

					<p>PUMA, or Platform for Urban Management and Analysis, is a geospatial tool that allows users with no prior GIS experience to access, analyze and share urban spatial data in an interactive and customizable way.<br/>
					<b>Front Office</b> is the part of PUMA accessible to end users, mainly the <b>“Data Exploration”</b> interface.</p>

					<p>The <b>Back Office</b> interface connects and describes data from integrated data sources (GeoNode, GeoServer), offers in-app computations over data from multiple sources and allows system administrators easy management of the data nad metadata available to end users in the Data Exploration interface.</p>

					<h3>Integrated data sources</h3>

					<p><b>GeoNode</b> is used for source data management, including permission management </p>

					<p><b>GeoServer</b> is used for style management </p>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTopicArchitecture;
