import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';
import styles from './SelectorDataLayer.css';
import withStyles from '../../../decorators/withStyles';

import { Button, Input, Icon } from '../../SEUI/elements';
import Select from 'react-select';

import OptionDataLayer from '../../atoms/UICustomSelect/OptionDataLayer';
import SingleValueDataLayer from '../../atoms/UICustomSelect/SingleValueDataLayer';


@withStyles(styles)
class SelectorDataLayer extends PantherComponent {

	static propTypes = {
		disabled: React.PropTypes.bool,
		data: React.PropTypes.array.isRequired,		// layers object. Expects "key"
		onChange: React.PropTypes.func.isRequired,
		value: React.PropTypes.any,
		onFocus: React.PropTypes.func.isRequired
	};

	static defaultProps = {
		disabled: false,
		value: null
	};

	onChange (value) {
		this.props.onChange(value);
	}

	onFocus(){
		this.props.onFocus();
	}

	render() {

		var selectorData = this.props.store.dataLayers;
		selectorData.sort(function(a, b) {
			if(a.referenced && !b.referenced) return 1;
			if(!a.referenced && b.referenced) return -1;
			if(a.key > b.key) return 1;
			if(a.key < b.key) return -1;
			return 0;
		});

		return (
			<div>
				<div className="selector">
					<div className="input">
						<label className="container">
							Data layer
							<Select
								onChange={this.onChange.bind(this)}
								onFocus={this.onFocus.bind(this)}
								options={selectorData}
								optionComponent={OptionDataLayer}
								singleValueComponent={SingleValueDataLayer}
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
