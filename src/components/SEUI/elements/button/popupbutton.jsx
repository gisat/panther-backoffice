import React from 'react';
import { Button } from '../../elements';
import { Popup } from '../../modules';

	/* does not work */

	function onMouseEnter() {
		this.setState({
				active: true
		});
	}

	function onMouseLeave() {
		this.setState({
				active: false
		});
	}

function renderChildren(children, popup) {
		let componentChildren = [];

		componentChildren.push(
				<Popup
						active={this.state.active}
				>
					{popup}
				</Popup>
		);

		React.Children.forEach(children, child => {
				componentChildren.push(child);
		});

		return componentChildren;
}

let PopupButton = ({ children, ...other }) => {

		return (
				<Button
						{...other}
						onMouseEnter={this.onMouseEnter.bind(this)}
						onMouseLeave={this.onMouseLeave.bind(this)}
				>
						{renderChildren(children, popup)}
				</Button>
		);
};

PopupButton.propTypes = {
		children: React.PropTypes.node,
		popup: React.PropTypes.string
}

exports.PopupButton = PopupButton;
