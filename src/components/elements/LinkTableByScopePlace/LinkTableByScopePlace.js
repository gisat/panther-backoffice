import React, { PropTypes, Component } from 'react';
import styles from './LinkTableByScopePlace.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';

import utils from '../../../utils/utils';

import UIScreenButton from '../../atoms/UIScreenButton';

import { Segment, Button, Input, Header, IconButton, Icon, PopupButton } from '../../SEUI/elements';
import { Popup, Modal } from '../../SEUI/modules';
import { Form, Fields, Field, Table } from '../../SEUI/collections';

import AttributeSetStore from '../../../stores/AttributeSetStore';
import PeriodStore from '../../../stores/PeriodStore';
import ThemeStore from '../../../stores/ThemeStore';
import TopicStore from '../../../stores/TopicStore';

import ListenerHandler from '../../../core/ListenerHandler';
import logger from '../../../core/Logger';
import PantherComponent from "../../common/PantherComponent";

var initialState = {
	example: "Nothing is happening.",
	scopeAttributeSets: {},
	scopePeriods: {}
};


@withStyles(styles)
class LinkTableByScopePlace extends PantherComponent {

	static propTypes = {
		disabled: React.PropTypes.bool,
		relationsAttSet: React.PropTypes.object,
		relationsAULevel: React.PropTypes.object,
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

	//constructor(props) {
	//	super(props);
	//
	//	this.state = {
	//		example: "Nothing is happening.",
	//		auLevels: [
	//			{
	//				key: 1,
	//				name: "AOI"
	//			},
	//			{
	//				key: 2,
	//				name: "Core City x Outer Urban Zone"
	//			},
	//			{
	//				key: 3,
	//				name: "GADM2"
	//			},
	//			{
	//				key: 4,
	//				name: "GADM3"
	//			},
	//			{
	//				key: 5,
	//				name: "GADM4"
	//			}
	//		],
	//		auAttSets: [
	//		{
	//			key: 352,
	//			name: "Land Cover classes L3",
	//			levels: [
	//				{
	//					key: 1,
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "none"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "only"
	//						}
	//					]
	//				},
	//				{
	//					key: 2,
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
	//				},
	//				{
	//					key: 3,
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "none"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "selected"
	//						}
	//					]
	//				},
	//				{
	//					key: 4,
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
	//				},
	//				{
	//					key: 5,
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "none"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "only"
	//						}
	//					]
	//				}
	//			]
	//		}, // Attset
	//		{
	//			key: 623,
	//			name: "Aggregated LC Classes Formation",
	//			levels: [
	//				{
	//					key: 1,
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
	//				},
	//				{
	//					key: 2,
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "selected"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "selected"
	//						}
	//					]
	//				},
	//				{
	//					key: 3,
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "selected"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "selected"
	//						}
	//					]
	//				},
	//				{
	//					key: 4,
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "only"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "selected"
	//						}
	//					]
	//				},
	//				{
	//					key: 5,
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "selected"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "only"
	//						}
	//					]
	//				}
	//			]
	//		}, // Attset
	//		{
	//			key: 18,
	//			name: "Populations1",
	//			levels: [
	//				{
	//					key: 1,
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "only"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "selected"
	//						}
	//					]
	//				},
	//				{
	//					key: 2,
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
	//				},
	//				{
	//					key: 3,
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
	//				},
	//				{
	//					key: 4,
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "none"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "none"
	//						}
	//					]
	//				},
	//				{
	//					key: 5,
	//					periods: [
	//						{
	//							key: 1,
	//							name: "2000",
	//							data: "none"
	//						},
	//						{
	//							key: 2,
	//							name: "2010",
	//							data: "none"
	//						}
	//					]
	//				}
	//			]
	//		} // Attset
	//	]
	//	};
	//}

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}

	store2state(props) {
		if(!props){
			props = this.props;
		}
		return {
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
			super.setStateFromStores(store2state, keys);
		}
	}

