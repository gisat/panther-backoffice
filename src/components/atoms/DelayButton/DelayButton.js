import React, { PropTypes, Component } from 'react';
import styles from './DelayButton.css';
import withStyles from '../../../decorators/withStyles';
import classNames from 'classnames';
import _ from 'underscore';
import utils from '../../../utils/utils';

import { Icon, Button } from '../../SEUI/elements';


@withStyles(styles)
class DelayButton extends Component {

	static propTypes = {
		name: PropTypes.string,
		disabled: PropTypes.bool,
		children: PropTypes.node,
		className: PropTypes.string,
		onCountdownStart: PropTypes.func,
		onCountdownEnd: PropTypes.func,
		onCountdownCancel: PropTypes.func,
		delay: PropTypes.number,
		cancelLabel: PropTypes.string
	};

	static defaultProps = {
		disabled: false,
		onCountdownStart: function(){},
		//onCountdownEnd: function(){},
		onCountdownCancel: function(){},
		delay: 5000,
		cancelLabel: "Cancel"
	};

	constructor(props) {
		super(props);
		this.state = {
			countdown: null
		};
	}

	onClick() {
		if (this.state.countdown) {

			// cancel countdown
			this.props.onCountdownCancel();
			this.setState({
				countdown: null
			});

		} else {

			// start countdown
			let countdown = utils.guid();
			this.props.onCountdownStart();
			this.setState({
				countdown: countdown
			}, function () {
				let func = this.props.onCountdownEnd || this.props.onClick;
				let thisComponent = this;
				setTimeout(function(){
					if (thisComponent.state.countdown == countdown) {
						func();
						thisComponent.setState({
							countdown: null
						});
					}
				},this.props.delay);
			});

		}
	}

	renderChildren() {
		let componentChildren = [];

		if (!this.state.countdown) {
			componentChildren.push(
				<Icon
					key="icon"
					name={this.props.name}
				/>
			);

			React.Children.forEach(this.props.children, child => {
				componentChildren.push(child);
			});
		} else {
			componentChildren.push(this.props.cancelLabel);
		}

		return componentChildren;
	}

	render() {

		let classes = classNames(this.props.className,'ptr-delay-button',{
			countdown: !!this.state.countdown
		});
		let style = {
			transition: 'background 0ms linear'
		};
		if (this.state.countdown) {
			style = {
				transition: 'background 5000ms linear'
			};
		}
		var { color, basic, disabled, className, onClick, name, ...other } = this.props;
		return (
			<Button
				{...other}
				basic
				disabled={this.props.disabled}
				className={classes}
				style={style}
				onClick={this.onClick.bind(this)}
			>
				{this.renderChildren()}
			</Button>
		);
	}

}

export default DelayButton;




