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


var initialState = {
	place: null,
	attSet: null,
	auLevel: null
};


@withStyles(styles)
class ConfigPlaceDataSourcePeriod extends Component {


	componentDidMount() {

		$(".rsc-btn-expand").click(function() {
			var parentElement = $(this).parent();
			parentElement.toggleClass("expanded");
			parentElement.prev().children(".rsc-row").toggleClass("expanded");
		});

	}

	render() {
		return (
			<div>

				<h3 className="rsc-header">2000</h3>
				{/* todo -> component */}
				<div className="row-select-config">
					<CheckboxFields type="grouped" radio name="rsc-asaul-623-2-1" onChange={function(){}}>

						<Checkbox key="asaul-data-42" className="rsc-row active expandable">
							<UISVG src='icon-datalayers.isvg' className="positive" />
							puma_hcmc_lulc_status_2000
						</Checkbox>
						<div className="rsc-expand ">
							<a href="#" className="rsc-btn-expand">configure<b></b></a>
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

	}
}

export default ConfigPlaceDataSourcePeriod;
