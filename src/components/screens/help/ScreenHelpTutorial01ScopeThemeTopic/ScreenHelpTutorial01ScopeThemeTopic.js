import React, { PropTypes, Component } from 'react';

import ActionCreator from '../../../../actions/ActionCreator';

import logger from '../../../../core/Logger';
import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial01ScopeThemeTopic extends PantherComponent {

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
			logger.error("ScreenHelpTutorial01ScopeThemeTopic# onHelpLinkClick(), Unknown help screen.", helpScreenKey);
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-page"><div>
					<h2>Video Tutorial 1: Scope, Theme and Topic</h2>

					<p>Create basic metadata structures</p>
					<p>
						Scope represents the combination of the periods and levels of analytical units. All the data layers
						associated with given Scope must respect the period setting and make sense in the amount of analytical units.
						The analytical units are specific for every Place. Scope only specifies how many of them are there and what
						is their ordering from the least detailed to the most detailed.
					</p>
					<p>
						Theme represents the combination of topics which will be applied to given selection. In the FrontOffice the
						user selects theme alongside with Scope and Place to see the available layers and visualisations.
					</p>
					<p>
						Topic represents the combination of Atttribute Sets associated with given Scope. Attribute sets are further
						used in analysis and to display charts and thematic maps in the FrontOffice.
					</p>

					<iframe
						className="help-video"
						width="720"
						height="421"
						src="https://www.youtube.com/embed/5sTQlIyZ6wM?rel=0&cc_load_policy=1&cc_lang_pref=en"
						frameBorder="0"
						allowFullScreen
					></iframe>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTutorial01ScopeThemeTopic;
