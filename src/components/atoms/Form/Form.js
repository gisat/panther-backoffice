import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

import _ from 'underscore';
import classNames from 'classnames';

import utils from '../../../utils/utils';
import logger from '../../../core/Logger';

import FormField from '../FormField/FormField';
import SaveButton from '../SaveButton/SaveButton';


class Form extends PantherComponent {

	static propTypes = {
		disabled: PropTypes.bool
	};

	static defaultProps = {
		disabled: false
	};

	save() {
		console.log("================ Look, I'm saving a form! ==================");
	}

	render() {

		let changed = false, valid = true;
		let children = React.Children.map(this.props.children,
			(child) => {
				if (child instanceof FormField) {
					if (child.props.active) {
						changed = changed || child.props.changed;
						valid = valid && child.props.valid;
					}
					return React.cloneElement(child, {
						disabled: this.props.disabled || child.props.disabled
					})
				}
				else {
					return child;
				}
			}
		);

		let formClasses = classNames(
			'form',
			{'changed': changed},
			{'valid': valid},
			{'invalid': !valid},
			{'disabled': this.props.disabled}
		);

		let controls = (
			<SaveButton
				disabled={this.props.disabled || !valid}
				saved={!changed}
				className="save-button"
				onClick={this.save.bind(this)}
			/>
		);

		return (
			<div className={formClasses}>
				{children}
				{controls}
			</div>
		);

	}

}

export default Form;
