import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

import _ from 'underscore';
import classNames from 'classnames';
import utils from '../../../utils/utils';

import ObjectTypes, {Model} from '../../../constants/ObjectTypes';
import ActionCreator from '../../../actions/ActionCreator';

import UIScreenButton from '../../atoms/UIScreenButton';
import SaveButton from '../../atoms/SaveButton';

import { Icon, IconButton } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import { Table } from '../../SEUI/collections';
import Select from 'react-select';
import OptionDataLayer from '../../atoms/UICustomSelect/OptionDataLayer';
import SingleValueDataLayer from '../../atoms/UICustomSelect/SingleValueDataLayer';

import ListenerHandler from '../../../core/ListenerHandler';

import PlaceStore from '../../../stores/PlaceStore';
import AULevelStore from '../../../stores/AULevelStore';
import ObjectRelationStore from '../../../stores/ObjectRelationStore';
import DataLayerStore from '../../../stores/DataLayerStore';
import DataLayerColumnsStore from '../../../stores/DataLayerColumnsStore';

import logger from '../../../core/Logger';

var initialState = {
	place: null,
	auLevel: null,
	valueDataLayer: null,
	valueFidColumn: null,
	valueNameColumn: null,
	valueParentColumn: null,
	relationsState: {},
	savedState: {}
};


class ConfigPlaceDataSourceAULevel extends PantherComponent {


	static propTypes = {
		disabled: PropTypes.bool,
		screenKey: PropTypes.string,
		parentUrl: PropTypes.string,
		selectorValuePlace: PropTypes.number,
		selectorValueAULevel: PropTypes.number
	};

