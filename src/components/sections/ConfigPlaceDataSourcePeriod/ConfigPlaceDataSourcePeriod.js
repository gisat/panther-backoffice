import React, { PropTypes, Component } from 'react';
import styles from './ConfigPlaceDataSourcePeriod.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';
import classNames from 'classnames';
import utils from '../../../utils/utils';

import UISVG from '../../atoms/UISVG';
import UIScreenButton from '../../atoms/UIScreenButton';
import SaveButton from '../../atoms/SaveButton';

import { Icon, IconButton } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import { Table } from '../../SEUI/collections';
import Select from 'react-select';

const COLUMNS = [
			{ key: "ID_0"	},
			{ key: "uf_00" },
			{ key: "uf_10" },
			{ key: "diff_uf" },
			{ key: "fo_00" }
		];
const DATALAYERS = require('../../../stores/tempDataLayers');

import PlaceStore from '../../../stores/PlaceStore';
import PeriodStore from '../../../stores/PeriodStore';
import AttributeSetStore from '../../../stores/AttributeSetStore';
import AULevelStore from '../../../stores/AULevelStore';
import VectorLayerStore from '../../../stores/VectorLayerStore';
import RasterLayerStore from '../../../stores/RasterLayerStore';
import ObjectRelationStore from '../../../stores/ObjectRelationStore';
import AnalysisStore from '../../../stores/AnalysisStore';
import DataLayerStore from '../../../stores/DataLayerStore';
import DataLayerColumnsStore from '../../../stores/DataLayerColumnsStore';


var initialState = {
	place: null,
	attributeSet: null,
	auLevel: null,
	vectorLayer: null,
	rasterLayer: null,
	relations: [],
	relationsState: {},
	expandConfig: {},
	selected: null
};


@withStyles(styles)
class ConfigPlaceDataSourcePeriod extends Component {


	static propTypes = {
		disabled: PropTypes.bool,
		screenKey: PropTypes.string,
		parentUrl: PropTypes.string,
		relationsContext: PropTypes.string.isRequired,
		place: PropTypes.number,
		period: PropTypes.number,
		attributeSet: PropTypes.number,
		auLevel: PropTypes.number,
		vectorLayer: PropTypes.number,
		rasterLayer: PropTypes.number
	};

