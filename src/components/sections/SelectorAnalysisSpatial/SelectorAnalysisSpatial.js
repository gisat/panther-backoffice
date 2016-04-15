import React, { PropTypes, Component } from 'react'; 
import PantherComponent from '../../common/PantherComponent';
import styles from './SelectorAnalysisSpatial.css';
import withStyles from '../../../decorators/withStyles';

import { Button, Input, Icon } from '../../SEUI/elements';
import Select from 'react-select';

import OptionKeyName from '../../atoms/UICustomSelect/OptionKeyName';
import SingleValueKeyName from '../../atoms/UICustomSelect/SingleValueKeyName';

import logger from '../../../core/Logger';

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
class SelectorAnalysisSpatial extends PantherComponent{

	constructor(props) {
		super(props);

		this.state = {
			idAnalysisSpatial: this.props.id,
			data: this.props.data
		};

		logger.trace("SelectorAnalysisSpatial# constructor(), Props:", props);

	}

	componentWillReceiveProps(newProps) {
		if (newProps.id != this.state.idAnalysisSpatial) {
			this.setState({idAnalysisSpatial: newProps.id});
		}
	}

	onChangeAnalysisSpatial (value) {
		this.props.onChange(value);
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
								onChange={this.onChangeAnalysisSpatial.bind(this)}
								options={ANALYSES}
								optionComponent={OptionKeyName}
								singleValueComponent={SingleValueKeyName}
								className="UICustomSelect"
								valueKey="key"
								labelKey="name"
								inputProps={selectInputProps}
								value={this.state.idAnalysisSpatial}
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
