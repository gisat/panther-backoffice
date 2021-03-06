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
import ScreenHelpTutorial00UploadLayer from '../help/ScreenHelpTutorial00UploadLayer';
import ScreenHelpTutorial01ScopeThemeTopic from '../help/ScreenHelpTutorial01ScopeThemeTopic';
import ScreenHelpTutorial02Place from '../help/ScreenHelpTutorial02Place';
import ScreenHelpTutorial03AnalyticalUnits from '../help/ScreenHelpTutorial03AnalyticalUnits';
import ScreenHelpTutorial04AttributeSetsAttributes from '../help/ScreenHelpTutorial04AttributeSetsAttributes';
import ScreenHelpTutorial05AddPeriod from '../help/ScreenHelpTutorial05AddPeriod';
import ScreenHelpTutorial06AddRaster from '../help/ScreenHelpTutorial06AddRaster';
import ScreenHelpTutorial07Styles from '../help/ScreenHelpTutorial07Styles';
import ScreenHelpTutorial08AddVector from '../help/ScreenHelpTutorial08AddVector';
import ScreenHelpTutorial09SpatialAnalysis from '../help/ScreenHelpTutorial09SpatialAnalysis';
import ScreenHelpTutorial10MathAnalysis from '../help/ScreenHelpTutorial10MathAnalysis';
import ScreenHelpTutorial11AggregationAnalysis from '../help/ScreenHelpTutorial11AggregationAnalysis';
import ScreenHelpTutorial12UserManagement from '../help/ScreenHelpTutorial12UserManagement';
import ScreenHelpTutorial13GroupManagement from '../help/ScreenHelpTutorial13GroupManagement';
import ScreenHelpTutorial14Permissions from '../help/ScreenHelpTutorial14Permissions';
import ScreenHelpTutorial15CustomWMS from '../help/ScreenHelpTutorial15CustomWMS';

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
			case 'Tutorial00UploadLayer':
				component = ScreenHelpTutorial00UploadLayer;
				break;
			case 'Tutorial01ScopeThemeTopic':
				component = ScreenHelpTutorial01ScopeThemeTopic;
				break;
			case 'Tutorial02Place':
				component = ScreenHelpTutorial02Place;
				break;
			case 'Tutorial03AnalyticalUnits':
				component = ScreenHelpTutorial03AnalyticalUnits;
				break;
			case 'Tutorial04AttributeSetsAttributes':
				component = ScreenHelpTutorial04AttributeSetsAttributes;
				break;
			case 'Tutorial05AddPeriod':
				component = ScreenHelpTutorial05AddPeriod;
				break;
			case 'Tutorial06AddRaster':
				component = ScreenHelpTutorial06AddRaster;
				break;
			case 'Tutorial07Styles':
				component = ScreenHelpTutorial07Styles;
				break;
			case 'Tutorial08AddVector':
				component = ScreenHelpTutorial08AddVector;
				break;
			case 'Tutorial09SpatialAnalysis':
				component = ScreenHelpTutorial09SpatialAnalysis;
				break;
			case 'Tutorial10MathAnalysis':
				component = ScreenHelpTutorial10MathAnalysis;
				break;
			case 'Tutorial11AggregationAnalysis':
				component = ScreenHelpTutorial11AggregationAnalysis;
				break;
			case 'Tutorial12UserManagement':
				component = ScreenHelpTutorial12UserManagement;
				break;
			case 'Tutorial13GroupManagement':
				component = ScreenHelpTutorial13GroupManagement;
				break;
			case 'Tutorial14Permissions':
				component = ScreenHelpTutorial14Permissions;
				break;
			case 'Tutorial15CustomWMS':
				component = ScreenHelpTutorial15CustomWMS;
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
							System architecture
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
							Metadata types used in the application to describe uploaded data
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


					<h3>Video tutorials</h3>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial00UploadLayer')}
					>
						<span>0: Upload Layer</span>
						<span className="description">Upload Data Layers</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial01ScopeThemeTopic')}
					>
						<span>1: Scope, Theme and Topic</span>
						<span className="description">Create basic metadata structures</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial02Place')}
					>
						<span>2: Place</span>
						<span className="description">Create new Place</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial03AnalyticalUnits')}
					>
						<span>3: Mapping Analytical Units</span>
						<span className="description">Mapping Analytical Unit Data Layers to Place by level</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial04AttributeSetsAttributes')}
					>
						<span>4: Attribute Sets and Attributes</span>
						<span className="description">Using Attribute Sets and Attributes to keep statistical informations</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial05AddPeriod')}
					>
						<span>5: Add Reference Period</span>
						<span className="description">Add new Reference Period to existing Scope</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial06AddRaster')}
					>
						<span>6: Raster Layer</span>
						<span className="description">Map raster Data Layer to Place</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial07Styles')}
					>
						<span>7: Styles</span>
						<span className="description">Cartographic styles of layers</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial08AddVector')}
					>
						<span>8: Vector Layer</span>
						<span className="description">Map vector Data Layer to Place</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial09SpatialAnalysis')}
					>
						<span>9: Spatial Analysis</span>
						<span className="description">Create and run Spatial Analyses</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial10MathAnalysis')}
					>
						<span>10: Math Analysis</span>
						<span className="description">Create and run Math Analyses</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial11AggregationAnalysis')}
					>
						<span>11: Aggregation Analysis</span>
						<span className="description">Create and run Aggregation Analyses</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial12UserManagement')}
					>
						<span>12: User management</span>
						<span className="description">Create, edit and delete users.</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial13GroupManagement')}
					>
						<span>13: Group management</span>
						<span className="description">Create, edit and delete groups.</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial14Permissions')}
					>
						<span>14: Permissions</span>
						<span className="description">Handling permissions of the metadata</span>
					</a>

					<a
						className="help-link"
						onClick={this.onHelpLinkClick.bind(this, 'Tutorial15CustomWMS')}
					>
						<span>15: Custom WMS Layer</span>
						<span className="description">Managing custom WMS layers in the system.</span>
					</a>
				</div></div>
			</div>
		);

	}
}

export default ScreenHelpIndex;
