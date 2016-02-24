var React = require('react');
var classes = require('classnames');

var Value = React.createClass({

	displayName: 'Value',

	propTypes: {
		disabled: React.PropTypes.bool,                   // disabled prop passed to ReactSelect
		onOptionLabelClick: React.PropTypes.func,         // method to handle click on value label
		onRemove: React.PropTypes.func,                   // method to handle remove of that value
		ordered: React.PropTypes.bool,                   // indicates if ordered values
		onMoveUp: React.PropTypes.func,                   // method to handle ordering
		onMoveDown: React.PropTypes.func,                   // method to handle ordering
		option: React.PropTypes.object.isRequired,        // option passed to component
		optionLabelClick: React.PropTypes.bool,           // indicates if onOptionLabelClick should be handled
		renderer: React.PropTypes.func                    // method to render option label passed to ReactSelect
	},

	blockEvent (event) {
		event.stopPropagation();
	},

	handleOnRemove (event) {
		if (!this.props.disabled) {
			this.props.onRemove(event);
		}
	},

	render () {
		var label = this.props.option.label;
		if (this.props.renderer) {
			label = this.props.renderer(this.props.option);
		}

		if(!this.props.onRemove && !this.props.optionLabelClick) {
			return (
				<div
					className={classes('Select-value', this.props.option.className)}
					style={this.props.option.style}
					title={this.props.option.title}
				>{label}</div>
			);
		}

		if (this.props.optionLabelClick) {
			label = (
				<a className={classes('UIObjectSelect-item-a', this.props.option.className)}
					onMouseDown={this.blockEvent}
					onTouchEnd={this.props.onOptionLabelClick}
					onClick={this.props.onOptionLabelClick}
					style={this.props.option.style}
					title={this.props.option.title}
				>
					<span className="label"><span className="option-id">{this.props.option.key}</span>{label}</span>
				</a>
			);
		}

		var orderedControls = "";
		if (this.props.ordered && this.props.onMoveUp && this.props.onMoveDown) {
			orderedControls = (
				<span
					className="UIObjectSelect-ordering-controls"
				>
					<span
						className="UIObjectSelect-item-icon"
						onMouseDown={this.blockEvent}
						onClick={this.props.onMoveUp}
						onTouchEnd={this.props.onMoveUp}
					>
						&#9652;
					</span>
					<span
						className="UIObjectSelect-item-icon"
						onMouseDown={this.blockEvent}
						onClick={this.props.onMoveDown}
						onTouchEnd={this.props.onMoveDown}
					>
						&#9662;
					</span>
				</span>
			);
		}

		return (
			<div className={classes('UIObjectSelect-item', this.props.option.className)}
				style={this.props.option.style}
				title={this.props.option.title}
			>
				<span className="UIObjectSelect-item-icon"
					onMouseDown={this.blockEvent}
					onClick={this.handleOnRemove}
					onTouchEnd={this.handleOnRemove}
				>&times;</span>
				{orderedControls}
				{label}
			</div>
		);
	}

});

module.exports = Value;
