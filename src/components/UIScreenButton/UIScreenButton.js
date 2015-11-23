import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

import { IconButton } from '../SEUI/elements';


class UIScreenButton extends Component{
	
	static propTypes = {
		children: React.PropTypes.node,
		className: React.PropTypes.string
	};
	
  constructor(props) {
		super(props);
	}
	
	render() {
    var { className, ...other } = this.props;
    return (
      <IconButton
				{...other}
				basic 
				labeled="right" 
				name="angle double right" 
				className={classNames("puma-screen-button icon",className)}
			>
				{this.props.children}
			</IconButton>
    );
  }

}

export default UIScreenButton;




