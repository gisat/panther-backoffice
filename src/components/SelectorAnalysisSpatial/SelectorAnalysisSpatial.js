import React, { PropTypes, Component } from 'react';
import styles from './SelectorAnalysisSpatial.css';
import withStyles from '../../decorators/withStyles';

import { Button, Input, Icon } from '../SEUI/elements';
import Select from 'react-select';


const ANALYSES = [
			{ key: 1, name: 'Land cover status' },
			{ key: 2, name: 'Land cover status aggregated' },
			{ key: 3, name: 'Land cover change' },
			{ key: 4, name: 'Land cover formation' },
			{ key: 5, name: 'Land cover consumption' },
			{ key: 7, name: 'Road type' },
			{ key: 8, name: 'Road length' }
		];

@withStyles(styles)
class SelectorAnalysisSpatial extends Component{

	constructor(props) {
		super(props);

		this.state = {
			valueAnalysisSpatial: 1,
      data: this.props.data
		};

	}

	onChangeAnalysisSpatial (value) {
		this.state.valueAnalysisSpatial = value;
	}


	render() {
    var selectInputProps = {
			className: "" //"ui input"
		};
		return (
      <div>
        <p style={{backgroundColor: "yellow"}}>DATA: {JSON.stringify(this.state.data)}</p>
        <div className="selector">
					<div className="input">
						<label className="container">
							<Select
								onChange={this.onChangeAnalysisSpatial.bind(this)}
								options={ANALYSES}
								valueKey="key"
								labelKey="name"
								inputProps={selectInputProps}
								value={this.state.valueAnalysisSpatial}
								clearable={false}
							/>
						</label>
					</div>
				</div>
      </div>
    );

  }
}


export default SelectorAnalysisSpatial;
