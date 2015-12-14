import React, { PropTypes, Component } from 'react';
import styles from './SelectorPlace.css';
import withStyles from '../../decorators/withStyles';

import { Button, Input, Icon } from '../SEUI/elements';
import Select from 'react-select';
import UIScreenButton from '../UIScreenButton';

//const MAX_ITEMS = 6;
//const ASYNC_DELAY = 500;
const PLACES = [
			{ key: 1, scope: 'Local', place: 'Cebu City' },
			{ key: 2, scope: 'Local', place: 'Hai Phong' },
			{ key: 3, scope: 'Local', place: 'Ho Chi Minh City' },
			{ key: 4, scope: 'Local', place: 'Surabaya' },
			{ key: 52, scope: 'National', place: 'Brunei' },
			{ key: 74, scope: 'National', place: 'Japan' },
			{ key: 82, scope: 'National', place: 'Laos' },
			{ key: 135, scope: 'National', place: 'Vietnam' },
			{ key: 625, scope: 'Regional', place: 'East Asia and Pacific' },
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
