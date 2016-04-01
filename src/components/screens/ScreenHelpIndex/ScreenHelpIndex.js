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

	onClick() {
		console.log("click");
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-index"><div>
					<h2>Help</h2>

					<h3>Topics</h3>

					<a
						className="help-link"
						onClick={this.onClick}
					>
						<span>
							PUMA system architecture
						</span>
					</a>
					<a className="help-link">
						<span>
							Metadata structures
						</span>
						<span className="description">
							Metadata types used in PUMA to describe uploaded data
						</span>
					</a>

					<a className="help-link">
						<span>
							Back Office interface
						</span>
						<span className="description">
							Sections and controls in Back Office
						</span>
					</a>
					<a className="help-link">
						<span>
							Keyboard shorcuts
						</span>
					</a>

					<h3>Use cases</h3>

					<a className="help-link">
						<span>
							Adding a new layer
						</span>
						<span className="description">
							Uploading, describing and displaying layers
						</span>
					</a>
					<a className="help-link">
						<span>
							Creating a new analysis
						</span>
					</a>
					<a className="help-link">
						<span>
							Managing a place
						</span>
					</a>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpIndex;
