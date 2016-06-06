import React, { PropTypes, Component } from 'react';
import styles from './LinkTableRasterByScopePlace.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';

import utils from '../../../utils/utils';

import UIScreenButton from '../../atoms/UIScreenButton';

import { Segment, Button, Input, Header, IconButton, Icon, PopupButton } from '../../SEUI/elements';
import { Popup, Modal } from '../../SEUI/modules';
import { Form, Fields, Field, Table } from '../../SEUI/collections';

import RasterLayerStore from '../../../stores/RasterLayerStore';
import PeriodStore from '../../../stores/PeriodStore';

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';
import PantherComponent from "../../common/PantherComponent";

var initialState = {
	example: "Nothing is happening.",
	scopeLayerTemplates: {},
	scopePeriods: {}
};


@withStyles(styles)
class LinkTableRasterByScopePlace extends PantherComponent {

	static propTypes = {
		disabled: React.PropTypes.bool,
		relations: React.PropTypes.object,
		place: React.PropTypes.object,
		onCellClick: React.PropTypes.func
	};

	static defaultProps = {
		disabled: false
	};

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		onSetTitle: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
	}

	store2state(props) {
		if(!props){
			props = this.props;
		}
		return {
			scopeLayerTemplates: utils.getLayerTemplatesForScope(props.place.scope, "raster"),
			scopePeriods: utils.getPeriodsForScope(props.place.scope)
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(props.place && props.place.scope) {
			let store2state = this.store2state(props);
			super.setStateFromStores(store2state, keys);
		}
	}

	_onStoreChange(keys) {
		logger.trace("LinkTableRasterByScopePlace# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() { this.mounted = true;

		this.changeListener.add(RasterLayerStore, ["scopeLayerTemplates"]);
		this.changeListener.add(PeriodStore, ["scopePeriods"]);
		this.setStateFromStores();

		// todo react instead of jquery
		$("#LinkTableVectorByScopePlace td.selectable").each(function() {
			$(this).focusin(function() {
				$(this).addClass("focus");
			});
			$(this).focusout(function() {
				$(this).removeClass("focus");
			});
		});
	}

	componentWillUnmount() { this.mounted = false;
		this.changeListener.clean();
	}

	componentWillReceiveProps(newProps) {
		if(newProps.place!=this.props.place) {
			this.setStateFromStores(newProps,["scopeLayerTemplates","scopePeriods"]);
			//this.updateStateHash(newProps);
		}
	}

	componentDidUpdate() {
		// todo react instead of jquery
		$("#LinkTableByScopePlace td.selectable").each(function() {
			$(this).focusin(function() {
				$(this).addClass("focus");
			});
			$(this).focusout(function() {
				$(this).removeClass("focus");
			});
		});
	}


	onCellClick(idLayer,idAttSet) {
		this.props.onCellClick(idLayer,idAttSet);
	}


	render() {

		var ret = null;

		if (
			this.props.place &&
			this.props.place.scope &&
			this.state.scopeLayerTemplates.models &&
			this.state.scopePeriods.models
		) {
			var thisComponent = this;

			var layerTemplates = utils.deepClone(this.state.scopeLayerTemplates.models);


			var rasterLayersInsert = this.state.scopeLayerTemplates.models.map(function (scopeLayerTemplate) {
				var rasterLayer = thisComponent.props.relations[scopeLayerTemplate.key];

				var tdLayerClassName = "selectable";
				var dataNoneCountLayer = 0;
				var layerPeriodsInsert = thisComponent.state.scopePeriods.models.map(function (scopePeriod) {
					var periodData = null;
					if (rasterLayer && rasterLayer.periods[scopePeriod.key]) {
						switch (rasterLayer.periods[scopePeriod.key].relations.length) {
							case 0:
								periodData = "none";
								break;
							case 1:
								periodData = "only";
								break;
							default:
								periodData = "selected";
						}
					} else {
						periodData = "none";
					}

					var periodClassName = "data-" + periodData;
					var iconName = "check circle";
					if (periodData == "none") {
						iconName = "radio";
						++dataNoneCountLayer;
					}
					else if (periodData == "selected") {
						iconName = "check circle outline"
					}

					return (
						<span
							className={periodClassName}
							key={"period-" + scopePeriod.key}
						>
							<Icon name={iconName}/>
							{scopePeriod.name}
							<br/>
						</span>
					);
				});

				if (dataNoneCountLayer == 0) {
					tdLayerClassName += " positive";
				}
				else if (dataNoneCountLayer == thisComponent.state.scopePeriods.models.length) {
					tdLayerClassName += " negative";
				}
				else {
					tdLayerClassName += " warning";
				}

				return (
					<tr
						key={"rasterlayer-" + scopeLayerTemplate.key}
					>
						<td className="header">
							{scopeLayerTemplate.name}
						</td>
						<td className={tdLayerClassName}>
							<a
								href="#"
								onClick={thisComponent.onCellClick.bind(
										thisComponent,
										scopeLayerTemplate.key,
										null
									)}
							>
								{layerPeriodsInsert}
							</a>
						</td>
					</tr>
				);
			});

			ret = (

				/* -> tabs - reference periods */
				<div>

					<Table celled className="LinkTable ByScopePlace fixed separateRows" id="LinkTableRasterByScopePlace">
						<thead>
						<tr>
							<th colSpan="2">Layer</th>
						</tr>
						</thead>
						<tbody>
						{rasterLayersInsert}
						</tbody>
					</Table>

					{/*<div className="note">
						Set available layers in <UIScreenButton>scope settings</UIScreenButton>
					</div>*/}

				</div>
			);
		}

		return ret;

	}

}

export default LinkTableRasterByScopePlace;
