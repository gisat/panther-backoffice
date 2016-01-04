import React, { PropTypes, Component } from 'react';
import styles from './SelectorMetadataLayerVector.css';
import withStyles from '../../decorators/withStyles';

import { Button, Input, Icon } from '../SEUI/elements';
import Select from 'react-select';


const LAYERTEMPLATES = [
			{ key: 1, name: 'Road network' },
			{ key: 2, name: 'Hospitals' },
			{ key: 3, name: 'Land cover' },
			{ key: 4, name: 'Land cover change' },
			{ key: 5, name: 'Possible low-income settlements (areals)' },
			{ key: 7, name: 'Possible low-income settlements (mid-points)' }
		];

@withStyles(styles)
class SelectorMetadataLayerVector extends Component{

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			valueLayerVector: 3
		};

	}

	onChangeLayerVector (value) {
		this.state.valueLayerVector = value;
	}


	render() {
		var selectInputProps = {
			className: "" //"ui input"
		};

		return (
			<div>
				<div className="selector">
					<div className="input">
						<label className="container">
							<Select
								onChange={this.context.onInteraction( this.onChangeLayerVector.bind(this) )}
								options={LAYERTEMPLATES}
								valueKey="key"
								labelKey="name"
								inputProps={selectInputProps}
								value={this.state.valueLayerVector}
								clearable={false}
							/>
						</label>
					</div>
				</div>
			</div>
		);

	}
}


export default SelectorMetadataLayerVector;
