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

					<ol className="plain list-steps">
						<li>From BackOffice navigate to the <b>metadata</b> section.</li>
						<li>In the left tab choose <b>Scope</b>. Here you can see already created Scopes and on top you can click on the + row, which will create new Scope.</li>
						<li>Panel on the right side of the application opened. In this panel you need to fil Name of the scope, Levels of analytical units and Reference periods. If the ones you need aren't already prepared in the system, you can also create them here. Just started writing in the prepared field and if there is none such, it will offer you possibility to create new one. By default Scope is inactive and only you have access to it. This means that until you make Scope active and give others access to it, nobody else will see it.</li>
						<li>Once we have created Scope, we need to create Theme associated with the Scope. The Theme is basically a tag for combination of attributes and attribute sets available in such part of te Scope. Usually it is used when for the same area you want to show different information such as Land Cover, Transportation and Population. These all would be good candidates for Theme. The Theme belongs to the Scope, select either existing one or the one we created earlier. It also can contain Topics. Topic itself is a structure groupping together Attribute sets and Attributes. This is useful, when you have for one theme or place multiple types of analytical units. In this case you can keep the structure of attribute sets and attributes. Beware you still need to associate data from relevant data layers to these attribute sets and attributes.</li>
					</ol>

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
