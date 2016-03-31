import React, { PropTypes, Component } from 'react';

import { Button, Input, Icon } from '../../SEUI/elements';
import Select from 'react-select';

import OptionKeyName from '../../atoms/UICustomSelect/OptionKeyName';
import SingleValueKeyName from '../../atoms/UICustomSelect/SingleValueKeyName';
import OptionPlace from '../../atoms/UICustomSelect/OptionPlace';
import SingleValuePlace from '../../atoms/UICustomSelect/SingleValuePlace';


class SelectorPlaceAULevel extends Component{

	static propTypes = {
		disabled: React.PropTypes.bool,
		dataPlace: React.PropTypes.array.isRequired,		// Expects "key","name"
		dataAULevel: React.PropTypes.array.isRequired,		// Expects "key","name"
		valuePlace: React.PropTypes.any,
		valueAULevel: React.PropTypes.any,
		onChange: React.PropTypes.func.isRequired
	};

	static defaultProps = {
		disabled: false,
		valuePlace: null,
		valueAULevel: null
	};

	onChangePlace (value) {
		this.props.onChange("place",value);
	}
	onChangeLayer (value) {
		this.props.onChange("auLevel",value);
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
							Analytical units level
							<Select
								onChange={this.onChangeLayer.bind(this)}
								options={this.props.dataAULevel}
								optionComponent={OptionKeyName}
								singleValueComponent={SingleValueKeyName}
								className="UICustomSelect-keyname"
								valueKey="key"
								labelKey="name"
								value={this.props.valueAULevel}
								clearable={false}
							/>
						</label>
					</div>

				</div>
			</div>
		);

	}
}


export default SelectorPlaceAULevel;
