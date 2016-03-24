import React, { PropTypes, Component } from 'react';
import styles from './ConfigPlaceDataSourcePeriod.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';
import classNames from 'classnames';
import utils from '../../../utils/utils';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';

import UISVG from '../../atoms/UISVG';
import UIScreenButton from '../../atoms/UIScreenButton';
import SaveButton from '../../atoms/SaveButton';

import { Icon, IconButton } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import { Table } from '../../SEUI/collections';
import Select from 'react-select';

import ListenerHandler from '../../../core/ListenerHandler';

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
	selected: null,
	savedState: {}
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

		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
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

				let relations2statePromise = thisComponent.context.setStateFromStores.call(thisComponent, thisComponent.relations2state(props,thisComponent.state,keys));

				relations2statePromise.then(function(){

					thisComponent.setRelationsState(props,thisComponent.state,keys);

				});
			});
		}
	}

	relations2state(props,state,keys) {
		if (!props) {
			props = this.props;
		}
		if (!state) {
			state = this.state;
		}
		let relations2state = {};
		switch(props.relationsContext) {
			case "AttSet":
				relations2state = {
					relations: ObjectRelationStore.getFiltered({
						place: state.place,
						period: state.period,
						isOfAttributeSet: true,
						attributeSet: state.attributeSet,
						layerObject: state.auLevel
					})
				};
				break;
			case "Vector":
				relations2state = {
					relations: ObjectRelationStore.getFiltered({
						place: state.place,
						period: state.period,
						isOfAttributeSet: false,
						layerObject: state.vectorLayer
					})
				};
				break;
			case "VectorAttSet":
				relations2state = {
					relations: ObjectRelationStore.getFiltered({
						place: state.place,
						period: state.period,
						isOfAttributeSet: true,
						attributeSet: state.attributeSet,
						layerObject: state.vectorLayer
					})
				};
				break;
			case "Raster":
				relations2state = {
					relations: ObjectRelationStore.getFiltered({
						place: state.place,
						period: state.period,
						isOfAttributeSet: false,
						layerObject: state.rasterLayer
					})
				};
				break;
		}
		return relations2state;
	}

	setRelationsState(props,state,keys) {
		var thisComponent = this;
		if (!state) {
			state = this.state;
		}

		let selected = state.selected;
		let relationsState = {};
		let promises = [];
		for (let relation of thisComponent.state.relations) {
			if(relation.active) {
				selected = relation.key.toString();
			}
			if (relation.dataSourceOrigin=="geonode") {
				(function (relation) { // todo is this needed with let instead of var?

					let valueDataLayer = relation.dataSourceString;
					//if (state.relationsState[relation.key]) {
					//	valueDataLayer = state.relationsState[relation.key].valueDataLayer;
					//}
					let dataLayerColumnsPromise = DataLayerColumnsStore.getByDataSource(valueDataLayer);
					promises.push(dataLayerColumnsPromise);
					if(dataLayerColumnsPromise) {
						dataLayerColumnsPromise.then(function (dataLayerColumns) {
							let columns = [];
							_.each(dataLayerColumns, function (column) {
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
								//valueDataLayer: valueDataLayer,
								valueFidColumn: relation.fidColumn
							};
						});
					}

				})(relation);
			}
		}
		Promise.all(promises).then(function(){
			let savedState = {
				selected: selected
			};
			let newState = {
				relationsState: {$merge: relationsState},
				selected: {$set: selected},
				savedState: {$merge: savedState}
			};
			thisComponent.context.setStateDeep.call(thisComponent, newState);

		});

	}

	_onStoreChange(keys) {
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		this.changeListener.add(PlaceStore, ["place"]);
		this.changeListener.add(PeriodStore, ["period"]);
		this.changeListener.add(AttributeSetStore, ["attSet"]);
		this.changeListener.add(AULevelStore, ["auLevel"]);
		this.changeListener.add(VectorLayerStore, ["vectorLayer"]);
		this.changeListener.add(RasterLayerStore, ["rasterLayer"]);
		this.changeListener.add(ObjectRelationStore, ["relations"]);

		this.setStateFromStores();
	}

	componentWillUnmount() {
		this.changeListener.clean();
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

	//componentWillUpdate(newProps, newState) {
	//	var thisComponent = this;
	//	//if(newState.hasOwnProperty("relationsState")) {
	//	//	let changed = false;
	//	//	_.each(newState.relationsState, function (relState, relKey, relationsState) {
	//	//		if (
	//	//			relState.hasOwnProperty("valueDataLayer") &&
	//	//			thisComponent.state.relationsState.hasOwnProperty(relKey) &&
	//	//			relState.valueDataLayer != thisComponent.state.relationsState[relKey].valueDataLayer
	//	//		) {
	//	//			changed = true;
	//	//		}
	//	//	});
	//	//	if (changed) {
	//	//		this.setRelationsState(newProps,newState);
	//	//	}
	//	//}
	//}


	/**
	 * Check if state is the same as it was when loaded from stores
	 * @returns {boolean}
	 */
	isStateUnchanged() {
		let isSelectionUnchanged = true, areConfigsUnchanged = true;
		let condition = this.stateCondition();
		if(condition && this.state.savedState) {
			isSelectionUnchanged = this.isSelectionUnchanged();
			for (let relation of this.state.relations) {
				areConfigsUnchanged = (
					areConfigsUnchanged &&
					this.isConfigUnchanged(relation)
				);
			}
		}
		return (isSelectionUnchanged && areConfigsUnchanged);
	}
	isSelectionUnchanged() {
		return this.state.selected == this.state.savedState.selected
	}
	isConfigUnchanged(relation) {
		if (this.state.relationsState[relation.key]) {
			return _.isEqual(relation.columnMap, this.state.relationsState[relation.key].valuesColumnMap)
		} else {
			return true;
		}
	}


	saveForm() {
		let condition = this.stateCondition();
		if (condition && this.state.relations) {

			var actionData = [];
			var relations = utils.clone(this.state.relations);

			let isSelectionUnchanged = this.isSelectionUnchanged();
			for (let relation of relations) {

				let object = {
					key: relation.key
				};

				let isConfigUnchanged = this.isConfigUnchanged(relation);
				if(!isConfigUnchanged || !isSelectionUnchanged) {

					if (!isConfigUnchanged) {

						object.fidColumn = this.state.relationsState[relation.key].valueFidColumn;
						object.columnMap = this.state.relationsState[relation.key].valuesColumnMap;

					}

					if (!isSelectionUnchanged) {
						object.active = (this.state.selected == relation.key);
					}

					let model = new Model[ObjectTypes.OBJECT_RELATION](object);
					actionData.push({type: "update", model: model});
				}

			}

			console.log("relations to save:", actionData);
			ActionCreator.handleObjects(actionData,ObjectTypes.OBJECT_RELATION);
		}
	}


	stateCondition() {
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
		return condition;
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

	onChange(selected,thing) {
		// todo syntheticEvent gets passed here. WHYYYYY?
		if(thing===748596) { // not a weird call
			this.setState({
				selected: selected
			});
		}
	}

	onChangeAttSet(relationKey,attributeKey, value, values) {
		let columnMap = utils.clone(this.state.relationsState[relationKey].valuesColumnMap);
		let record = _.find(columnMap, function (item) {
			return item.attribute.key == attributeKey;
		});
		record.column = value;
		let state = {
			relationsState: {
				[relationKey]: {
					valuesColumnMap: {$set: columnMap}
				}
			}
		};
		this.context.setStateDeep.call(this, state);
	}

	//onChangeDataLayer(relationKey, value, values) {
	//	let state = {
	//		relationsState: {
	//			[relationKey]: {
	//				valueDataLayer: {$set: value}
	//			}
	//		}
	//	};
	//	this.context.setStateDeep.call(this, state);
	//}

	onChangeFidColumn(relationKey, value, values) {
		let state = {
			relationsState: {
				[relationKey]: {
					valueFidColumn: {$set: value}
				}
			}
		};
		this.context.setStateDeep.call(this, state);
	}



	render() {

		var thisComponent = this;
		var ret = null;
		let condition = this.stateCondition();
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
								if (relation.attributeSet) {
									for (let att of relation.attributeSet.attributes) {
										let record = _.find(this.state.relationsState[relation.key].valuesColumnMap, function (item) {
											return item.attribute.key == att.key;
										});
										let columnInsert = null;
										if (record) {
											let isValueValid = _.find(this.state.relationsState[relation.key].columns, function (stateCol) {
												return stateCol.key == record.column
											});
											if (isValueValid) {
												columnInsert = record.column;
											}
										}
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
														value={columnInsert}
													/>
												</td>
											</tr>
										);
										attSetTableRowsInsert.push(rowInsert);
									}
								}
								let fidValue = null;
								let isFidValueValid = _.find(this.state.relationsState[relation.key].columns, function (stateCol) {
									return stateCol.key == thisComponent.state.relationsState[relation.key].valueFidColumn
								});
								if (isFidValueValid) {
									fidValue = this.state.relationsState[relation.key].valueFidColumn;
								}
								let configTableInsert = null;
								if (attSetTableRowsInsert.length) {
									configTableInsert = (
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
									);
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

												{/*<label className="container">
													Data layer
													<Select
														onChange={this.onChangeDataLayer.bind(this, relation.key)}
														options={this.state.dataLayers}
														valueKey="key"
														labelKey="key"
														value={this.state.relationsState[relation.key].valueDataLayer}
													/>
												</label>*/}

												<label className="container">
													FID column (Feature identifier)
													<Select
														onChange={this.onChangeFidColumn.bind(this, relation.key)}
														options={this.state.relationsState[relation.key].columns}
														valueKey="key"
														labelKey="key"
														value={fidValue}
													/>
												</label>

												{configTableInsert}

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
					onClick={this.saveForm.bind(this)}
				/>
			);


			ret = (
				<div className="data-source-period-box">

					<h3 className="rsc-header">{this.state.period.name}</h3>

					{relationsInsert}

					<div className="rsc-controls">
						{/*<IconButton
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
						</UIScreenButton>*/}
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
