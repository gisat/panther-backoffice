import React, { PropTypes, Component } from 'react';

import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial07Styles extends PantherComponent {

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

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

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTutorial07Styles;
