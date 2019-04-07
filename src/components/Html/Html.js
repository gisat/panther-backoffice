/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import config from '../../config';

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

		let publicPath = "";
		if (config.publicPath) {
			let cleanPublicPath = config.publicPath.replace(/^\/*(.*?)\/*$/, "$1");
			if (cleanPublicPath) {
				publicPath = "/" + cleanPublicPath;
			}
		}

		return (
			<html className="no-js" lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<title>TEP Urban ({this.props.title})</title>
				<meta name="description" content={this.props.description} />
				<link rel="shortcut icon" href="favicon.jpg" type="image/jpeg" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="apple-touch-icon" href="apple-touch-icon.png" />
				<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js" type="text/javascript"></script>
				<style id="css" dangerouslySetInnerHTML={{__html: this.props.css}} />
				<script src={publicPath + '/lib/worldwindlib.js'} type="text/javascript"></script>
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
