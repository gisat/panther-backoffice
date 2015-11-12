import React, { PropTypes, Component } from 'react';
import styles from './LinkTableByScopePlace.css';
import withStyles from '../../decorators/withStyles';

import { Segment, Button, Input, Header, IconButton, Icon, PopupButton } from '../SEUI/elements';
import { Popup, Modal } from '../SEUI/modules';
import { Form, Fields, Field, Table } from '../SEUI/collections';

@withStyles(styles)
class LinkTableByScopePlace extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

	constructor(props) {
		super(props);

		this.state = {
			example: "Nothing is happening.",
 			auLevels: [
				{
					key: 1,
					name: "AOI"
				},
				{
					key: 2,
					name: "Core City x Outer Urban Zone"
				},
				{
					key: 3,
					name: "GADM2"
				},
				{
					key: 4,
					name: "GADM3"
				},
				{
					key: 5,
					name: "GADM4"
				}
			],
			auAttSets: [
			{
				key: 352,
				name: "Land Cover classes L3",
				levels: [
					{
						key: 1,
						periods: [
							{
								key: 1,
								name: "2000",
								data: "none"
							},
							{
								key: 2,
								name: "2010",
								data: "only"
							}
						]
					},
					{
						key: 2,
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
					},
					{
						key: 3,
						periods: [
							{
								key: 1,
								name: "2000",
								data: "none"
							},
							{
								key: 2,
								name: "2010",
								data: "selected"
							}
						]
					},
					{
						key: 4,
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
					},
					{
						key: 5,
						periods: [
							{
								key: 1,
								name: "2000",
								data: "none"
							},
							{
								key: 2,
								name: "2010",
								data: "only"
							}
						]
					}
				]
			}, // Attset
			{
				key: 623,
				name: "Aggregated LC Classes Formation",
				levels: [
					{
						key: 1,
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
					},
					{
						key: 2,
						periods: [
							{
								key: 1,
								name: "2000",
								data: "selected"
							},
							{
								key: 2,
								name: "2010",
								data: "selected"
							}
						]
					},
					{
						key: 3,
						periods: [
							{
								key: 1,
								name: "2000",
								data: "selected"
							},
							{
								key: 2,
								name: "2010",
								data: "selected"
							}
						]
					},
					{
						key: 4,
						periods: [
							{
								key: 1,
								name: "2000",
								data: "only"
							},
							{
								key: 2,
								name: "2010",
								data: "selected"
							}
						]
					},
					{
						key: 5,
						periods: [
							{
								key: 1,
								name: "2000",
								data: "selected"
							},
							{
								key: 2,
								name: "2010",
								data: "only"
							}
						]
					}
				]
			}, // Attset
			{
				key: 18,
				name: "Populations1",
				levels: [
					{
						key: 1,
						periods: [
							{
								key: 1,
								name: "2000",
								data: "only"
							},
							{
								key: 2,
								name: "2010",
								data: "selected"
							}
						]
					},
					{
						key: 2,
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
					},
					{
						key: 3,
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
					},
					{
						key: 4,
						periods: [
							{
								key: 1,
								name: "2000",
								data: "none"
							},
							{
								key: 2,
								name: "2010",
								data: "none"
							}
						]
					},
					{
						key: 5,
						periods: [
							{
								key: 1,
								name: "2000",
								data: "none"
							},
							{
								key: 2,
								name: "2010",
								data: "none"
							}
						]
					}
				]
			} // Attset
		]
		};
	}

  openScreenExample(idAttSet,idAULevel) {
		this.state.example = "Clicked on " + idAttSet + ", " + idAULevel;
		/*this.forceUpdate();*/
		/*alert("hey, " + idAttSet);*/
	}

	componentDidMount() {

    $("#LinkTableByScopePlace td.selectable").each(function() {
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

		var auLevelsInsert = this.state.auLevels.map(function (auLevel) {
      return (
				<td className="selectable heading">
					<a 
						href="#"
						onClick={thisComponent.openScreenExample.bind(
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


		var auAttSetsInsert = this.state.auAttSets.map(function (auAttSet) {

			var auSingleAttSetInsert = auAttSet.levels.map(function (auASLevel) {
				var dataNoneCount = 0;
				var tdClassName = "selectable";
				var auASLPeriodsInsert = auASLevel.periods.map(function (period) {
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
						<span className={periodClassName}>
							<Icon name={iconName}/>
							{period.name}
							<br/>
						</span>
					);
				});

				if(dataNoneCount==0){
					tdClassName += " positive";
				}
				else if(dataNoneCount==auASLevel.periods.length){
					tdClassName += " negative";
				}
				else {
					tdClassName += " warning";
				}

				return (
					<td className={tdClassName}>
						<a
							href="#"
							onClick={thisComponent.openScreenExample.bind(
									thisComponent,
									auAttSet.key,
									auASLevel.key
								)}
						>
							{auASLPeriodsInsert}
						</a>
					</td>
				);
			});

			return (
				<tr>
					<td className="selectable heading">
						<a 
							href="#"
							onClick={thisComponent.openScreenExample.bind(
									thisComponent,
									auAttSet.key,
									null
								)}
						>
							{auAttSet.name}
						</a>
					</td>
					{auSingleAttSetInsert}
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

		<Table celled className="LinkTable ByScopePlace fixed" id="LinkTableByScopePlace">
			<thead>
				<tr>
					<th>Attribute Set</th>
					<th colSpan={this.state.auLevels.length}>
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

		</div>
    );
  }

}

export default LinkTableByScopePlace;
