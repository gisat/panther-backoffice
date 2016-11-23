import React, { PropTypes, Component } from 'react';

import ActionCreator from '../../../../actions/ActionCreator';

import logger from '../../../../core/Logger';
import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpCreatePlace extends PantherComponent {

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
			logger.error("ScreenHelpCreatePlace# onHelpLinkClick(), Unknown help screen.", helpScreenKey);
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-page"><div>
					<h2>Help: Create new place</h2>

					<h3>
						<span className="help-step">1</span>
						Create place and associated Analytical units.
					</h3>
					<iframe
						className="help-video"
						width="720"
						height="530"
						src="https://www.youtube.com/embed/trK5gptIopg"
						frameBorder="0"
						allowFullScreen
					></iframe>

					<h3>
						<span className="help-step">2</span>
						Create and assign attribute sets
					</h3>
					<iframe
						className="help-video"
						width="720"
						height="407"
						src="https://www.youtube.com/embed/rCb-6M4oU74"
						frameBorder="0"
						allowFullScreen
					></iframe>

					<h3>
						<span className="help-step">3</span>
						Create and assign another year
					</h3>
					<iframe
						className="help-video"
						width="720"
						height="407"
						src="https://www.youtube.com/embed/zaDWExxTuyI"
						frameBorder="0"
						allowFullScreen
					></iframe>

					<h3>
						<span className="help-step">4</span>
						Create and assign new style
					</h3>
					<iframe
						className="help-video"
						width="720"
						height="407"
						src="https://www.youtube.com/embed/rUBo1ETpapA"
						frameBorder="0"
						allowFullScreen
					></iframe>

					<h3>
						<span className="help-step">5</span>
						Map raster layer
					</h3>
					<iframe
						className="help-video"
						width="720"
						height="407"
						src="https://www.youtube.com/embed/OEOHlb-oFAs"
						frameBorder="0"
						allowFullScreen
					></iframe>
				</div></div>
			</div>
		);

	}
}

export default ScreenHelpCreatePlace;
