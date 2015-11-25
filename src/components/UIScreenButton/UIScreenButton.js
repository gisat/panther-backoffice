import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

import { Icon, Button } from '../SEUI/elements';


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
      <Button
				{...other}
				basic 
				className={classNames("puma-screen-button",className)}
			>
				{this.props.children}
				<Icon
					name="angle double right"
					className="puma"
				/>
			</Button>
    );
  }

}

export default UIScreenButton;




