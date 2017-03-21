import React, { PropTypes, Component } from 'react';

import ActionCreator from '../../../../actions/ActionCreator';

import logger from '../../../../core/Logger';
import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial03AnalyticalUnits extends PantherComponent {

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
			logger.error("ScreenHelpTutorial03AnalyticalUnits# onHelpLinkClick(), Unknown help screen.", helpScreenKey);
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-page"><div>
					<h2>Video Tutorial 3: Mapping Analytical Units</h2>

					<p>Mapping Analytical Unit Data Layers to Place by level</p>
					<p>
						Analytical units represent the regions which will be shown in the charts or thematic maps and are used for
						filtering. If you use spatial analysis, it also counts the information from vector data layers on the
						analytical units.
					</p>

					<iframe
						className="help-video"
						width="720"
						height="421"
						src="https://www.youtube.com/embed/cCztCxCT77w?rel=0&cc_load_policy=1&cc_lang_pref=en"
						frameBorder="0"
						allowFullScreen
					></iframe>

					<h3>Manifestation in Front Office</h3>

					<p>
						At this moment, you should be able to go to the Front Office. You get there via the Dashboard and clicking on Data Exploration under the Front Office.
					</p>

					<p>
						From the previous tutorial we added the possibility to view Area outlines. In the left part of the Front Office window under the layers, you see area outlines. At this moment, if you select them, you should be able to see them in black outlines.
					</p>

					<iframe
						className="help-video"
						width="720"
						height="421"
						src="https://www.youtube.com/embed/meF31lmTz5g?rel=0&cc_load_policy=1&cc_lang_pref=en"
						frameBorder="0"
						allowFullScreen
					></iframe>


				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTutorial03AnalyticalUnits;
