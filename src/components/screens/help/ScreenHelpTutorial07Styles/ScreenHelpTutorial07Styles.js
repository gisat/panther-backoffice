import React, { PropTypes, Component } from 'react';

import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial07Styles extends PantherComponent {

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
						To see the effect of multiple Styles with one Layer, see the video in the chapter
						<a
							className="help-link"
							onClick={this.onHelpLinkClick.bind(this, 'Tutorial08AddVector')}
						>8: Vector Layer</a>.<br/>


					</p>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTutorial07Styles;
