import React, { PropTypes, Component } from 'react';
import styles from './ConfigDataLayer.css';
import withStyles from '../../../decorators/withStyles';

import Select from 'react-select';
import SaveButton from '../../atoms/SaveButton';

import ConfigDataLayerVector from '../ConfigDataLayerVector';
import ConfigDataLayerRaster from '../ConfigDataLayerRaster';
import ConfigDataLayerAnalytical from '../ConfigDataLayerAnalytical';


const LAYERTYPES = [
	{key: 1, name: "Vector layer"},
	{key: 2, name: "Raster layer"},
	{key: 3, name: "Analytical units layer"}
];
const SCOPES = [
	{key: 1, name: 'Local'},
	{key: 2, name: 'National'},
	{key: 3, name: 'Regional'}
];
const PLACES = [
	{key: 1, scope: 1, name: 'Cebu City'},
	{key: 2, scope: 1, name: 'Hai Phong'},
	{key: 3, scope: 1, name: 'Ho Chi Minh City'},
	{key: 4, scope: 1, name: 'Surabaya'},
	{key: 52, scope: 2, name: 'Brunei'},
	{key: 74, scope: 2, name: 'Japan'},
	{key: 82, scope: 2, name: 'Laos'},
	{key: 135, scope: 2, name: 'Vietnam'},
	{key: 625, scope: 3, name: 'East Asia and Pacific'},
];
const VECTORLAYERTEMPLATES = [
	{key: 1, name: 'Road network'},
	{key: 2, name: 'Hospitals'},
	{key: 3, name: 'Land cover'},
	{key: 4, name: 'Land cover change'},
	{key: 5, name: 'Possible low-income settlements (areals)'},
	{key: 7, name: 'Possible low-income settlements (mid-points)'}
];
const AULEVELS = [
	{key: 1, name: "AOI"},
	{key: 2, name: "Core City x Outer Urban Zone"},
	{key: 3, name: "GADM2"},
	{key: 4, name: "GADM3"},
	{key: 5, name: "GADM4"}
];
const VLDESTINATIONS = [
	{key: "I", isAttribute: false, name: 'FID (feature identifier)'},
	{key: "N", isAttribute: false, name: 'Feature name'},
	{key: 220, isAttribute: true, attset: "Change code", name: 'LCF code'},
	{key: 221, isAttribute: true, attset: "Change code", name: 'Current code'},
	{key: 222, isAttribute: true, attset: "Change code", name: 'Previous code'},
	{key: 223, isAttribute: true, attset: "Change code", name: 'UF code'},
	{key: 287, isAttribute: true, attset: "Status code", name: 'Code'},
	{key: 315, isAttribute: true, attset: "Aggregated LC Classes", name: 'Urban fabric'},
	{key: 316, isAttribute: true, attset: "Aggregated LC Classes", name: 'Artificial areas'},
	{key: 317, isAttribute: true, attset: "Aggregated LC Classes", name: 'Natural and semi-natural areas'},
	{key: 318, isAttribute: true, attset: "Aggregated LC Classes", name: 'Water'}
];
const AUDESTINATIONS = [
	{key: "I", isAttribute: false, name: 'FID (feature identifier)'},
	{key: "N", isAttribute: false, name: 'Feature name'},
	{key: "P", isAttribute: false, name: 'Parent feature identifier'}
];
const PERIODS = [
	{key: 1, name: '1990'},
	{key: 2, name: '2000'},
	{key: 3, name: '2010'}
];
const TOPICS = [
	{key: 7, topic: 'Land cover structure', themes: [18, 23, 32]},
	{key: 12, topic: 'Land cover development', themes: [18, 23, 32]},
	{key: 16, topic: 'Urban population', themes: [30]},
	{key: 19, topic: 'Urban expansions', themes: [30]},
	{key: 22, topic: 'Total populations', themes: [25]},
	{key: 23, topic: 'Population density grid', themes: [18, 23, 25, 30, 32]},
	{key: 33, topic: 'Roads', themes: [18, 23, 32]}
];
const THEMES = [
	{key: 18, theme: 'Population'},
	{key: 23, theme: 'Transportation'},
	{key: 25, theme: 'Total population'},
	{key: 30, theme: 'Urban expansion'},
	{key: 32, theme: 'Land cover'}
];

@withStyles(styles)
class ConfigDataLayer extends Component{

	constructor(props) {
		super(props);

		this.state = {
			layerType: null,
			valueVLTemplate: [4],
			valueVLScope: [1],
			valuesVLPlaces: [2,3],
			valuesVLPeriods: [3],
			valueRLTemplate: [2],
			valueRLScope: [1],
			valuesRLPlaces: [2,3],
			valuesRLPeriods: [2],
			valueAUScope: [1],
			valuesAUPlaces: [2,3],
			valueAULevel: [2]
		};

	}

	componentDidMount() {

	}


	onChangeLayerType (key) {
		this.setState({
			layerType: key
		});
	}

