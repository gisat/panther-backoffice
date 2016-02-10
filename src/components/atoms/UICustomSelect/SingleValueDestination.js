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
		if(option.special) {
			return (
				<div>
					<span>{option.name}</span>
				</div>
			);
		} else {
			//return (
			//	<div>
			//		<span className="option-id">{option.key}</span>
			//		<span>{option.attributeName}</span>
			//	</div>
			//);
			let attributeSetValue = option.attributeSetName + ":"
			return (
				<div>
					<div className="option-top">
						<span className="option-id">{option.attributeSetKey}</span>
						<span className="option-secondary">{attributeSetValue}</span>
					</div>
					<div className="option-bottom">
						<span className="option-id">{option.attributeKey}</span>
						<span>{option.attributeName}</span>
					</div>
				</div>
			);
		}
	},
	render: function render() {
		var specialClass = (this.props.value && this.props.value.special) ? "special-option" : "value-multiline";
		var classNames = classes('Select-placeholder', "UICustomSelect-value", this.props.value && this.props.value.className, specialClass);
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