	static defaultProps = {
		disabled: false,
		place: null,
		period: null,
		attributeSet: null,
		auLevel: null,
		vectorLayer: null,
		rasterLayer: null
	};

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired,
		onInteraction: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}

	store2state(props) {
		switch (props.relationsContext) {
			case "AttSet":
				return {
					place: PlaceStore.getById(props.place),
					period: PeriodStore.getById(props.period),
					attributeSet: AttributeSetStore.getById(props.attributeSet),
					auLevel: AULevelStore.getById(props.auLevel),
					dataLayers: DataLayerStore.getAll()
				};
				break;
			case "Vector":
				return {
					place: PlaceStore.getById(props.place),
					period: PeriodStore.getById(props.period),
					vectorLayer: VectorLayerStore.getById(props.vectorLayer),
					dataLayers: DataLayerStore.getAll()
				};
				break;
			case "VectorAttSet":
				return {
					place: PlaceStore.getById(props.place),
					period: PeriodStore.getById(props.period),
					attributeSet: AttributeSetStore.getById(props.attributeSet),
					vectorLayer: VectorLayerStore.getById(props.vectorLayer),
					dataLayers: DataLayerStore.getAll()
				};
				break;
			case "Raster":
				return {
					place: PlaceStore.getById(props.place),
					period: PeriodStore.getById(props.period),
					rasterLayer: RasterLayerStore.getById(props.rasterLayer),
					dataLayers: DataLayerStore.getAll()
				};
				break;
		}

	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		let condition = false;
		switch(props.relationsContext) {
			case "AttSet":
				condition = (
					props.place &&
					props.period &&
					props.attributeSet &&
					props.auLevel
				);
				break;
			case "Vector":
				condition = (
					props.place &&
					props.period &&
					props.vectorLayer
				);
				break;
			case "VectorAttSet":
				condition = (
					props.place &&
					props.period &&
					props.attributeSet &&
					props.vectorLayer
				);
				break;
			case "Raster":
				condition = (
					props.place &&
					props.period &&
					props.rasterLayer
				);
				break;
		}
		if(condition) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			let setStatePromise = this.context.setStateFromStores.call(this, store2state, keys);

			setStatePromise.then(function () {
				let relations2state = {};
				switch(props.relationsContext) {
					case "AttSet":
						relations2state = {
							relations: ObjectRelationStore.getFiltered({
								place: thisComponent.state.place,
								period: thisComponent.state.period,
								isOfAttributeSet: true,
								attributeSet: thisComponent.state.attributeSet,
								layerObject: thisComponent.state.auLevel
							})
						};
						break;
					case "Vector":
						relations2state = {
							relations: ObjectRelationStore.getFiltered({
								place: thisComponent.state.place,
								period: thisComponent.state.period,
								isOfAttributeSet: false,
								layerObject: thisComponent.state.vectorLayer
							})
						};
						break;
					case "VectorAttSet":
						relations2state = {
							relations: ObjectRelationStore.getFiltered({
								place: thisComponent.state.place,
								period: thisComponent.state.period,
								isOfAttributeSet: true,
								attributeSet: thisComponent.state.attributeSet,
								layerObject: thisComponent.state.vectorLayer
							})
						};
						break;
					case "Raster":
						relations2state = {
							relations: ObjectRelationStore.getFiltered({
								place: thisComponent.state.place,
								period: thisComponent.state.period,
								isOfAttributeSet: false,
								layerObject: thisComponent.state.rasterLayer
							})
						};
						break;
				}
				let relations2statePromise = thisComponent.context.setStateFromStores.call(thisComponent, relations2state);
				relations2statePromise.then(function () {
					let selected = thisComponent.state.selected;
					for (let relation of thisComponent.state.relations) {
						if(relation.active) {
							selected = relation.key.toString();
						}
						if (relation.dataSourceOrigin=="geonode") {
							(function (relation) { // todo is this needed with let instead of var?

								let dataLayerColumnsPromise = DataLayerColumnsStore.getByDataSource(relation.dataSourceString);
								let relationsState = {};
								dataLayerColumnsPromise.then(function (dataLayerColumns) {
									let columns = [];
									_.each(dataLayerColumns, function(column){
										if (column.hasOwnProperty("name")) {
											columns.push({
												key: column.name,
												name: column.name
											});
										}
									});
									relationsState[relation.key] = {
										columns: columns,
										valuesColumnMap: relation.columnMap,
										valueDataLayer: relation.dataSource.key,
										valueFidColumn: relation.fidColumn
									};
									thisComponent.context.setStateDeep.call(thisComponent, {relationsState: {$merge: relationsState}});
								});

							})(relation);
						}
					}
					let state = {
						selected: selected
					};
					state.savedState = utils.deepClone(state);
					thisComponent.setState(state);
				});
			});
		}
	}

	_onStoreChange(keys) {
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		PlaceStore.addChangeListener(this._onStoreChange.bind(this,["place"]));
		PeriodStore.addChangeListener(this._onStoreChange.bind(this,["period"]));
		AttributeSetStore.addChangeListener(this._onStoreChange.bind(this,["attSet"]));
		AULevelStore.addChangeListener(this._onStoreChange.bind(this,["auLevel"]));
		VectorLayerStore.addChangeListener(this._onStoreChange.bind(this,["vectorLayer"]));
		RasterLayerStore.addChangeListener(this._onStoreChange.bind(this,["rasterLayer"]));
		ObjectRelationStore.addChangeListener(this._onStoreChange.bind(this,["relations"]));
		this.setStateFromStores();
	}

	componentWillUnmount() {
		PlaceStore.removeChangeListener(this._onStoreChange.bind(this,["place"]));
		PeriodStore.removeChangeListener(this._onStoreChange.bind(this,["period"]));
		AttributeSetStore.removeChangeListener(this._onStoreChange.bind(this,["attSet"]));
		AULevelStore.removeChangeListener(this._onStoreChange.bind(this,["auLevel"]));
		VectorLayerStore.removeChangeListener(this._onStoreChange.bind(this,["vectorLayer"]));
		RasterLayerStore.removeChangeListener(this._onStoreChange.bind(this,["rasterLayer"]));
		ObjectRelationStore.removeChangeListener(this._onStoreChange.bind(this,["relations"]));
	}

	componentWillReceiveProps(newProps) {
		let condition = false;
		switch(newProps.relationsContext) {
			case "AttSet":
				condition = (
					(newProps.place!=this.props.place) ||
					(newProps.period!=this.props.period) ||
					(newProps.attributeSet!=this.props.attributeSet) ||
					(newProps.auLevel!=this.props.auLevel)
				);
				break;
			case "Vector":
				condition = (
					(newProps.place!=this.props.place) ||
					(newProps.period!=this.props.period) ||
					(newProps.vectorLayer!=this.props.vectorLayer)
				);
				break;
			case "VectorAttSet":
				condition = (
					(newProps.place!=this.props.place) ||
					(newProps.period!=this.props.period) ||
					(newProps.attributeSet!=this.props.attributeSet) ||
					(newProps.vectorLayer!=this.props.vectorLayer)
				);
				break;
			case "Raster":
				condition = (
					(newProps.place!=this.props.place) ||
					(newProps.period!=this.props.period) ||
					(newProps.rasterLayer!=this.props.rasterLayer)
				);
				break;
		}
		if(condition) {
			this.setStateFromStores(newProps);
		}
	}

	/**
	 * Check if state is the same as it was when loaded from stores
	 * @returns {boolean}
	 */
	isStateUnchanged() {
		let isSelectionUnchanged = true, areConfigsUnchanged = true;
		let condition = false;
		switch(this.props.relationsContext) {
			case "AttSet":
				condition = (
					this.state.place &&
					this.state.period &&
					this.state.attributeSet &&
					this.state.auLevel
				);
				break;
			case "Vector":
				condition = (
					this.state.place &&
					this.state.period &&
					this.state.vectorLayer
				);
				break;
			case "VectorAttSet":
				condition = (
					this.state.place &&
					this.state.period &&
					this.state.attributeSet &&
					this.state.vectorLayer
				);
				break;
			case "Raster":
				condition = (
					this.state.place &&
					this.state.period &&
					this.state.rasterLayer
				);
				break;
		}
		if(condition && this.state.savedState) {
			isSelectionUnchanged = (
				this.state.selected == this.state.savedState.selected
			);
		}
		return (isSelectionUnchanged && areConfigsUnchanged);
	}



	onToggleConfig(config) {
		let expand = true;
		if(this.state.expandConfig[config]) {
			expand = false;
		}
		let newExpandConfig = {};
		newExpandConfig[config] = expand;
		this.context.setStateDeep.call(this, {expandConfig: {$merge: newExpandConfig}});
	}

	onChange(selected) {
		this.setState({
			selected: selected
		});
	}

	onChangeAttSet(relationKey,attributeKey, value, values) {
		//let record = _.find(this.state.relationsState[relation.key].valuesColumnMap, function (item) {
		//	return item.attribute.key == att.key;
		//});
	}

	onChangeDataLayer(relationKey, value, values) {
		//this.state.relationsState[relation.key].valueDataLayer
		//let relationsState = {
		//	[relationKey]: {
		//		valueDataLayer: value
		//	}
		//};
		//this.context.setStateDeep.call(this, {relationsState: {$merge: relationsState}});
		// todo fix - like this, merge is shallow
	}

	onChangeFidColumn(relationKey, value, values) {
		//this.state.relationsState[relation.key].valueFidColumn
	}



	render() {

		var ret = null;
		let condition = false;
		switch(this.props.relationsContext) {
			case "AttSet":
				condition = (
					this.state.place &&
					this.state.period &&
					this.state.attributeSet &&
					this.state.auLevel
				);
				break;
			case "Vector":
				condition = (
					this.state.place &&
					this.state.period &&
					this.state.vectorLayer
				);
				break;
			case "VectorAttSet":
				condition = (
					this.state.place &&
					this.state.period &&
					this.state.attributeSet &&
					this.state.vectorLayer
				);
				break;
			case "Raster":
				condition = (
					this.state.place &&
					this.state.period &&
					this.state.rasterLayer
				);
				break;
		}
		if(condition) {

			let relationsInsert = null;

			if(this.state.relations && this.state.relations.length) {
				let relationListInsert = [];
				let selected = this.state.selected == null ? [null] : [this.state.selected.toString()];
				for (let relation of this.state.relations) {
					switch (relation.dataSourceOrigin) {

						case "analyses":
							let analysisRowClasses = classNames({
								'rsc-row': true,
								'active': relation.active
							});
							let analysisRelationInsert = (
								<Checkbox
									key={relation.key}
									className={analysisRowClasses}
								>
									<UISVG src='icon-analyses.isvg' className="positive" />
									<span className="option-id">237</span>
									(some analysis)
								</Checkbox>
							);
							relationListInsert.push(analysisRelationInsert);
							break;

						case "geonode":
							let geonodeRowClasses = classNames({
								'rsc-row': true,
								'expandable': true,
								'active': relation.active,
								'expanded': this.state.expandConfig[relation.key]
							});
							let geonodeRelationInsert = (
								<Checkbox
									key={relation.key}
									className={geonodeRowClasses}
								>
									<UISVG
										src='icon-datalayers.isvg'
										className="positive"
									/>
									{relation.dataSourceString}
								</Checkbox>
							);
							relationListInsert.push(geonodeRelationInsert);
							if (this.state.relationsState[relation.key] && this.state.dataLayers) {
								let attSetTableRowsInsert = [];
								for (let att of relation.attributeSet.attributes) {
									let record = _.find(this.state.relationsState[relation.key].valuesColumnMap, function (item) {
										return item.attribute.key == att.key;
									});
									let rowInsert = (
										<tr
											key={att.key}
										>
											<td className="header">{att.name}</td>
											<td className="allowOverflow resetui">
												<Select
													onChange={this.onChangeAttSet.bind(this,relation.key,att.key)}
													options={this.state.relationsState[relation.key].columns}
													valueKey="key"
													labelKey="name"
													value={record ? record.column : null}
												/>
											</td>
										</tr>
									);
									attSetTableRowsInsert.push(rowInsert);
								}
								let configInsert = (
									<div
										key={"config-form-" + relation.key}
										className={this.state.expandConfig[relation.key] ? "rsc-expand expanded" : "rsc-expand "}
									>
										<a
											href="#"
											className="rsc-btn-expand"
											onClick={this.onToggleConfig.bind(this,relation.key)}
										>
											configure
											<b/>
										</a>
										<div>
											<div>

												<label className="container">
													Data layer
													<Select
														onChange={this.onChangeDataLayer.bind(this, relation.key)}
														options={this.state.dataLayers}
														valueKey="key"
														labelKey="key"
														value={this.state.relationsState[relation.key].valueDataLayer}
													/>
												</label>

												<label className="container">
													FID column (Feature identifier)
													<Select
														onChange={this.onChangeFidColumn.bind(this, relation.key)}
														options={this.state.relationsState[relation.key].columns}
														valueKey="key"
														labelKey="key"
														value={this.state.relationsState[relation.key].valueFidColumn}
													/>
												</label>

												<Table celled className="fixed">
													<thead>
													<tr>
														<th>Attribute</th>
														<th>Source column</th>
													</tr>
													</thead>
													<tbody>

													{attSetTableRowsInsert}

													</tbody>
												</Table>

											</div>
										</div>
									</div>
								);
								relationListInsert.push(configInsert);
							}
							break;
					}

				}

				if (relationListInsert.length) {
					relationsInsert = (
						<div className="row-select-config">
							<CheckboxFields
								type="grouped"
								radio
								name="rsc-asaul-623-2-1"
								selected={selected}
								onChange={this.onChange.bind(this)}
							>
								{relationListInsert}
								<span
									// checkboxFields has problem with one child being more children :)
								/>
							</CheckboxFields>
						</div>
					);
				}

			} else {

			}


			var saveButton = (
				<SaveButton
					saved={this.isStateUnchanged()}
					className="save-button"
					//onClick={this.saveForm.bind(this)}
				/>
			);


			ret = (
				<div className="data-source-period-box">

					<h3 className="rsc-header">{this.state.period.name}</h3>

					{relationsInsert}

					<div className="rsc-controls">
						<IconButton
							name="plus"
							basic
						>
							Add data layer source
						</IconButton>
						<UIScreenButton
							basic
						>
							<Icon name="plus" />
							New analysis run
						</UIScreenButton>
						{saveButton}
					</div>
				</div>
			);

		} else {

			ret = (
				<div>
					...
				</div>
			);

		}


		return ret

	}
}

export default ConfigPlaceDataSourcePeriod;
