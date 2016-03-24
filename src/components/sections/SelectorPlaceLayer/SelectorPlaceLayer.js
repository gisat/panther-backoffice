import React, { PropTypes, Component } from 'react';

import { Button, Input, Icon } from '../../SEUI/elements';
import Select from 'react-select';

import ObjectTypes, {Model, Store, objectTypesMetadata} from '../../../constants/ObjectTypes';

import OptionKeyName from '../../atoms/UICustomSelect/OptionKeyName';
import SingleValueKeyName from '../../atoms/UICustomSelect/SingleValueKeyName';
import OptionPlace from '../../atoms/UICustomSelect/OptionPlace';
import SingleValuePlace from '../../atoms/UICustomSelect/SingleValuePlace';


class SelectorPlaceLayer extends Component{

	static propTypes = {
		disabled: React.PropTypes.bool,
		layerType: PropTypes.oneOf([
			ObjectTypes.VECTOR_LAYER_TEMPLATE,
			ObjectTypes.RASTER_LAYER_TEMPLATE
		]).isRequired,
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
							{objectTypesMetadata[this.props.layerType].name}
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


export default SelectorPlaceLayer;
