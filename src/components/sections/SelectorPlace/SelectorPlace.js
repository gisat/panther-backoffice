import React, { PropTypes, Component } from 'react';
import styles from './SelectorPlace.css';
import withStyles from '../../../decorators/withStyles';

import { Button, Input, Icon } from '../../SEUI/elements';
import Select from 'react-select';
import UIScreenButton from '../../atoms/UIScreenButton';

import OptionPlace from '../../atoms/UICustomSelect/OptionPlace';
import SingleValuePlace from '../../atoms/UICustomSelect/SingleValuePlace';

//const MAX_ITEMS = 6;
//const ASYNC_DELAY = 500;
const PLACES = [
			{ key: 1, scope: 'Local', name: 'Cebu City' },
			{ key: 2, scope: 'Local', name: 'Hai Phong' },
			{ key: 3, scope: 'Local', name: 'Ho Chi Minh City' },
			{ key: 4, scope: 'Local', name: 'Surabaya' },
			{ key: 52, scope: 'National', name: 'Brunei' },
			{ key: 74, scope: 'National', name: 'Japan' },
			{ key: 82, scope: 'National', name: 'Laos' },
			{ key: 135, scope: 'National', name: 'Vietnam' },
			{ key: 625, scope: 'Regional', name: 'East Asia and Pacific' },
		];

@withStyles(styles)
class SelectorPlace extends Component{

	constructor(props) {
		super(props);

		this.state = {
			value: 4
		};

	}

	onChange (value) {
		this.state.value = value;
	}

//	getPlaces (input, callback) {
//		alert("baf");
//		input = input.toLowerCase();
//		var options = PLACES.filter(i => {
//			return i.place.substr(0, input.length) === input;
//		});
//		var data = {
//			options: options.slice(0, MAX_ITEMS),
//			complete: options.length <= MAX_ITEMS,
//		};
//		setTimeout(function() {
//			callback(null, data);
//		}, ASYNC_DELAY);
//	}

	render() {
		var selectInputProps = {
			className: "" //"ui input"
		};

		return (
			<div>
				<div className="selector">
					<div className="input-wrapper">
						<div>
							<label className="container">
								Place
								<Select
									onChange={this.onChange.bind(this)}
									//loadOptions={this.getPlaces}
									options={PLACES}
									optionComponent={OptionPlace}
									singleValueComponent={SingleValuePlace}
									className="UICustomSelect-place"
									valueKey="key"
									labelKey="place"
									inputProps={selectInputProps}
									value={this.state.value}
									clearable={false}
								/>
							</label>
						</div>
						<div>
							<UIScreenButton basic>
								<Icon name="plus" />
								New place
							</UIScreenButton>
						</div>
					</div>
				</div>
			</div>
		);

	}
}

export default SelectorPlace;
