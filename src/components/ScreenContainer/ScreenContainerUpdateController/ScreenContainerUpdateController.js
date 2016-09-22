import React, { PropTypes, Component } from 'react';
import PantherComponent from "../../common/PantherComponent";
import logger from '../../../core/Logger';


class ScreenContainerUpdateController extends PantherComponent {

	static propTypes = {
	  focusUpdate: PropTypes.bool,
	  disabled: PropTypes.bool
	};

	shouldComponentUpdate(nextProps, nextState) {
		return !(nextProps.focusUpdate && (nextProps.disabled == this.props.disabled));
	}

	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}

}


export default ScreenContainerUpdateController;
