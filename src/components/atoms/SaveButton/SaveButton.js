import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

import { IconButton } from '../../SEUI/elements';


class SaveButton extends Component{

	static propTypes = {
		children: React.PropTypes.node,
		className: React.PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	render() {
		var label = "";
		var isDisabled = this.props.disabled;
		if (this.props.saved){
			label = "Saved";
			isDisabled = true;
		} else {
			label = "Save";
		}
		var { saved, name, color, basic, disabled, ...other } = this.props;
		return (
			<IconButton
				{...other}
				name="check"
				basic
				color="blue"
				disabled={isDisabled}
			>
				{label}
			</IconButton>
		);
	}

}

export default SaveButton;




