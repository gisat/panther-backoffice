import React, { PropTypes, Component } from 'react';
import styles from './SelectorDataLayer.css';
import withStyles from '../../decorators/withStyles';

import { Button, Input, Icon } from '../SEUI/elements';
import Select from 'react-select';

const DATALAYERS = require('../../stores/tempDataLayers');

@withStyles(styles)
class SelectorDataLayer extends Component{
  
	constructor(props) {
		super(props);

		this.state = {
			value: "geonode:puma_srb_lulc_change_2000_2011"
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
					<div className="input">
						<label className="container">
							Data layer
							<Select 
								onChange={this.onChange.bind(this)}
								//loadOptions={this.getPlaces}
								options={DATALAYERS}
								valueKey="key" 
								labelKey="key" 
								inputProps={selectInputProps} 
								value={this.state.value}
							/>
						</label>
					</div>
				</div>
      </div>
    );

  }
}

export default SelectorDataLayer;
