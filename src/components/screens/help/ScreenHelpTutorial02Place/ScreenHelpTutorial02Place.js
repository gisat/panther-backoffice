import React, { PropTypes, Component } from 'react';

import ActionCreator from '../../../../actions/ActionCreator';

import logger from '../../../../core/Logger';
import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial02Place extends PantherComponent {

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
			logger.error("ScreenHelpTutorial02Place# onHelpLinkClick(), Unknown help screen.", helpScreenKey);
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-page"><div>
					<h2>Video Tutorial 2: Place</h2>

					<p>Create new Place</p>
					<p>
						Place represents new location available in the Scope. It needs to come with new analytical units. In order
						to show the data already available as vector layers in the application, it is necessary to run analyse for
						the new place on them.
					</p>

					<iframe
						className="help-video"
						width="720"
						height="421"
						src="https://www.youtube.com/embed/0T-lZkMxluM?rel=0&cc_load_policy=1&cc_lang_pref=en"
						frameBorder="0"
						allowFullScreen
					></iframe>

					<h3>Result in Front Office</h3>

					<p>
						At this moment, you should be able to go to the Front Office. You get there via the Dashboard and clicking on Data Exploration under the Front Office.
					</p>

					<p>
						Based on the previous tutorial you should be able to choose previously created Scope and Theme. On top of that you should be able to choose the place you created. The Front Office will load, but at the current moment there won't be anything else for you to do in this combination of Scope, Place and Theme. First you will need to map the uploaded layers to the scope.
					</p>

					<p>
						At the current moment only you will see the Place. There are two possible reasons for this. In order for others to see the place and associated layers, you must make the place active and give them permissions towards the place. More on handling permissions is in the chapter 14 of this tutorial.
					</p>

					<iframe
						className="help-video"
						width="720"
						height="421"
						src="https://www.youtube.com/embed/pHS_vtqVzMQ?rel=0&cc_load_policy=1&cc_lang_pref=en"
						frameBorder="0"
						allowFullScreen
					></iframe>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTutorial02Place;
