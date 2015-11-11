import React, { PropTypes, Component } from 'react';
import styles from './SelectorAttSetAULevel.css';
import withStyles from '../../decorators/withStyles';

import { Button, Input, Icon } from '../SEUI/elements';
import Select from 'react-select';

//const MAX_ITEMS = 6;
//const ASYNC_DELAY = 500;
const ATTSETS = [
			{ key: 352, name: "Land Cover classes L3" },
			{ key: 623, name: "Aggregated LC Classes Formation" },
			{ key: 18, name: "Populations1" }
		];
const AULEVELS = [
			{ key: 1,	name: "AOI"	},
			{ key: 2, name: "Core City x Outer Urban Zone" },
			{ key: 3, name: "GADM2" },
			{ key: 4, name: "GADM3" },
			{ key: 5, name: "GADM4" }
		];

@withStyles(styles)
class SelectorAttSetAULevel extends Component{
  
	constructor(props) {
		super(props);

		this.state = {
			valueAttSet: 623,
			valueAULevel: 2
		};
		
	}
	
	onChangeAttSet (value) {
		this.state.valueAttSet = value;
	}
	onChangeAULevel (value) {
		this.state.valueAULevel = value;
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
        <div className="selector double">
					<div className="input">
						<label>
							Attribute set
							<Select 
								onChange={this.onChangeAttSet.bind(this)}
								//loadOptions={this.getPlaces}
								options={ATTSETS}
								valueKey="key" 
								labelKey="name" 
								inputProps={selectInputProps} 
								value={this.state.valueAttSet}
							/>
						</label>
					</div>
					
					<div className="input">
						<label>
							Analytical units level
							<Select 
								onChange={this.onChangeAULevel.bind(this)}
								//loadOptions={this.getPlaces}
								options={AULEVELS}
								valueKey="key" 
								labelKey="name" 
								inputProps={selectInputProps} 
								value={this.state.valueAULevel}
							/>
						</label>
					</div>	
				</div>
      </div>
    );

  }
}


export default SelectorAttSetAULevel;