	static defaultProps = {
		disabled: false,
		selectorValuePlace: null,
		selectorValueAULevel: null
	};

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
	}

	store2state(props) {
		if (!props) {
			props = this.props;
		}
		return {
			place: PlaceStore.getById(props.selectorValuePlace),
			auLevel: AULevelStore.getById(props.selectorValueAULevel),
			dataLayers: DataLayerStore.getAll()
		};
	}

	setStateFromStores(props,keys) {
		if(!props){
			props = this.props;
		}
		if(
			props.selectorValuePlace &&
			props.selectorValueAULevel
		) {
			var thisComponent = this;
			let store2state = this.store2state(props);
			let setStatePromise = super.setStateFromStores(store2state, keys);

			setStatePromise.then(function () {

				let relations2statePromise = super.setStateFromStores(thisComponent.relations2state(props,thisComponent.state,keys));

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
		return {
			relations: ObjectRelationStore.getFiltered({
				place: state.place,
				isOfAttributeSet: false,
				layerObject: state.auLevel
			})
		};
	}

	setRelationsState(props,state,keys) {
		var thisComponent = this;
		if (!state) {
			state = this.state;
		}

		let relationsState = {};
		let promises = [];
		let dataLayers = [];
		let valueDataLayer = null;
		if (this.state.relations.length) {
			for (let relation of thisComponent.state.relations) { // todo clear form if no relations

				if (relation.dataSourceOrigin == "geonode") {
					(function (relation) { // todo is this needed with let instead of var?

						let valueRelationDataLayer = relation.dataSourceString;
						//if (state.relationsState[relation.key]) {
						//	valueDataLayer = state.relationsState[relation.key].valueDataLayer;
						//}
						dataLayers.push(valueRelationDataLayer);
						//let dataLayerColumnsPromise = DataLayerColumnsStore.getByDataSource(valueRelationDataLayer);
						let dataLayerColumnsPromise = thisComponent.getDataLayerColumns(valueRelationDataLayer);
						promises.push(dataLayerColumnsPromise);
						if (dataLayerColumnsPromise) {
							dataLayerColumnsPromise.then(function (dataLayerColumns) {
								//let columns = [];
								//_.each(dataLayerColumns, function (column) {
								//	if (column.hasOwnProperty("name")) {
								//		columns.push({
								//			key: column.name,
								//			name: column.name
								//		});
								//	}
								//});
								logger.info("ConfigPlaceDataSourceAULevels# then(), getDataLayerColumns: ", dataLayerColumns);
								relationsState[relation.key] = {
									//columns: columns,
									columns: dataLayerColumns,
									valuesColumnMap: relation.columnMap,
									//valueDataLayer: valueRelationDataLayer,
									valueFidColumn: relation.fidColumn,
									valueNameColumn: relation.nameColumn,
									valueParentColumn: relation.parentColumn
								};
							});
						}

					})(relation);
				}
			}
			Promise.all(promises).then(function () {

				valueDataLayer = dataLayers[0]; // todo check all
				let columns = relationsState[thisComponent.state.relations[0].key].columns;
				let savedState = {
					valueDataLayer: valueDataLayer,
					valueFidColumn: thisComponent.state.relations[0].fidColumn,
					valueNameColumn: thisComponent.state.relations[0].nameColumn,
					valueParentColumn: thisComponent.state.relations[0].parentColumn
				};
				let newState = {
					relationsState: {$set: relationsState},
					valueDataLayer: {$set: valueDataLayer},
					valueFidColumn: {$set: thisComponent.state.relations[0].fidColumn},
					valueNameColumn: {$set: thisComponent.state.relations[0].nameColumn},
					valueParentColumn: {$set: thisComponent.state.relations[0].parentColumn},
					savedState: {$merge: savedState},
					columns: {$set: columns}
				};
				thisComponent.context.setStateDeep.call(thisComponent, newState);

			});
		} else {
			let savedState = {
				valueDataLayer: null,
				valueFidColumn: null,
				valueNameColumn: null,
				valueParentColumn: null
			};
			let newState = {
				relationsState: {$set: {}},
				valueDataLayer: {$set: null},
				valueFidColumn: {$set: null},
				valueNameColumn: {$set: null},
				valueParentColumn: {$set: null},
				savedState: {$merge: savedState},
				columns: {$set: []}
			};
			thisComponent.context.setStateDeep.call(thisComponent, newState);
		}
	}

	_onStoreChange(keys) {
		logger.trace("ConfigPlaceDataSourceAULevel# _onStoreChange(), Keys:", keys);
		this.setStateFromStores(this.props,keys);
	}

	componentDidMount() {
		super.componentDidMount();
		this.changeListener.add(PlaceStore, ["place"]);
		this.changeListener.add(AULevelStore, ["auLevel"]);
		this.changeListener.add(DataLayerStore, ["dataLayers"]);
		this.changeListener.add(ObjectRelationStore, ["relations"]);

		this.setStateFromStores();
	}

	componentWillReceiveProps(newProps) {
		if(
			(newProps.selectorValuePlace!=this.props.selectorValuePlace) ||
			(newProps.selectorValueAULevel!=this.props.selectorValueAULevel)
		) {
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
		var isIt = true;
		if (
			this.state.place &&
			this.state.auLevel
		) {
			isIt = (
				this.state.valueDataLayer == this.state.savedState.valueDataLayer &&
				this.state.valueFidColumn == this.state.savedState.valueFidColumn &&
				this.state.valueNameColumn == this.state.savedState.valueNameColumn &&
				this.state.valueParentColumn == this.state.savedState.valueParentColumn
			);
		}
		return isIt;
	}


	saveForm() {
		super.saveForm();

		var actionData = [];

		if (
			this.state.relations.length &&
			this.state.valueDataLayer &&
			this.state.valueFidColumn
		) {
			// updating

			var relations = utils.clone(this.state.relations);

			for (let relation of relations) {

				let dataSource = _.findWhere(this.state.dataLayers, {key: this.state.valueDataLayer});

				let object = {
					key: relation.key,
					dataSource: dataSource,
					fidColumn: this.state.valueFidColumn
				};
				if (this.state.valueNameColumn) {
					object.nameColumn = this.state.valueNameColumn;
				} else if (this.state.savedState.valueNameColumn) {
					object.nameColumn = null;
				}
				if (this.state.valueParentColumn) {
					object.parentColumn = this.state.valueParentColumn;
				} else if (this.state.savedState.valueParentColumn) {
					object.parentColumn = null;
				}

				let model = new Model[ObjectTypes.OBJECT_RELATION](object);
				actionData.push({type: "update", model: model});

			}
		} else if (
			this.state.valueDataLayer &&
			this.state.valueFidColumn &&
			(
				// this is the uppermost level, or parent column is filled in
				this.state.place.scope.levels[0].key == this.props.selectorValueAULevel ||
				this.state.valueParentColumn
			)
		) {
			// saving new relations

			let scopePeriods = this.state.place.scope.periods;
			//let scopePeriodsPromise = utils.getPeriodsForScope(this.state.place.scope);
			for (let period of scopePeriods) {

				let dataSource = _.findWhere(this.state.dataLayers, {key: this.state.valueDataLayer});

				let object = {
					active: true,
					period: period,
					layerObject: this.state.auLevel,
					place: this.state.place,
					placeKey: this.state.place.key, // temp - todo remove when unneded
					isOfAttributeSet: false,
					dataSource: dataSource,
					dataSourceString: dataSource.key, // temp - todo remove when unneded
					dataSourceOrigin: "geonode",
					fidColumn: this.state.valueFidColumn
				};
				if (this.state.valueNameColumn) {
					object.nameColumn = this.state.valueNameColumn;
				} else if (this.state.savedState.valueNameColumn) {
					object.nameColumn = null;
				}
				if (this.state.valueParentColumn) {
					object.parentColumn = this.state.valueParentColumn;
				} else if (this.state.savedState.valueParentColumn) {
					object.parentColumn = null;
				}

				let model = new Model[ObjectTypes.OBJECT_RELATION](object);
				actionData.push({type: "create", model: model});

			}
		}

		if (actionData.length) {
			logger.info("ConfigPlaceDataSourceAULevel# saveForm(), Relations to save:", actionData);
			ActionCreator.handleObjects(actionData, ObjectTypes.OBJECT_RELATION);
		}

	}

	getDataLayerColumns (dataLayerKey) {
		return new Promise ( function (resolve,reject) {
			let dataLayerColumnsPromise = DataLayerColumnsStore.getByDataSource(dataLayerKey);
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
					resolve (columns);
				});
			}
		});

	}


	onChangeDataLayer(value, values) {
		let thisComponent = this;
		let columnsPromise = this.getDataLayerColumns(value);
		columnsPromise.then( function (columns) {
			if(thisComponent.mounted) {
				thisComponent.setState({
					valueDataLayer: value,
					columns: columns
				});
			}
		});
	}

	onChangeFidColumn(value, values) {
		this.setState({
			valueFidColumn: value
		});
	}

	onChangeNameColumn(value, values) {
		this.setState({
			valueNameColumn: value
		});
	}

	onChangeParentColumn(value, values) {
		this.setState({
			valueParentColumn: value
		});
	}



	render() {

		var thisComponent = this;
		var ret = null;
		if(
			this.state.place &&
			this.state.auLevel
		) {

			let relationsInsert = null;


			var saveButton = (
				<SaveButton
					saved={this.isStateUnchanged()}
					className="save-button"
					onClick={this.saveForm.bind(this)}
				/>
			);

			var selectorDataDataLayer = this.state.dataLayers;
			selectorDataDataLayer.sort(function(a, b) {
				if(a.referenced && !b.referenced) return 1;
				if(!a.referenced && b.referenced) return -1;
				if(a.key > b.key) return 1;
				if(a.key < b.key) return -1;
				return 0;
			});


			ret = (
				<div>

					<div className="frame-input-wrapper">
						<label className="container">
							Data layer
							<Select
								onChange={this.onChangeDataLayer.bind(this)}
								options={selectorDataDataLayer}
								optionComponent={OptionDataLayer}
								singleValueComponent={SingleValueDataLayer}
								valueKey="key"
								labelKey="key"
								value={this.state.valueDataLayer}
								clearable={false}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							FID column (Feature identifier)
							<Select
								onChange={this.onChangeFidColumn.bind(this)}
								options={this.state.columns}
								valueKey="key"
								labelKey="name"
								value={this.state.valueFidColumn}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Name column
							<Select
								onChange={this.onChangeNameColumn.bind(this)}
								options={this.state.columns}
								valueKey="key"
								labelKey="name"
								value={this.state.valueNameColumn}
							/>
						</label>
					</div>

					<div className="frame-input-wrapper">
						<label className="container">
							Parent ID column
							<Select
								onChange={this.onChangeParentColumn.bind(this)}
								options={this.state.columns}
								valueKey="key"
								labelKey="name"
								value={this.state.valueParentColumn}
							/>
						</label>
					</div>

					{saveButton}

				</div>
			);

		} else {

			ret = null;

		}


		return ret

	}
}

export default ConfigPlaceDataSourceAULevel;
