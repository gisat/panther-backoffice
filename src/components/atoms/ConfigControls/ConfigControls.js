import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

import SaveButton from '../SaveButton';
import { IconButton } from '../../SEUI/elements';


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
				className="save-button"
				onClick={this.props.onSave}
			/>
		);


		rightInsert.push(
			<IconButton
				key="deleteButton"
				name="trash outline"
				basic
				disabled={this.props.disabled}
				className="delete-button"
				onClick={this.props.onDelete}
			>
				Delete
			</IconButton>
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




