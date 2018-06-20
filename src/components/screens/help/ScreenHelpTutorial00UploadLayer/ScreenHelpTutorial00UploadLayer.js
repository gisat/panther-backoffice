import React, { PropTypes, Component } from 'react';

import ActionCreator from '../../../../actions/ActionCreator';

import logger from '../../../../core/Logger';
import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial00UploadLayer extends PantherComponent {

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
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
			logger.error("ScreenHelpTutorial00UploadLayer# onHelpLinkClick(), Unknown help screen.", helpScreenKey);
		}
	}

	render() {
		return (
			<div>
				<div className="screen-content-only help-page">
					<div>
						<h2>Video Tutorial 0: Upload Data Layer</h2>

						<p>The geographic data layer has to be uploaded using the Data Layers tool before it can be edited in Back Office or displayed in Front Office (Data Exploration).</p>
						<ol className="plain list-steps">
							<li>From Back Office dashboard navigate to the <b>Data layers</b></li>
							<li>Select GeoTIFF or Zipped Shapefile using the <b>Choose files</b> button</li>
							<li>Write down the name for the uploaded layer.</li>
							<li>Click the <b>Upload</b> button and wait until all the files are loaded and the progress bar disappears.</li>
							<li>The upload is complete. You can map the layer using the select under the Data Layer</li>
						</ol>

					</div>
				</div>
			</div>
		);

	}

}

export default ScreenHelpTutorial00UploadLayer;
