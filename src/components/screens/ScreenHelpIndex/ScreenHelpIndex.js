import React, { PropTypes, Component } from 'react';

import styles from './ScreenHelpIndex.css';
import withStyles from '../../../decorators/withStyles';

import utils from '../../../utils/utils';
import ObjectTypes, {Model, objectTypesMetadata} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';

import { Icon } from '../../SEUI/elements';

import ScreenHelpTopicArchitecture from '../help/ScreenHelpTopicArchitecture';
import ScreenHelpTopicMetadata from '../help/ScreenHelpTopicMetadata';
import ScreenHelpTopicBackOfficeInterface from '../help/ScreenHelpTopicBackOfficeInterface';
import ScreenHelpUseCaseLayerAdd from '../help/ScreenHelpUseCaseLayerAdd';
import ScreenHelpCreatePlace from '../help/ScreenHelpCreatePlace';

import logger from '../../../core/Logger';
import PantherComponent from "../../common/PantherComponent";

@withStyles(styles)
class ScreenHelpIndex extends PantherComponent {

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	onHelpLinkClick(helpScreenKey) {
		var screenName = this.props.screenKey + "-ScreenHelp" + helpScreenKey;
		let component = null;
		let size = 50;
		switch (helpScreenKey) {
			case 'TopicArchitecture':
				component = ScreenHelpTopicArchitecture;
				break;
			case 'TopicMetadata':
				component = ScreenHelpTopicMetadata;
				break;
			case 'TopicBackOfficeInterface':
				component = ScreenHelpTopicBackOfficeInterface;
				break;
			case 'UseCaseLayerAdd':
				component = ScreenHelpUseCaseLayerAdd;
				break;
			case 'CreatePlace':
				component = ScreenHelpCreatePlace;
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
			logger.error("ScreenHelpIndex# onHelpLinkClick(), Unknown help screen. ", helpScreenKey);
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-index"><div>
					<h2>Help</h2>

					<h3>Topics</h3>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'TopicArchitecture')}
					>
						<span>
							PUMA system architecture
						</span>
					</a>
					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'TopicMetadata')}
					>
						<span>
							Metadata structures
						</span>
						<span className="description">
							Metadata types used in PUMA to describe uploaded data
						</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'TopicBackOfficeInterface')}
					>
						<span>
							Back Office interface
						</span>
						<span className="description">
							Sections and controls in Back Office
						</span>
					</a>
					{/*
					 <a
					 className="help-link"
					 onClick={this.onHelpLinkClick.bind(this, 'TopicKeyboard')}
					 >
						<span>
							Keyboard shorcuts
						</span>
					</a>*/}

					<h3>Use cases</h3>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'UseCaseLayerAdd')}
					>
						<span>
							Adding a new layer
						</span>
						<span className="description">
							Uploading, describing and displaying layers
						</span>
					</a>
					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'CreatePlace')}
					>
						<span>
							Create new place
						</span>
						<span className="description">
							Create new place and associated layers.
						</span>
					</a>
					{/*
					 <a
					 className="help-link"
					 onClick={this.onHelpLinkClick.bind(this, 'UseCaseAnalysisCreate')}
					 >
						<span>
							Creating a new analysis
						</span>
					</a>
					 <a
					 className="help-link"
					 onClick={this.onHelpLinkClick.bind(this, 'UseCasePlaceManage')}
					 >
						<span>
							Managing a place
						</span>
					</a>*/}

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpIndex;
