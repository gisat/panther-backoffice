var React = require('react');
var classes = require('classnames');

var OptionPlace = React.createClass({
	propTypes: {
		addLabelText: React.PropTypes.string,          // string rendered in case of allowCreate option passed to ReactSelect
		className: React.PropTypes.string,             // className (based on mouse position)
		mouseDown: React.PropTypes.func,               // method to handle click on option element
		mouseEnter: React.PropTypes.func,              // method to handle mouseEnter on option element
		mouseLeave: React.PropTypes.func,              // method to handle mouseLeave on option element
		option: React.PropTypes.object.isRequired,     // object that is base for that option
		renderFunc: React.PropTypes.func               // method passed to ReactSelect component to render label text
	},
	blockEvent (event) {
		event.preventDefault();
		if ((event.target.tagName !== 'A') || !('href' in event.target)) {
			return;
		}

		if (event.target.target) {
			window.open(event.target.href);
		} else {
			window.location.href = event.target.href;
		}
	},
	handleMouseDown (e) {
		this.props.mouseDown(this.props.option, e);
	},
	handleMouseEnter (e) {
		this.props.mouseEnter(this.props.option, e);
	},
	handleMouseLeave (e) {
		this.props.mouseLeave(this.props.option, e);
	},
	renderOption (option) {
		return (
			<div>
				<span className="option-id">{option.key}</span>
				<span>{option.name}</span>
				<span className="option-parent">{option.scope ? option.scope.name : "-"}</span>
			</div>
	);
	},
	render () {
		var option = this.props.option;
		var label = option.create ? this.props.addLabelText.replace('{label}', option.label) : this.renderOption(option);
		var scopeSetClass = option.scope ? "" : "no-scope";
		var optionClasses = classes(this.props.className, "UICustomSelect-option", option.className, scopeSetClass);

		return option.disabled ? (
			<div className={optionClasses}
				onMouseDown={this.blockEvent}
				onClick={this.blockEvent}>
				{label}
			</div>
		) : (
			<div className={optionClasses}
				style={option.style}
				onMouseDown={this.handleMouseDown}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onClick={this.handleMouseDown}
				title={option.title}>
				{label}
			</div>
		);
	}
});

module.exports = OptionPlace;
