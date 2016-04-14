import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

import { Button, Input, Icon } from '../../SEUI/elements';
import Select from 'react-select';

import OptionKeyName from '../../atoms/UICustomSelect/OptionKeyName';
import SingleValueKeyName from '../../atoms/UICustomSelect/SingleValueKeyName';
import OptionPlace from '../../atoms/UICustomSelect/OptionPlace';
import SingleValuePlace from '../../atoms/UICustomSelect/SingleValuePlace';


class SelectorPlaceAttSetAULevel extends PantherComponent{

	static propTypes = {
		disabled: React.PropTypes.bool,
		dataPlace: React.PropTypes.array.isRequired,		// Expects "key","name"
		dataLayer: React.PropTypes.array.isRequired,		// Expects "key","name"
		dataAttSet: React.PropTypes.array.isRequired,		// Expects "key","name"
		valuePlace: React.PropTypes.any,
		valueLayer: React.PropTypes.any,
		valueAttSet: React.PropTypes.any,
		onChange: React.PropTypes.func.isRequired
	};

	static defaultProps = {
		disabled: false,
		valuePlace: null,
		valueLayer: null,
		valueAttSet: null
	};

	onChangePlace (value) {
		this.props.onChange("place",value);
	}
	onChangeLayer (value) {
		this.props.onChange("layer",value);
	}
	onChangeAttSet (value) {
		this.props.onChange("attSet",value);
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
							Vector layer
							<Select
								onChange={this.onChangeLayer.bind(this)}
								options={this.props.dataLayer}
								optionComponent={OptionKeyName}
								singleValueComponent={SingleValueKeyName}
								className="UICustomSelect-keyname"
								valueKey="key"
								labelKey="name"
								value={this.props.valueLayer}
								clearable={false}
							/>
						</label>
					</div>

					<div className="input">
						<label className="container">
							Attribute set
							<Select
								onChange={this.onChangeAttSet.bind(this)}
								options={this.props.dataAttSet}
								optionComponent={OptionKeyName}
								singleValueComponent={SingleValueKeyName}
								className="UICustomSelect"
								valueKey="key"
								labelKey="name"
								value={this.props.valueAttSet}
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
