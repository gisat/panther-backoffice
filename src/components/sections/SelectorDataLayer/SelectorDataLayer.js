import React, { PropTypes, Component } from 'react';
import styles from './SelectorDataLayer.css';
import withStyles from '../../../decorators/withStyles';

import { Button, Input, Icon } from '../../SEUI/elements';
import Select from 'react-select';


@withStyles(styles)
class SelectorDataLayer extends Component {

	static propTypes = {
		disabled: React.PropTypes.bool,
		data: React.PropTypes.array.isRequired,		// layers object. Expects "key"
		onChange: React.PropTypes.func.isRequired,
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
				<div className="selector">
					<div className="input">
						<label className="container">
							Data layer
							<Select
								onChange={this.onChange.bind(this)}
								options={this.props.data}
								valueKey="key"
								labelKey="key"
								value={this.props.value}
								clearable={false}
							/>
						</label>
					</div>
				</div>
			</div>
		);

	}
}

export default SelectorDataLayer;
