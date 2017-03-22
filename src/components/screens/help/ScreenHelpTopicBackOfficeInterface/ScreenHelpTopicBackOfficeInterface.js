import React, { PropTypes, Component } from 'react';

import styles from './ScreenHelpTopicBackOfficeInterface.css';
import withStyles from '../../../../decorators/withStyles';

import utils from '../../../../utils/utils';
import ObjectTypes, {Model, objectTypesMetadata} from '../../../../constants/ObjectTypes';
import ActionCreator from '../../../../actions/ActionCreator';

import { Icon } from '../../../SEUI/elements';
import { Table } from '../../../SEUI/collections';
import logger from '../../../../core/Logger';

import UISVG from '../../../atoms/UISVG';
import PantherComponent from "../../../common/PantherComponent";


@withStyles(styles)
class ScreenHelpTopicBackOfficeInterface extends PantherComponent {

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
			logger.error("ScreenHelpTopicBackOfficeInterface# onHelpLinkClick(), Unknown help screen.", helpScreenKey);
		}
	}

	render() {

		return (
			<div>
				<div className="screen-content-only help-page"><div>
					<h2>Help: Back Office interface</h2>

					<p>The backoffice interface is divided into sections built around main tasks while allowing for the required subtasks to be completed in context of the main task.</p>

					<img
						className="image-fit"
						src={require('../../../../public/placesdatasource.png')}
					/>
					<div className="image-description">
						Main task: Managing a place (left panel), subtask: setting data source (right panel)
					</div>


					<div className="section-header">
						<h3>Sections</h3>
					</div>

					<div className="help-bo-section">
						<div className="help-bo-section-icon">
							<UISVG
								src='icon-dashboard.isvg'
								className="positive medium"
							/>
						</div>
						<h3>Dashboard</h3>
						<p>Starting point, system-wide statistics and information.</p>
					</div>

					<div className="help-bo-section">
						<div className="help-bo-section-icon">
							<UISVG
								src='icon-places.isvg'
								className="positive medium"
							/>
						</div>
						<h3>Places</h3>
						<p>Manage a place and all data connected to it. Choose data layers and analyses to source data from and metadata structures to describe it.</p>
					</div>

					<div className="help-bo-section">
						<div className="help-bo-section-icon">
							<UISVG
								src='icon-datalayers.isvg'
								className="positive medium"
							/>
						</div>
						<h3>Data layers</h3>
						<p>Manage a data layer. Describe the layer and all information included in it and connect it to a scope, place and topics.</p>
					</div>

					<div className="help-bo-section">
						<p><i>Both Places and Data layers internally serve the same purpose, but approach it from different angles in acord with the administrator’s current task.</i></p>
					</div>

					<div className="help-bo-section">
						<div className="help-bo-section-icon">
							<UISVG
								src='icon-analyses.isvg'
								className="positive medium"
							/>
						</div>
						<h3>Analyses</h3>
						<p>Set analyses to be run on specified raw data and run them on chosen locations and analytical units levels. Get computed totals, averages, intersections of features with analytical units, surface proportions etc. available for use in both Back Office and Front Office in the same ways as raw data.</p>
					</div>

					<div className="help-bo-section">
						<div className="help-bo-section-icon">
							<UISVG
								src='icon-metadata.isvg'
								className="positive medium"
							/>
						</div>
						<h3>Metadata</h3>
						<p>Manage all metadata structures in Back Office.</p>
					</div>

					<div className="help-bo-section">
						<div className="help-bo-section-icon">
							<UISVG
								src='users.isvg'
								className="positive medium"
							/>
						</div>
						<h3>Permissions</h3>
						<p>It manages groups, users and their permissions towards different metadata resources in the platform.</p>
					</div>


					<div className="section-header">
						<h3>Controls</h3>
					</div>

					<h4>Panels</h4>
					<p>To provide flexible use, components of Back Office are placed in panels, which can be opened from various contexts.<br/>
					Every control opening a panel when activated is marked by a &raquo; symbol. An open panel can be closed by its close (&times;) button or retracted (&rsaquo;). You can return to a retracted panel by opening it by clicking anywhere on it or using the open (&lsaquo;) button.</p>

					<h4>Data objects</h4>
					<p>Metadata objects are displayed as below, with their ID and name. Clicking an object opens panel with object settings. Blue background indicates simple object (all its data are visible in the settings), gray background indicates a template (filled from data sources with different data in different contexts - places, periods, etc.).</p>

					<a className="puma-item">
						<span className="item-id">
							1532
						</span>
						<span>
							Local
						</span>
					</a>

					<a className="puma-item template">
						<span className="item-id">
							652
						</span>
						<span>
							Land cover
						</span>
					</a>

				</div></div>
			</div>
		);

	}
}

export default ScreenHelpTopicBackOfficeInterface;
