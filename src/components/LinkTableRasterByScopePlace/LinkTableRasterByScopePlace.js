import React, { PropTypes, Component } from 'react';
import styles from './LinkTableRasterByScopePlace.css';
import withStyles from '../../decorators/withStyles';

import UIScreenButton from '../UIScreenButton';

import { Segment, Button, Input, Header, IconButton, Icon, PopupButton } from '../SEUI/elements';
import { Popup, Modal } from '../SEUI/modules';
import { Form, Fields, Field, Table } from '../SEUI/collections';

@withStyles(styles)
class LinkTableRasterByScopePlace extends Component {
	
	static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

	constructor(props) {
		super(props);

		this.state = {
			example: "Nothing is happening.",
 			rasterLayers: [
			{
				key: 8,
				name: "Population grid",
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
			}, // layer
			{
				key: 13,
				name: "Urban expansion grid",
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
			}, // layer
			{
				key: 20,
				name: "Global urban footprint",
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
			} // layer

		]
		};
	}

  openScreenExample(idLayer) {
		this.state.example = "Clicked on " + idLayer;
	}

	componentDidMount() {

    $("#LinkTableRasterByScopePlace td.selectable").each(function() {
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

		var rasterLayersInsert = this.state.rasterLayers.map(function (rasterLayer) {

			var tdLayerClassName = "selectable";
			var dataNoneCountLayer = 0;
			var layerPeriodsInsert = rasterLayer.periods.map(function (period) {
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
					<span className={periodClassName}>
						<Icon name={iconName}/>
						{period.name}
						<br/>
					</span>
				);
			});

			if(dataNoneCountLayer==0){
				tdLayerClassName += " positive";
			}
			else if(dataNoneCountLayer==rasterLayer.periods.length){
				tdLayerClassName += " negative";
			}
			else {
				tdLayerClassName += " warning";
			}

			return (
				<tr>
					<td className="header">
						{rasterLayer.name}
					</td>
					<td className={tdLayerClassName}>
						<a
							href="#"
							onClick={thisComponent.openScreenExample.bind(
									thisComponent,
									rasterLayer.key,
									false
								)}
						>
							{layerPeriodsInsert}
						</a>
					</td>
				</tr>
      );
    });

		return (

		/* -> tabs - reference periods */
		<div>
			{/*
			<br/>
			<p>{this.state.example}</p>
			*/}

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
		
		<div className="note">
			Set available layers in <UIScreenButton>scope settings</UIScreenButton>
		</div>
		
		</div>
    );

  }
	
}

export default LinkTableRasterByScopePlace;
