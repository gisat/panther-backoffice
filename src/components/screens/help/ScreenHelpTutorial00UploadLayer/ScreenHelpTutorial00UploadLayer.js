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
						<h2>Video Tutorial 0: Upload Data Layer in GeoNode</h2>

						<p>The geographic data layer has to be uploaded to PUMA using the GeoNode interface before it can be edited
							in Back Office or displayed in Data Exploration.</p>
						<ol className="plain list-steps">
							<li>From Back Office dashboard navigate the <b>Upload data layers</b> link. Or in GeoNode go to Layers and
								click <b>Upload Layers</b> button.
							</li>
							<li>Select geodata files using the <b>Choose files</b> button or by dragging & dropping them to the
								designated area.
							</li>
							<li>Click the <b>Upload Files</b> button and wait until all the files are loaded and the progress bar
								disappears.
							</li>
							<li>The upload is complete. You can click <b>Layer info</b> button to navigate to layers detail page or
								<b>Edit Metadata</b> to manage layers metadata.
							</li>
						</ol>

						<iframe
							className="help-video"
							width="720"
							height="407"
							src="https://www.youtube.com/embed/TZ9J7PXM3LY?rel=0&cc_load_policy=1&cc_lang_pref=en"
							frameBorder="0"
							allowFullScreen
						></iframe>

					</div>
				</div>
			</div>
		);

	}

}

export default ScreenHelpTutorial00UploadLayer;
