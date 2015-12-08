import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';


class UISVG extends Component{
	
	static propTypes = {
		src: React.PropTypes.string.isRequired,
		element: React.PropTypes.string
	};
	
	static defaultProps = {
		element: 'div'
	};
	
	svgRequire(src) {
		return require('./img/' + src);
	}
	
	loadMarkup() { 
		var svgsrc = this.svgRequire(this.props.src);
		return {__html: svgsrc}; 
	};
	
	render() {
    let { src, element, className, ...other } = this.props;

		other.dangerouslySetInnerHTML = this.loadMarkup();
		other.className = classNames("isvg",className);

		return React.createElement(
				this.props.element,
				other,
				this.props.children
		);

  }

}

export default UISVG;
