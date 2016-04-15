import React, { PropTypes, Component } from 'react';
import styles from './LinkTableVectorByScopePlace.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';

import utils from '../../../utils/utils';

import UIScreenButton from '../../atoms/UIScreenButton';

import { Segment, Button, Input, Header, IconButton, Icon, PopupButton } from '../../SEUI/elements';
import { Popup, Modal } from '../../SEUI/modules';
import { Form, Fields, Field, Table } from '../../SEUI/collections';

import VectorLayerStore from '../../../stores/VectorLayerStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import PeriodStore from '../../../stores/PeriodStore';
import ThemeStore from '../../../stores/ThemeStore';
import TopicStore from '../../../stores/TopicStore';

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';

var initialState = {
	example: "Nothing is happening.",
	scopeLayerTemplates: {},
	scopeAttributeSets: {},
	scopePeriods: {}
};


@withStyles(styles)
class LinkTableVectorByScopePlace extends Component {

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
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired,
		onSetTitle: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
	}

	//constructor(props) {
	//	super(props);
	//
	//	this.state = {
	//		example: "Nothing is happening.",
	//		vectorLayers: [
	//		{
	//			key: 16,
	//			name: "Land cover",
	//			periods: [
	//				{
	//					key: 1,
	//					name: "2000",
	//					data: "only"
	//				},
	//				{
	//					key: 2,
	//					name: "2010",
	//					data: "only"
	//				}
	//			],
	//			attSets: [
	//				{
	//					key: 152,
	//					name: "Status code",
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "only"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "only"
	//						}
	//					]
	//				}
	//			]
	//		}, // layer
	//		{
	//			key: 25,
	//			name: "Land cover Change",
	//			periods: [
	//				{
	//					key: 1,
	//					name: "2000",
	//					data: "only"
	//				},
	//				{
	//					key: 2,
	//					name: "2010",
	//					data: "only"
	//				}
	//			],
	//			attSets: [
	//				{
	//					key: 182,
	//					name: "Change code",
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "only"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "none"
	//						}
	//					]
	//				}
	//			]
	//		}, // layer
	//		{
	//			key: 88,
	//			name: "Road network",
	//			periods: [
	//				{
	//					key: 1,
	//					name: "2000",
	//					data: "only"
	//				},
	//				{
	//					key: 2,
	//					name: "2010",
	//					data: "only"
	//				}
	//			],
	//			attSets: [
	//				{
	//					key: 120,
	//					name: "Road type",
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "only"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "none"
	//						}
	//					]
	//				}
	//			]
	//		} // layer
	//
	//	]
	//	};
	//}

	store2state(props) {
		if(!props){
			props = this.props;
		}
		return {
			scopeLayerTemplates: utils.getLayerTemplatesForScope(props.place.scope, "vector"),
			scopeAttributeSets: utils.getAttSetsForScope(props.place.scope),
			scopePeriods: utils.getPeriodsForScope(props.place.scope)
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(props.place && props.place.scope) {
			let store2state = this.store2state(props);
			this.context.setStateFromStores.call(this, store2state, keys);
		}
	}

	_onStoreChange(keys) {
		logger.trace("LinkTableVectorByScopePlace# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() { this.mounted = true;

		this.changeListener.add(VectorLayerStore, ["scopeLayerTemplates"]);
		this.changeListener.add(VectorLayerStore, ["scopeAttributeSets"]);
		this.changeListener.add(VectorLayerStore, ["scopePeriods"]);
		this.changeListener.add(VectorLayerStore, ["scopeLayerTemplates","scopeAttributeSets","scopePeriods"]);
		this.changeListener.add(VectorLayerStore, ["scopeLayerTemplates","scopeAttributeSets","scopePeriods"]);

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
			this.setStateFromStores(newProps,["scopeLayerTemplates","scopeAttributeSets","scopePeriods"]);
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
			this.state.scopeAttributeSets.models &&
			this.state.scopePeriods.models
		) {
			var thisComponent = this;

			var layerTemplates = utils.deepClone(this.state.scopeLayerTemplates.models);

			/* how many max attsets under one layer? */
			var maxLayerAttSets = 0;
			for (var layer of layerTemplates) {
				let layerAttSets = _.filter(this.state.scopeAttributeSets.models, function (attSet) {
					return !!_.findWhere(attSet.vectorLayers, {key: layer.key});
				});
				layer.attSets = layerAttSets;
				var currentAttSetsLength = layerAttSets.length;
				maxLayerAttSets = (currentAttSetsLength > maxLayerAttSets ? currentAttSetsLength : maxLayerAttSets);
			}
			var vectorAttSetsColumns = maxLayerAttSets * 2;


			var vectorLayersInsert = this.state.scopeLayerTemplates.models.map(function (scopeLayerTemplate) {
				var vectorLayer = thisComponent.props.relations[scopeLayerTemplate.key];

				var layerRowChildren = [];
				var tdLayerClassName = "selectable";
				var dataNoneCountLayer = 0;
				var layerPeriodsInsert = thisComponent.state.scopePeriods.models.map(function (scopePeriod) {
					var periodData = null;
					if (vectorLayer && vectorLayer.periods[scopePeriod.key]) {
						switch (vectorLayer.periods[scopePeriod.key].relations.length) {
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

				var layerHeaderElement = (
					<td
						className="header"
						key="header"
					>
						{scopeLayerTemplate.name}
					</td>
				);
				var layerPeriodsElement = (
					<td
						className={tdLayerClassName}
						key={"layer-" + scopeLayerTemplate.key + "-periods"}
					>
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
				);

				layerRowChildren.push(layerHeaderElement, layerPeriodsElement);

				var additionalColumns = vectorAttSetsColumns;

				var relationsLayerTemplate = _.findWhere(layerTemplates,{key:scopeLayerTemplate.key});
				if(relationsLayerTemplate) {
					for (var layerAttSet of relationsLayerTemplate.attSets) {

						var attSetHeaderElement = React.createElement('td', {
							className: 'header',
							key: layerAttSet.key
						}, layerAttSet.name);

						var dataNoneCount = 0;
						var tdClassName = "selectable";
						var layerAttSetPeriodsInsert = thisComponent.state.scopePeriods.models.map(function (scopePeriod) {
							var periodData = null;
							if (vectorLayer &&
								vectorLayer.attSets[layerAttSet.key] &&
								vectorLayer.attSets[layerAttSet.key].periods[scopePeriod.key]
							) {
								switch (vectorLayer.attSets[layerAttSet.key].periods[scopePeriod.key].relations.length) {
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
								++dataNoneCount;
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

						if (dataNoneCount == 0) {
							tdClassName += " positive";
						}
						else if (dataNoneCount == thisComponent.state.scopePeriods.models.length) {
							tdClassName += " negative";
						}
						else {
							tdClassName += " warning";
						}

						var attSetPeriodsElement = (
							<td
								className={tdClassName}
								key={"layer-" + scopeLayerTemplate.key + "-attset-" + layerAttSet.key + "-periods"}
							>
								<a
									href="#"
									onClick={thisComponent.onCellClick.bind(
										thisComponent,
										scopeLayerTemplate.key,
										layerAttSet.key
									)}
								>
									{layerAttSetPeriodsInsert}
								</a>
							</td>
						);

						layerRowChildren.push(attSetHeaderElement, attSetPeriodsElement);
					}

					additionalColumns = vectorAttSetsColumns - (relationsLayerTemplate.attSets.length * 2);
				}

				var additionalColumnsInsert;
				if (additionalColumns) {
					additionalColumnsInsert = <td colSpan={additionalColumns} key="additionalcolumns"></td>;
				}

				layerRowChildren.push(additionalColumnsInsert);

				return React.createElement('tr', {key: "vectorlayer-" + scopeLayerTemplate.key}, layerRowChildren);

			});

			ret = (

				<div>

					<Table celled className="LinkTable ByScopePlace fixed separateRows" id="LinkTableVectorByScopePlace">
						<thead>
						<tr>
							<th colSpan="2">Layer</th>
							<th colSpan={vectorAttSetsColumns}>
								Attribute sets
							</th>
						</tr>
						</thead>
						<tbody>
						{vectorLayersInsert}
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

export default LinkTableVectorByScopePlace;
