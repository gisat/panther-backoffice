import React, { PropTypes, Component } from 'react';
import styles from './ConfigPlaceDataSourcePeriod.css';
import withStyles from '../../../decorators/withStyles';

import _ from 'underscore';
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


var initialState = {
	place: null,
	attributeSet: null,
	auLevel: null,
	vectorLayer: null,
	rasterLayer: null,
	relations: []
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
		onInteraction: PropTypes.func.isRequired
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
					auLevel: AULevelStore.getById(props.auLevel)
				};
				break;
			case "Vector":
				return {
					place: PlaceStore.getById(props.place),
					period: PeriodStore.getById(props.period),
					vectorLayer: VectorLayerStore.getById(props.vectorLayer)
				};
				break;
			case "VectorAttSet":
				return {
					place: PlaceStore.getById(props.place),
					period: PeriodStore.getById(props.period),
					attributeSet: AttributeSetStore.getById(props.attributeSet),
					vectorLayer: VectorLayerStore.getById(props.vectorLayer)
				};
				break;
			case "Raster":
				return {
					place: PlaceStore.getById(props.place),
					period: PeriodStore.getById(props.period),
					rasterLayer: RasterLayerStore.getById(props.rasterLayer)
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
				thisComponent.context.setStateFromStores.call(thisComponent, relations2state);
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

		$(".rsc-btn-expand").click(function() {
			var parentElement = $(this).parent();
			parentElement.toggleClass("expanded");
			parentElement.prev().children(".rsc-row").toggleClass("expanded");
		});
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

			ret = (
				<div className="data-source-period-box">

					<h3 className="rsc-header">{this.props.period}</h3>
					<div className="row-select-config">
						<CheckboxFields
							type="grouped"
							radio
							name="rsc-asaul-623-2-1"
							onChange={function(){}}
						>

							<Checkbox
								key="asaul-data-42"
								className="rsc-row active expandable"
							>
								<UISVG
									src='icon-datalayers.isvg'
									className="positive"
								/>
								puma_hcmc_lulc_status_2000
							</Checkbox>
							<div className="rsc-expand ">
								<a href="#" className="rsc-btn-expand">configure<b/></a>
								<div><div>

									<label className="container">
										Data layer
										<Select
											//onChange={this.onChangeAttSet.bind(this)}
											//loadOptions={this.getPlaces}
											options={DATALAYERS}
											valueKey="key"
											labelKey="key"
											//inputProps={selectInputProps}
											value="geonode:hcmc_b3_gadm_adm"
										/>
									</label>

									<label className="container">
										FID column (Feature identifier)
										<Select
											//onChange={this.onChangeAttSet.bind(this)}
											//loadOptions={this.getPlaces}
											options={COLUMNS}
											valueKey="key"
											labelKey="key"
											//inputProps={selectInputProps}
											value="ID_0"
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

										<tr>
											<td className="header">Continuous Urban Fabric (S.L. > 80%)</td>
											<td className="allowOverflow resetui">
												<Select
													//onChange={this.onChangeAttSet.bind(this)}
													//loadOptions={this.getPlaces}
													options={COLUMNS}
													valueKey="key"
													labelKey="key"
													//inputProps={selectInputProps}
													value="uf_00"
												/>
											</td>
										</tr>

										<tr>
											<td className="header">Discontinuous High Dense Urban Fabric (S.L. 50% - 80%)</td>
											<td className="allowOverflow resetui">
												<Select
													//onChange={this.onChangeAttSet.bind(this)}
													//loadOptions={this.getPlaces}
													options={COLUMNS}
													valueKey="key"
													labelKey="key"
													//inputProps={selectInputProps}
													value="diff_uf"
												/>
											</td>
										</tr>

										<tr>
											<td className="header">Discontinuous Low Dense Urban Fabric (S.L.: 10% - 50%)</td>
											<td className="allowOverflow resetui">
												<Select
													//onChange={this.onChangeAttSet.bind(this)}
													//loadOptions={this.getPlaces}
													options={COLUMNS}
													valueKey="key"
													labelKey="key"
													//inputProps={selectInputProps}
													value="uf_00"
												/>
											</td>
										</tr>

										<tr>
											<td className="header">Industrial, Commercial and Transport Units</td>
											<td className="allowOverflow resetui">
												<Select
													//onChange={this.onChangeAttSet.bind(this)}
													//loadOptions={this.getPlaces}
													options={COLUMNS}
													valueKey="key"
													labelKey="key"
													//inputProps={selectInputProps}
													value="fo_00"
												/>
											</td>
										</tr>

										<tr>
											<td className="header">Construction sites</td>
											<td className="allowOverflow resetui">
												<Select
													//onChange={this.onChangeAttSet.bind(this)}
													//loadOptions={this.getPlaces}
													options={COLUMNS}
													valueKey="key"
													labelKey="key"
													//inputProps={selectInputProps}
													value="diff_uf"
												/>
											</td>
										</tr>


										</tbody>
									</Table>

								</div></div>
							</div>

							<Checkbox key="asaul-data-841" className="rsc-row">
								<UISVG src='icon-analyses.isvg' className="positive" />
								<span className="option-id">237</span>
								Status aggregated
							</Checkbox>

						</CheckboxFields>
					</div>

					<div className="rsc-controls">
						<IconButton name="plus" basic>
							Add data layer source
						</IconButton>
						<UIScreenButton basic>
							<Icon name="plus" />
							New analysis
						</UIScreenButton>
						<SaveButton />
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
