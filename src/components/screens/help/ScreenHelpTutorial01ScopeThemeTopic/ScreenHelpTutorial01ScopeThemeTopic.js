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
						Scope represents the combination of the Periods and levels of Analytical units. All the Data layers
						associated with given Scope must respect the Period setting and make sense in the amount of Analytical units.
						The analytical units are specific for every Place. Scope only specifies how many of them are there and what
						is their ordering from the least detailed to the most detailed.
					</p>
					<p>
						Theme represents the combination of Topics which will be applied to given selection. In the Front Office, the
						user selects Theme alongside with Scope and Place to see the available layers and visualisations.
					</p>
					<p>
						Topic represents the combination of Atttribute sets associated with given Scope. Attribute sets are further
						used in Analyses and to display charts and thematic maps in the Front Office.
					</p>

					<ol className="plain list-steps">
						<li>From BackOffice, navigate to the <b>Metadata</b> section.</li>
						<li>In the left tab, choose <b>Scope</b>. Here you can see already created Scopes and on top you can click on the <b>+</b> row, which will create a new Scope.</li>
						<li>Panel on the right side of the application has opened. In this panel, you need to fil Name of the scope, Levels of analytical units and Reference periods. If the ones you need aren't already prepared in the system, you can also create them here. Just start writing in the prepared field and if there is none such, it will offer you possibility to create a new one. By default, Scope is inactive and only you have access to it. This means that until you make Scope active and give others access to it, nobody else will see it.</li>
						<li>Once we have created Scope, we need to create Theme associated with the Scope. The Theme is basically a tag for a combination of Attributes and Attribute sets available in such part of the Scope. Usually, it is used when for the same area you want to show different information such as Land Cover, Transportation and Population. These all would be good candidates for Theme. The Theme belongs to the Scope. Select either existing one or the one we've created earlier. It also can contain Topics. Topic itself is a structure grouping together Attribute sets and Attributes. This is useful, when you have for one Theme or Place multiple types of Analytical units. In this case, you can keep the structure of Attribute sets and Attributes. Beware, you still need to associate data from relevant Data layers to these Attribute sets and Attributes.</li>
					</ol>

					<iframe
						className="help-video"
						width="720"
						height="421"
						src="https://www.youtube.com/embed/5sTQlIyZ6wM?rel=0&cc_load_policy=1&cc_lang_pref=en"
						frameBorder="0"
						allowFullScreen
					></iframe>

					<h3>Manifestation in Front Office</h3>

					<p>
						At this moment, you should be able to go to the FrontOffice. You get there via the Dashboard and clicking on Data Exploration under the FrontOffice.
					</p>

					<p>
						If you click on the select next to the Scope, you should be able to see the newly created Scope: Local (Tutorial). Once you selected the scope, you should also be able to pick the theme Population (tutorial). You won't be able to get any further now as you didn't yet create place to show.
					</p>

					<p>
						It is important to mention that at this moment you and the administrators are the only ones who see the created Scope and therefore also the theme. There are two reasons this might happen. First is when you don't set the Scope as active. In this case only you will see it. Second is the permissions. In the part 14 of this tutorial you will see how to decide who else will have access to the Scope.
					</p>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTutorial01ScopeThemeTopic;
