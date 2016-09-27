import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';
import styles from './SelectorMetadataObject.css';
import withStyles from '../../../decorators/withStyles';

import { Button, Input, Icon } from '../../SEUI/elements';
import Select from 'react-select';

import OptionKeyName from '../../atoms/UICustomSelect/OptionKeyName';
import SingleValueKeyName from '../../atoms/UICustomSelect/SingleValueKeyName';


@withStyles(styles)
class SelectorMetadataObject extends PantherComponent{

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
		this.props.onChange(value);
	}

	render() {
		return (
			<div>
				<div className="selector selector-heading">
					<div className="input-wrapper basic">
						<div>
							<label className="container">
								<Select
									onChange={this.onChange.bind(this)}
									options={this.props.data}
									optionComponent={OptionKeyName}
									singleValueComponent={SingleValueKeyName}
									className="UICustomSelect"
									valueKey="key"
									labelKey="name"
									value={this.props.value}
									clearable={false}
								/>
							</label>
						</div>
						<div>
							<Button
								basic
								onClick={this.props.onNew.bind(this)}
							>
								<Icon name="plus" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		);

	}
}


export default SelectorMetadataObject;
