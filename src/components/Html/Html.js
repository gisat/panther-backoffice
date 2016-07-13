/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import { publicPath } from '../../config';

class Html extends Component {

	static propTypes = {
		title: PropTypes.string,
		description: PropTypes.string,
		css: PropTypes.string,
		body: PropTypes.string.isRequired
	};

	static defaultProps = {
		title: '',
		description: ''
	};


	render() {
		return (
			<html className="no-js" lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<title>{this.props.title}</title>
				<meta name="description" content={this.props.description} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="apple-touch-icon" href="apple-touch-icon.png" />
				<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js" type="text/javascript"></script>
				<style id="css" dangerouslySetInnerHTML={{__html: this.props.css}} />
				<script src="//cdnjs.cloudflare.com/ajax/libs/ol3/3.17.1/ol-debug.js" type="text/javascript"></script>
			</head>
			<body>
				<div id="app" dangerouslySetInnerHTML={{__html: this.props.body}} />
				<script src={publicPath + '/app.js'}></script>
			</body>
			</html>
		);
	}

}

export default Html;
