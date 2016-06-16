import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

import utils from '../../../utils/utils';
import logger from '../../../core/Logger';

import { Checkbox } from '../../SEUI/modules';


class FormFieldActivation extends PantherComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		value: PropTypes.bool,
		savedValue: PropTypes.bool,
		onChange: PropTypes.func
	};

	static defaultProps = {
		disabled: false
	};

	render() {

		var isActiveText = "inactive";
		var isActiveClasses = "activeness-indicator";
		if(this.props.savedValue){
			isActiveText = "active";
			isActiveClasses = "activeness-indicator active";
		}
		return (
			<div className="container activeness">
				<Checkbox
					checked={this.props.value}
					onClick={this.props.onChange}
				>
					<span>Active</span>
				</Checkbox>
				<div className="frame-input-pull-right">
					{isActiveText}
					<div className={isActiveClasses}></div>
				</div>
			</div>
		);

	}

}

export default FormFieldActivation;