	_onStoreChange(keys) {
		logger.trace("LinkTableByScopePlace# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		super.componentDidMount();

		this.changeListener.add(AttributeSetStore, ["scopeAttributeSets"]);
		this.changeListener.add(PeriodStore, ["scopePeriods"]);
		this.changeListener.add(ThemeStore, ["scopeAttributeSets","scopePeriods"]);
		this.changeListener.add(TopicStore, ["scopeAttributeSets","scopePeriods"]);

		this.setStateFromStores();

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

	componentWillReceiveProps(newProps) {
		if(newProps.place!=this.props.place) {
			this.setStateFromStores(newProps,["scopeAttributeSets","scopePeriods"]);
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


	onCellClick(idAttSet,idAULevel) {
		this.props.onCellClick(idAttSet,idAULevel);
	}


	render() {

		var ret = null;

		if(
			this.props.place &&
			this.props.place.scope &&
			this.props.place.scope.levels &&
			this.state.scopeAttributeSets.models &&
			this.state.scopePeriods.models
		) {
			var thisComponent = this;

			// todo visualy differentiate unset levels (w/o data layer)
			var auLevelsInsert = this.props.place.scope.levels.map(function (auLevel) {
				return (
					<td
						className="selectable heading"
						key={"aulevel-" + auLevel.key}
					>
						<a
							href="#"
							onClick={thisComponent.onCellClick.bind(
								thisComponent,
								null,
								auLevel.key
							)}
						>
							{auLevel.name}
						</a>
					</td>
				);
			});

			var auAttSetsInsert = thisComponent.state.scopeAttributeSets.models.map(function (scopeAttSet) {
				if(scopeAttSet.vectorLayers.length==0) {
					var auAttSet = thisComponent.props.relationsAttSet[scopeAttSet.key];

					var auSingleAttSetInsert = thisComponent.props.place.scope.levels.map(function (scopeLevel) {
						var auASLevel;
						if (auAttSet) {
							auASLevel = auAttSet.levels[scopeLevel.key];
						}
						var dataNoneCount = 0;
						var tdClassName = "selectable";
						var auASLPeriodsInsert = thisComponent.state.scopePeriods.models.map(function (scopePeriod) {
							var periodData = null;
							if (auASLevel && auASLevel.periods[scopePeriod.key]) {
								switch (auASLevel.periods[scopePeriod.key].relations.length) {
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

							// none / only / selected
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


						return (
							<td
								className={tdClassName}
								key={"attset-" + scopeAttSet.key + "-aulevel-" + scopeLevel.key + "-periods"}
							>
								<a
									href="#"
									onClick={thisComponent.onCellClick.bind(
										thisComponent,
										scopeAttSet.key,
										scopeLevel.key
									)}
								>
									{auASLPeriodsInsert}
								</a>
							</td>
						);
					});

					return (
						<tr
							key={"auattset-" + scopeAttSet.key}
						>
							<td className="header">
								{scopeAttSet.name}
							</td>
							{auSingleAttSetInsert}
						</tr>
					);
					//return (
					//	<tr
					//		key={"auattset-" + auAttSet.key}
					//	>
					//		<td className="selectable heading">
					//			<a
					//				href="#"
					//				onClick={thisComponent.onCellClick.bind(
					//						thisComponent,
					//						auAttSet.key,
					//						null
					//					)}
					//			>
					//				{auAttSet.name}
					//			</a>
					//		</td>
					//		{auSingleAttSetInsert}
					//	</tr>
					//);
			}
			});

			ret = (

				/* -> tabs - reference periods */
				<div>
					{/*
					 <br/>
					 <p>{this.state.example}</p>
					 */}

					<Table celled className="LinkTable ByScopePlace fixed" id="LinkTableByScopePlace">
						<thead>
						<tr>
							<th>Attribute Set</th>
							<th colSpan={this.props.place.scope.levels.length}>
								Analytical units level
							</th>
						</tr>
						</thead>
						<tbody>
						<tr>
							<td></td>
							{auLevelsInsert}
						</tr>
						{auAttSetsInsert}
						</tbody>
					</Table>

					{/*<div className="note">
						Set available attribute sets & AU levels in <UIScreenButton>scope settings</UIScreenButton>
					</div>*/}

				</div>
			);

		}

		return ret;
	}

}

export default LinkTableByScopePlace;
