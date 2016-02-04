'use strict';

var React = require('react');
var classes = require('classnames');

var SingleValue = React.createClass({
	displayName: 'SingleValue',

	propTypes: {
		placeholder: React.PropTypes.string, // this is default value provided by React-Select based component
		value: React.PropTypes.object // selected option
	},
	renderValue (option) {
		return (
			<div>
				<span>{option.key}</span>
				<span className="option-parent">{option.referenced ? "" : "not set"}</span>
			</div>
		);
	},
	render: function render() {
		var classNames = classes('Select-placeholder', "UICustomSelect-value-place", this.props.value && this.props.value.className);
		var label = this.props.value ? this.renderValue(this.props.value) : this.props.placeholder;
		return React.createElement(
			'div',
			{
				className: classNames,
				style: this.props.value && this.props.value.style,
				title: this.props.value && this.props.value.title
			},
			label
		);
	}
});

module.exports = SingleValue;
