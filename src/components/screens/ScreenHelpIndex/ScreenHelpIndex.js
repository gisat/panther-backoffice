import React, { PropTypes, Component } from 'react';

import styles from './ScreenHelpIndex.css';
import withStyles from '../../../decorators/withStyles';

import utils from '../../../utils/utils';
import ObjectTypes, {Model, objectTypesMetadata} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';

import { Icon } from '../../SEUI/elements';


@withStyles(styles)
class ScreenHelpIndex extends Component {

	//onOpenHelp() {
	//	var screenName = this.props.screenKey + "-ScreenHelpIndex";
	//	let options = {
	//		component: ScreenHelpIndex,
	//		parentUrl: this.props.parentUrl
	//	};
	//	ActionCreator.createOpenScreen(screenName,this.context.screenSetKey, options);
	//}

	render() {

		return (
			<div>
				<div className="screen-content-only"><div>
					<h2>Help</h2>
				</div></div>
			</div>
		);

	}
}

export default ScreenHelpIndex;
