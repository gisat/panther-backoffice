import React, { PropTypes, Component } from 'react';
import styles from './LinkTableVectorByScopePlace.css';
import withStyles from '../../decorators/withStyles';

import UIScreenButton from '../UIScreenButton';

import { Segment, Button, Input, Header, IconButton, Icon, PopupButton } from '../SEUI/elements';
import { Popup, Modal } from '../SEUI/modules';
import { Form, Fields, Field, Table } from '../SEUI/collections';

@withStyles(styles)
class LinkTableVectorByScopePlace extends Component {

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			example: "Nothing is happening.",
			vectorLayers: [
			{
				key: 16,
				name: "Land cover",
				periods: [
					{
						key: 1,
						name: "2000",
						data: "only"
					},
					{
						key: 2,
						name: "2010",
						data: "only"
					}
				],
				attSets: [
					{
						key: 152,
						name: "Status code",
						periods: [
							{
								key: 1,
								name: "2000",
								data: "only"
							},
							{
								key: 2,
								name: "2010",
								data: "only"
							}
						]
					}
				]
			}, // layer
			{
				key: 25,
				name: "Land cover Change",
				periods: [
					{
						key: 1,
						name: "2000",
						data: "only"
					},
					{
						key: 2,
						name: "2010",
						data: "only"
					}
				],
				attSets: [
					{
						key: 182,
						name: "Change code",
						periods: [
							{
								key: 1,
								name: "2000",
								data: "only"
							},
							{
								key: 2,
								name: "2010",
								data: "none"
							}
						]
					}
				]
			}, // layer
			{
				key: 88,
				name: "Road network",
				periods: [
					{
						key: 1,
						name: "2000",
						data: "only"
					},
					{
						key: 2,
						name: "2010",
						data: "only"
					}
				],
				attSets: [
					{
						key: 120,
						name: "Road type",
						periods: [
							{
								key: 1,
								name: "2000",
								data: "only"
							},
							{
								key: 2,
								name: "2010",
								data: "none"
							}
						]
					}
				]
			} // layer

		]
		};
	}

	openScreenExample(idLayer,idAttSet) {
		this.state.example = "Clicked on " + idLayer + ", " + idAttSet;
	}

	componentDidMount() {

		$("#LinkTableVectorByScopePlace td.selectable").each(function() {
			$(this).focusin(function() {
				$(this).addClass("focus");
			});
			$(this).focusout(function() {
				$(this).removeClass("focus");
			});
		});
	}

	render() {

		var thisComponent = this;


		/* how many max attsets under one layer? */
		var maxLayerAttSets = 0;
		for (var layer of this.state.vectorLayers) {
			var currentAttSetsLength = layer.attSets.length;
			maxLayerAttSets = (currentAttSetsLength > maxLayerAttSets ? currentAttSetsLength : maxLayerAttSets);
		}
		var vectorAttSetsColumns = maxLayerAttSets * 2;


		var vectorLayersInsert = this.state.vectorLayers.map(function (vectorLayer) {

			var layerRowChildren = [];
			var tdLayerClassName = "selectable";
			var dataNoneCountLayer = 0;
			var layerPeriodsInsert = vectorLayer.periods.map(function (period) {
				var periodClassName = "data-" + period.data;
				var iconName = "check circle";
				if(period.data=="none"){
					iconName="radio";
					++dataNoneCountLayer;
				}
				else if(period.data=="selected"){
					iconName="check circle outline"
				}

				return (
					<span
						className={periodClassName}
						key={"period-" + period.key}
					>
						<Icon name={iconName}/>
						{period.name}
						<br/>
					</span>
				);
			});

			if(dataNoneCountLayer==0){
				tdLayerClassName += " positive";
			}
			else if(dataNoneCountLayer==vectorLayer.periods.length){
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
					{vectorLayer.name}
				</td>
			);
			var layerPeriodsElement = (
				<td
					className={tdLayerClassName}
					key={"layer-" + vectorLayer.key + "-periods"}
				>
					<a
						href="#"
						onClick={thisComponent.openScreenExample.bind(
								thisComponent,
								vectorLayer.key,
								false
							)}
					>
						{layerPeriodsInsert}
					</a>
				</td>
			);

			layerRowChildren.push(layerHeaderElement,layerPeriodsElement);

			for (var layerAttSet of vectorLayer.attSets) {

				var attSetHeaderElement = React.createElement('td', {className: 'header', key: layerAttSet.key}, layerAttSet.name);

					var dataNoneCount = 0;
					var tdClassName = "selectable";
					var layerAttSetPeriodsInsert = layerAttSet.periods.map(function (period) {
						var periodClassName = "data-" + period.data;
						var iconName = "check circle";
						if(period.data=="none"){
							iconName="radio";
							++dataNoneCount;
						}
						else if(period.data=="selected"){
							iconName="check circle outline"
						}

						return (
							<span
								className={periodClassName}
								key={"period-" + period.key}
							>
								<Icon name={iconName}/>
								{period.name}
								<br/>
							</span>
						);
					});

					if(dataNoneCount==0){
						tdClassName += " positive";
					}
					else if(dataNoneCount==layerAttSet.periods.length){
						tdClassName += " negative";
					}
					else {
						tdClassName += " warning";
					}

					var attSetPeriodsElement = (
						<td
							className={tdClassName}
							key={"layer-" + vectorLayer.key + "-attset-" + layerAttSet.key + "-periods"}
						>
							<a
								href="#"
								onClick={thisComponent.openScreenExample.bind(
										thisComponent,
										vectorLayer.key,
										layerAttSet.key
									)}
							>
								{layerAttSetPeriodsInsert}
							</a>
						</td>
					);

					layerRowChildren.push(attSetHeaderElement,attSetPeriodsElement);
			}

			var additionalColumns = vectorAttSetsColumns - (vectorLayer.attSets.length * 2);
			var additionalColumnsInsert;
			if(additionalColumns) {
				additionalColumnsInsert = <td colSpan={additionalColumns} key="additionalcolumns"></td>;
			}

			layerRowChildren.push(additionalColumnsInsert);

			return React.createElement('tr', {key: "vectorlayer-" + vectorLayer.key}, layerRowChildren);

		});

		return (

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

		<div className="note">
			Set available layers in <UIScreenButton>scope settings</UIScreenButton>
		</div>

		</div>
		);
	}

}

export default LinkTableVectorByScopePlace;
