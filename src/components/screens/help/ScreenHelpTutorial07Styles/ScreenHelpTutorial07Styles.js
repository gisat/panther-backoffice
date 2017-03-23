import React, { PropTypes, Component } from 'react';

import logger from '../../../../core/Logger';
import ActionCreator from '../../../../actions/ActionCreator';

import PantherComponent from "../../../common/PantherComponent";
import ScreenHelpTutorial08AddVector from '../ScreenHelpTutorial08AddVector';


class ScreenHelpTutorial07Styles extends PantherComponent {

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	onHelpLinkClick(helpScreenKey) {
		// fix name base, to avoid opening in new screen when one is opened from helpIndex
		var screenName = "ScreenDashboardBase-ScreenHelpIndex-ScreenHelp" + helpScreenKey;
		let component = null;
		let size = 50;
		switch (helpScreenKey) {
			case 'Tutorial08AddVector':
				component = ScreenHelpTutorial08AddVector;
				break;
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
					<h2>Video Tutorial 7: Styles</h2>

					<p>Cartographic styles (symbologies) of Layers can be loaded from GeoServer or defined directly in Back Office.</p>

					<iframe
						className="help-video"
						width="720"
						height="421"
						src="https://www.youtube.com/embed/RKAZ7FlkmVI?rel=0&cc_load_policy=1&cc_lang_pref=en"
						frameBorder="0"
						allowFullScreen
					></iframe>

					<h3>Result in Front Office</h3>

					<p>
						To see the effect of multiple Styles with one Layer, see the result video in the chapter <a
							href="#"
							onClick={this.onHelpLinkClick.bind(this, 'Tutorial08AddVector')}
						>8: Vector Layer</a>.<br/>

					</p>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTutorial07Styles;
