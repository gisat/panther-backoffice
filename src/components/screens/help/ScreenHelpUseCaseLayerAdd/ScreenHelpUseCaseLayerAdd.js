import React, { PropTypes, Component } from 'react';

import utils from '../../../../utils/utils';
import ObjectTypes, {Model, objectTypesMetadata} from '../../../../constants/ObjectTypes';
import ActionCreator from '../../../../actions/ActionCreator';

import { Icon } from '../../../SEUI/elements';


class ScreenHelpUseCaseLayerAdd extends Component {

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

					<h3>
						<span className="help-step">1</span>
						Upload data layer in GeoNode
					</h3>
					<p>The geographic data layer has to be uploaded to PUMA using the GeoNode interface before it can be edited in Back Office or displayed in Data Exploration.</p>
					<ol className="plain list-steps">
						<li>Login to GeoNode, go to Layers and click <b>Upload Layers</b> button</li>
						<li>On Upload screen, select geodata files using the <b>Choose files</b> button or by dragging & dropping them to the designated area.</li>
						<li>Click the <b>Upload Files</b> button and wait until all the files are loaded.</li>
						<li>The upload is complete. You can click <b>Layer info</b> button to navigate to layers detail page or <b>Edit Metadata</b> to manage layers metadata.</li>
					</ol>

					<h3>
						<span className="help-step">2</span>
						Describe layer contents in Back Office
					</h3>
					<p>Second step is to link data layers to metadata structures. In Data Layer approach, in general, user selects the data layer on the page <b>Data Layers</b> and connects layer or its columns to attributes.</p>

					<h4>Connect analytical units layer</h4>
					<p></p>

					<h4>Connect vector layer</h4>

					<h4>Connect raster layer</h4>

					<h3>
						<span className="help-step">3</span>
						Adjust display in Data Exploration
					</h3>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpUseCaseLayerAdd;
