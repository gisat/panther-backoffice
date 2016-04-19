import React, { PropTypes, Component } from 'react';

import ActionCreator from '../../../../actions/ActionCreator';

import logger from '../../../../core/Logger';

class ScreenHelpCreatePlace extends Component {

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
						frameborder="0"
						allowfullscreen
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
						frameborder="0"
						allowfullscreen
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
						frameborder="0"
						allowfullscreen
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
						frameborder="0"
						allowfullscreen
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
						frameborder="0"
						allowfullscreen
					></iframe>
				</div></div>
			</div>
		);

	}
}

export default ScreenHelpCreatePlace;
