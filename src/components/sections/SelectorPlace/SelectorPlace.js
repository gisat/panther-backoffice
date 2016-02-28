import React, { PropTypes, Component } from 'react';
import styles from './SelectorPlace.css';
import withStyles from '../../../decorators/withStyles';

import { Button, Input, Icon } from '../../SEUI/elements';
import Select from 'react-select';
import UIScreenButton from '../../atoms/UIScreenButton';

import OptionPlace from '../../atoms/UICustomSelect/OptionPlace';
import SingleValuePlace from '../../atoms/UICustomSelect/SingleValuePlace';


@withStyles(styles)
class SelectorPlace extends Component{

	static propTypes = {
		disabled: React.PropTypes.bool,
		data: React.PropTypes.array.isRequired,		// Expects "key","name"
		onChange: React.PropTypes.func.isRequired,
		onNew: React.PropTypes.func,
		value: React.PropTypes.any
	};

	static defaultProps = {
		disabled: false,
		value: null
	};

	onChange (value) {
		this.props.onChange(value)
	}

	render() {

		return (
			<div>
				<div className="selector">
					<div className="input-wrapper">
						<div>
							<label className="container">
								Place
								<Select
									onChange={this.onChange.bind(this)}
									options={this.props.data}
									optionComponent={OptionPlace}
									singleValueComponent={SingleValuePlace}
									className="UICustomSelect SelectPlace"
									valueKey="key"
									labelKey="place"
									value={this.props.value}
									clearable={false}
								/>
							</label>
						</div>
						<div>
							<UIScreenButton
								basic
								onClick={this.props.onNew.bind(this)}
							>
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
