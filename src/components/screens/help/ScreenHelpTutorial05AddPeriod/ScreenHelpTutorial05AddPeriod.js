import React, { PropTypes, Component } from 'react';

import ActionCreator from '../../../../actions/ActionCreator';

import logger from '../../../../core/Logger';
import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial05AddPeriod extends PantherComponent {

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
			logger.error("ScreenHelpTutorial05AddPeriod# onHelpLinkClick(), Unknown help screen.", helpScreenKey);
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-page"><div>
					<h2>Video Tutorial 5: Add Reference Period</h2>

					<p>Add new Reference Period to existing Scope</p>

					<p>
						Period represents time period with the data. In the FrontOffice it is possible to show the data based on the
						time.
					</p>

					<iframe
						className="help-video"
						width="720"
						height="421"
						src="https://www.youtube.com/embed/_tafQgXbzfs?rel=0&cc_load_policy=1&cc_lang_pref=en"
						frameBorder="0"
						allowFullScreen
					></iframe>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTutorial05AddPeriod;
