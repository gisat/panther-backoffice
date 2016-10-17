import React, { PropTypes, Component } from 'react';

import ActionCreator from '../../../../actions/ActionCreator';

import logger from '../../../../core/Logger';
import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial08SpatialAnalysis extends PantherComponent {

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
			logger.error("ScreenHelpTutorial08SpatialAnalysis# onHelpLinkClick(), Unknown help screen.", helpScreenKey);
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-page"><div>
					<h2>Video Tutorial 8: Spatial Analysis</h2>

					<p>Create and run Spatial Analyses</p>
					{/*<ol className="plain list-steps">
						<li>_______</li>
					</ol>*/}

					<iframe
						className="help-video"
						width="720"
						height="421"
						src="https://www.youtube.com/embed/V_-EqlWHlFU?rel=0&cc_load_policy=1"
						frameborder="0"
						allowfullscreen
					></iframe>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTutorial08SpatialAnalysis;
