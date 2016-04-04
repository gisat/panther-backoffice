import React, { PropTypes, Component } from 'react';

import utils from '../../../../utils/utils';
import ObjectTypes, {Model, objectTypesMetadata} from '../../../../constants/ObjectTypes';
import ActionCreator from '../../../../actions/ActionCreator';

import { Icon } from '../../../SEUI/elements';


class ScreenHelpTopicAddingLayer extends Component {

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
					<h2>Help: Adding layer</h2>

					<h3>Upload data layer</h3>
					<p>The geographic data layers has to be uploaded to Panther using the GeoNode interface before it can be connected.</p>
					<p>Do it like tjis...</p>

					<h3>Connect data layer to metadata structures</h3>
					<p>Second step is to link data layers to metadata structures. In Data Layer approach, in general, user selects the data layer on the page <b>Data Layrs</b> and connects layer or its columns to attributes.</p>

					<h4>Connect analytical units layer</h4>
					<p></p>

					<h4>Connect vector layer</h4>

					<h4>Connect raster layer</h4>

					<h3>Visualize in Data Exploration Tool</h3>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTopicAddingLayer;
