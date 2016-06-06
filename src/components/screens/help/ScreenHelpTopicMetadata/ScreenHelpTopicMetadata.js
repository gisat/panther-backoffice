import React, { PropTypes, Component } from 'react';

import utils from '../../../../utils/utils';
import ObjectTypes, {Model, objectTypesMetadata} from '../../../../constants/ObjectTypes';
import ActionCreator from '../../../../actions/ActionCreator';

import { Icon } from '../../../SEUI/elements';
import logger from '../../../../core/Logger';
import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTopicMetadata extends PantherComponent {

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
			logger.error("ScreenHelpTopicMetadata# onHelpLinkClick(), Unknown help screen.", helpScreenKey);
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-page"><div>
					<h2>Help: Metadata structures</h2>

					<p>PUMA connects data layers to metadata structures describing what the data represents, how will it be displayed and how is various data related.</p>
					<p>Geographical features in data layers are connected to <b>places</b> (real world locations - cities, countries, regions) and grouped under <b>topics</b>, which in turn are grouped under <b>themes</b>. <i>(Topics are invisible to the end user and only serve to
					simplify the administrator’s work.)</i></p>
					<p>Information about the features is described by <b>attributes</b> in <b>attribute sets</b>, through which it is available both to computations in the analyses module and to visualizations settings in Front Office.</p>
					<p><b>Styles</b> and <b>layer groups</b> determine how the features will be displayed on the map and where will the corresponding layer be available in Front Office, respectively.</p>
					<p><b>Imaging / refence period</b> specifies the timeframe in which the data was collected (for which the data is valid). A defined period allows for comparison among different places.</p>
					<p>All comparable data is grouped under the same <b>scope</b>. Scopes determine <b>analytical units levels</b> (levels of division of geographical areas to be examined) and data standards and nomenclatures.</p>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTopicMetadata;