	handleNewObjects(values, store) {
		var newValues = [];
		for (var singleValue of values) {
			if(singleValue.create){
				// replace with actual object creation and config screen opening
				delete singleValue.create;
				delete singleValue.label;
				delete singleValue.value;
				singleValue.key = Math.floor((Math.random() * 10000) + 1);
				store.push(singleValue);
			}
			newValues.push(singleValue.key);
		}
		return newValues;
	}

	onChangeObjectSelect (stateKey, store, value, values) {
		values = this.handleNewObjects(values, store);
		var newState = {};
		newState[stateKey] = values;
		this.setState(newState);
	}

	onObjectClick (value, event) {
		console.log("yay! " + value["key"]);
	}

	keyNameOptionFactory (inputValue) {
		var newOption = {
			key: inputValue,
			name: inputValue,
			value: inputValue,
			label: inputValue,
			create: true
		};
		return newOption;
	}



	render() {

		var saveButton = " ";
		if (this.state.layerType > 0) {
			saveButton = (
				<SaveButton
					saved
					className="save-button"
				/>
			);
		}

		return (
			<div>

				<div className="frame-input-wrapper">
					<label className="container">
						Layer type
						<Select
							onChange={this.onChangeLayerType.bind(this)}
							options={LAYERTYPES}
							valueKey="key"
							labelKey="name"
							value={this.state.layerType}
							clearable={false}
						/>
					</label>
				</div>

				<div
					className={this.state.layerType==null ? 'variant active' : 'variant'}
					id="config-data-layer-none"
				>
					<span>Select layer type</span>
				</div>
				<div
					className={this.state.layerType==1 ? 'variant active' : 'variant'}
					id="config-data-layer-vector"
				>
					<ConfigDataLayerVector
						layerTemplates={VECTORLAYERTEMPLATES}
						scopes={SCOPES}
						places={PLACES}
						periods={PERIODS}
						destinations={VLDESTINATIONS}
						valueTemplate={this.state.valueVLTemplate}
						valueScope={this.state.valueVLScope}
						valuesPlaces={this.state.valuesVLPlaces}
						valuesPeriods={this.state.valuesVLPeriods}
						onChangeTemplate={this.onChangeObjectSelect.bind(this, "valueVLTemplate", VECTORLAYERTEMPLATES)}
						onChangeScope={this.onChangeObjectSelect.bind(this, "valueVLScope", SCOPES)}
						onChangePlaces={this.onChangeObjectSelect.bind(this, "valuesVLPlaces", PLACES)}
						onChangePeriods={this.onChangeObjectSelect.bind(this, "valuesVLPeriods", PERIODS)}
						onObjectClick={this.onObjectClick.bind(this)}
						keyNameOptionFactory={this.keyNameOptionFactory.bind(this)}
					/>
				</div>
				<div
					className={this.state.layerType==2 ? 'variant active' : 'variant'}
					id="config-data-layer-raster"
				>
					<ConfigDataLayerRaster
						layerTemplates={VECTORLAYERTEMPLATES}
						scopes={SCOPES}
						places={PLACES}
						periods={PERIODS}
						valueTemplate={this.state.valueRLTemplate}
						valueScope={this.state.valueRLScope}
						valuesPlaces={this.state.valuesRLPlaces}
						valuesPeriods={this.state.valuesRLPeriods}
						onChangeTemplate={this.onChangeObjectSelect.bind(this, "valueRLTemplate", VECTORLAYERTEMPLATES)}
						onChangeScope={this.onChangeObjectSelect.bind(this, "valueRLScope", SCOPES)}
						onChangePlaces={this.onChangeObjectSelect.bind(this, "valuesRLPlaces", PLACES)}
						onChangePeriods={this.onChangeObjectSelect.bind(this, "valuesRLPeriods", PERIODS)}
						onObjectClick={this.onObjectClick.bind(this)}
						keyNameOptionFactory={this.keyNameOptionFactory.bind(this)}
					/>
				</div>
				<div
					className={this.state.layerType==3 ? 'variant active' : 'variant'}
					id="config-data-layer-au"
				>
					<ConfigDataLayerAnalytical
						levels={AULEVELS}
						scopes={SCOPES}
						places={PLACES}
						periods={PERIODS}
						destinations={AUDESTINATIONS}
						valueLevel={this.state.valueAULevel}
						valueScope={this.state.valueAUScope}
						valuesPlaces={this.state.valuesAUPlaces}
						onChangeLevel={this.onChangeObjectSelect.bind(this, "valueAULevel", AULEVELS)}
						onChangeScope={this.onChangeObjectSelect.bind(this, "valueAUScope", SCOPES)}
						onChangePlaces={this.onChangeObjectSelect.bind(this, "valuesAUPlaces", PLACES)}
						onObjectClick={this.onObjectClick.bind(this)}
						keyNameOptionFactory={this.keyNameOptionFactory.bind(this)}
					/>
				</div>

				{saveButton}

			</div>
		);

	}
}

export default ConfigDataLayer;
