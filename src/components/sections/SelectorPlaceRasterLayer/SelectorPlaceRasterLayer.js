import React, { PropTypes, Component } from 'react';
import styles from './SelectorPlaceRasterLayer.css';
import withStyles from '../../../decorators/withStyles';

import { Button, Input, Icon } from '../../SEUI/elements';
import Select from 'react-select';

import OptionKeyName from '../../atoms/UICustomSelect/OptionKeyName';
import SingleValueKeyName from '../../atoms/UICustomSelect/SingleValueKeyName';
import OptionPlace from '../../atoms/UICustomSelect/OptionPlace';
import SingleValuePlace from '../../atoms/UICustomSelect/SingleValuePlace';


@withStyles(styles)
class SelectorPlaceAttSetAULevel extends Component{

	static propTypes = {
		disabled: React.PropTypes.bool,
		layerType: PropTypes.oneOf(["vector","raster"]).isRequired,
		dataPlace: React.PropTypes.array.isRequired,		// Expects "key","name"
		dataLayer: React.PropTypes.array.isRequired,		// Expects "key","name"
		valuePlace: React.PropTypes.any,
		valueLayer: React.PropTypes.any,
		onChange: React.PropTypes.func.isRequired
	};

	static defaultProps = {
		disabled: false,
		valuePlace: null,
		valueLayer: null
	};

	onChangePlace (value) {
		this.props.onChange("place",value);
	}
	onChangeLayer (value) {
		this.props.onChange("layer",value);
	}

	render() {

		return (
			<div>
				<div className="selector double">

					<div className="input">
						<label className="container">
							Place
							<Select
								onChange={this.onChangePlace.bind(this)}
								options={this.props.dataPlace}
								optionComponent={OptionPlace}
								singleValueComponent={SingleValuePlace}
								className="UICustomSelect SelectPlace"
								valueKey="key"
								labelKey="name"
								value={this.props.valuePlace}
								clearable={false}
							/>
						</label>
					</div>

					<div className="input">
						<label className="container">
							{this.props.layerType == "vector" ? "Vector layer" : "Raster layer"}
							<Select
								onChange={this.onChangeLayer.bind(this)}
								options={this.props.dataLayer}
								optionComponent={OptionKeyName}
								singleValueComponent={SingleValueKeyName}
								className="UICustomSelect"
								valueKey="key"
								labelKey="name"
								value={this.props.valueLayer}
								clearable={false}
							/>
						</label>
					</div>
				</div>
			</div>
		);

	}
}


export default SelectorPlaceAttSetAULevel;
