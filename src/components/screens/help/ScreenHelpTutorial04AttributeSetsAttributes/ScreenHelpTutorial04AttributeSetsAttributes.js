import React, { PropTypes, Component } from 'react';

import ActionCreator from '../../../../actions/ActionCreator';

import logger from '../../../../core/Logger';
import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial04AttributeSetsAttributes extends PantherComponent {

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
			logger.error("ScreenHelpTutorial04AttributeSetsAttributes# onHelpLinkClick(), Unknown help screen.", helpScreenKey);
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-page"><div>
					<h2>Video Tutorial 4: Attribute Sets and Attributes</h2>

					<p>Using Attribute Sets and Attributes to keep statistical informations</p>

					<p>
						Attribute Sets represent combination of Attributes which can be added to the Scope via Topics.
					</p>

					<p>
						Attributes themselves represent the columns in the data, which can be used in analysis, charts, filters and
						thematic maps. Before the attributes will be correctly available in the FrontOffice it is necessary to assign the topic Common (tutorial), which was already created before to the correct
					</p>

					<iframe
						className="help-video"
						width="720"
						height="421"
						src="https://www.youtube.com/embed/qi8GCK91p-8?rel=0&cc_load_policy=1&cc_lang_pref=en"
						frameBorder="0"
						allowFullScreen
					></iframe>

					<h3>Manifestation in FrontOffice</h3>

					<p>
						At this moment, you should be able to go to the Front Office. You get there via the Dashboard and clicking on Data Exploration under the Front Office.
					</p>

					<p>
						Now you should be able to create your first choropleths and charts in the Front Office. To verify that your mapping is correct, it is best to select the combination of Scope, Theme and Place and then add table with the added attribute. In default settings the table will show you the data, which are in the database table.
					</p>

					<iframe
						className="help-video"
						width="720"
						height="421"
						src="https://www.youtube.com/embed/Vqc15Wfbm3I?rel=0&cc_load_policy=1&cc_lang_pref=en"
						frameBorder="0"
						allowFullScreen
					></iframe>


				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTutorial04AttributeSetsAttributes;
