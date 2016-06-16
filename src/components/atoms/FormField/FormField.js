import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

import _ from 'underscore';
import classNames from 'classnames';

import utils from '../../../utils/utils';
import logger from '../../../core/Logger';


class FormField extends PantherComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		name: PropTypes.string.isRequired,
		required: PropTypes.bool,
		active: PropTypes.bool,
		valid: PropTypes.bool,
		changed: PropTypes.bool,
		contentLabel: PropTypes.oneOfType([PropTypes.string,PropTypes.element]),
		contentInfo: PropTypes.oneOfType([PropTypes.string,PropTypes.element]),
		contentError: PropTypes.oneOfType([PropTypes.string,PropTypes.element])
	};

	static defaultProps = {
		disabled: false,
		required: false,
		active: true,
		valid: true,
		changed: false
	};

	render() {

		let frameClasses = classNames(
			'frame-input-wrapper',
			{'required': this.props.required},
			{'changed': this.props.changed},
			{'valid': this.props.valid},
			{'invalid': !this.props.valid},
			{'disabled': this.props.disabled}
		);

		let infoInsert = null;
		if (this.props.contentInfo) {
			infoInsert = (
				<div className="frame-input-wrapper-info">
					{this.props.contentInfo}
				</div>
			);
		}

		let children = React.Children.map(this.props.children,
			(child) => React.cloneElement(child, {
				disabled: this.props.disabled || child.props.disabled
			})
		);

		let fieldInsert = null;
		if (this.props.contentLabel) {
			fieldInsert = (
				<label className="container">
					{this.props.contentLabel}
					{children}
				</label>
			);
		}
		else {
			fieldInsert = children;
		}

		return (
			<div className={frameClasses}>
				{fieldInsert}
				{infoInsert}
			</div>
		);

	}

}

export default FormField;
