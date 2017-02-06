import React, {PropTypes, Component} from 'react';

import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial15CustomWMS extends PantherComponent {

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	render() {

		return (
			<div>
				<div className="screen-content-only help-page">
					<div>
						<h2>Video Tutorial 15: Layer from custom WMS server.</h2>

						<p>In this part of the tutorial you will see how to add layer form custom WMS server. In order to do so you
							need to know the name of the layer on the WMS server and the full URL of the WMS server. </p>

						<h3>Manage WMS layer from custom server</h3>

						<ol className="plain list-steps">
							<li>Go to the <b>layers</b> page in the BackOffice.</li>
							<li>On the left side choose <b>WMS Layer</b></li>
							<li>Click on the box for adding new one or on already existing one for edit</li>
							<li>Fill in all necessary details. Name is shown in the FrontOffice in the area, where layers are
								displayed. Url is full URL to the WMS server on which the layer resides. Layer is the name of the layer
								on the WMS server.
							</li>
						</ol>

						<iframe
							className="help-video"
							width="720"
							height="421"
							src="https://www.youtube.com/embed/9SbYn2fp8Xo"
							frameBorder="0"
							allowFullScreen
						></iframe>

					</div>
				</div>
			</div>
		);

	}
}

export default ScreenHelpTutorial15CustomWMS;
