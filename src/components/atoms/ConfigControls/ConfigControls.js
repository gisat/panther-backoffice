import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

import SaveButton from '../SaveButton';
import DelayButton from '../../atoms/DelayButton';


class ConfigControls extends Component {

	static propTypes = {
		disabled: PropTypes.bool,
		saved: PropTypes.bool,
		saving: PropTypes.bool,
		className: PropTypes.string,
		onSave: PropTypes.func, // one argument, bool: close panel after saving
		onDelete: PropTypes.func, // called after timeout
		deleteTimeout: PropTypes.number, // timeout for cancelling deletion
		onDuplicate: PropTypes.func
	};

	static defaultProps = {
		disabled: false,
		saved: false,
		saving: false,
		className: "",
		deleteTimeout: 5000
	};

	constructor(props) {
		super(props);
	}

	render() {

		let leftInsert = [], rightInsert = [];

		leftInsert.push(
			<SaveButton
				key="saveButton"
				saved={this.props.saved}
				saving={this.props.saving}
				disabled={this.props.disabled}
				className="save-button w6"
				onClick={this.props.onSave}
			/>
		);


		rightInsert.push(
			<DelayButton
				key="deleteButton"
				name="trash outline"
				disabled={this.props.disabled}
				className="delete-button w6"
				onClick={this.props.onDelete}
			>
				Delete
			</DelayButton>
		);

		let classes = classNames('config-controls',	this.props.className);

		return (
			<div className={classes}>
				<div className="config-controls-left">
					{leftInsert}
				</div>
				<div className="config-controls-right">
					{rightInsert}
				</div>
			</div>
		);
	}

}

export default ConfigControls;




