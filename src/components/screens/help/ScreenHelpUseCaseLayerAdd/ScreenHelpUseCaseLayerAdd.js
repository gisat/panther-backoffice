import React, { PropTypes, Component } from 'react';

import utils from '../../../../utils/utils';
import ObjectTypes, {Model, objectTypesMetadata} from '../../../../constants/ObjectTypes';
import ActionCreator from '../../../../actions/ActionCreator';

import { Icon } from '../../../SEUI/elements';


class ScreenHelpUseCaseLayerAdd extends Component {

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired,
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
			console.error("Unknown help screen.");
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-page"><div>
					<h2>Help: Adding a new layer</h2>

					<h3>
						<span className="help-step">1</span>
						Upload data layer in GeoNode
					</h3>
					<p>The geographic data layer has to be uploaded to PUMA using the GeoNode interface before it can be edited in Back Office or displayed in Data Exploration.</p>
					<ol className="plain list-steps">
						<li>From Back Office dashboard navigate the <b>Upload data layers</b> link. Or in GeoNode go to Layers and click <b>Upload Layers</b> button.</li>
						<li>Select geodata files using the <b>Choose files</b> button or by dragging & dropping them to the designated area.</li>
						<li>Click the <b>Upload Files</b> button and wait until all the files are loaded and the progress bar disappears.</li>
						<li>The upload is complete. You can click <b>Layer info</b> button to navigate to layers detail page or <b>Edit Metadata</b> to manage layers metadata.</li>
					</ol>
					<iframe
						className="help-video"
						width="720"
						height="530"
						src="https://www.youtube.com/embed/TZ9J7PXM3LY?rel=0"
						frameborder="0"
						allowfullscreen
					></iframe>

					<h3>
						<span className="help-step">2</span>
						Describe layer contents in Back Office
					</h3>
					<p>Second step is to link data layers to metadata structures. In general, user selects the data layer on the page <b>Data Layers</b> and connects layer or its columns to attributes.</p>

					<h4>Connect analytical units layer</h4>
					<p></p>
					<ol className="plain list-steps">
						<li>Navigate to <b>Data layers</b> page at Back Office.</li>
						<li>Select the layer with analytical units.</li>
						<li>Set <b>Layer type</b> to Analytical units layer.</li>
						<li>
							Add a <b>Scope</b>.<br/>
							Add existing Scope or create a new one by typing its name and pressing Enter. New empty Scope will be created and its panel appears on the right side.
						</li>
						<li>Add one or more existing or new <b>Places</b>.</li>
						<li>Add an existing or a new one <b>Level</b>.</li>
						<li>In the Tabular data section, set the column containg ids to <b>FID (feature identifier)</b>. For all but the topmost level, choose <b>Parent feature identifier</b> column. Optionally, choose <b>Feature name</b> column.</li>
						<li>
							Other columns can be loaded into <b>Attributes</b> for selected <b>Periods</b>. <br/>
							If new attribute is needed to create, go to <b>Metadata structures</b> page and create needed attributes and attributesets.<br/>
							Periods available to use are only the ones listed both in the Scope and in the Theme.
						</li>
						<li>Save the form with Save button and wait until its label changes to Saved.</li>
					</ol>
					<iframe
						className="help-video"
						width="720"
						height="407"
						src="https://www.youtube.com/embed/0KtCr7PNrAM?rel=0"
						frameborder="0"
						allowfullscreen
					></iframe>

					<h4>Connect vector layer</h4>
					<p>Connecting vector layer is similar to analytical units layer. No Parent feature identifier is set.</p>

					<h4>Connect raster layer</h4>
					<ol className="plain list-steps">
						<li>Open the layer similarly like in case of analytical units and select Raster layer type.</li>
						<li>Select <b>Layer template (name)</b>.</li>
						<li>Add a <b>Scope</b>.</li>
						<li>Add one or more <b>Places</b>.</li>
						<li>Add one or more <b>Imaging/reference periods</b>.</li>
						<li>Save the form with Save button and wait until its label changes to Saved.</li>
					</ol>

					{/*<h3>
						<span className="help-step">3</span>
						Adjust display in Data Exploration
					</h3>
					<p></p>*/}

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpUseCaseLayerAdd;
