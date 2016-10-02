import React, { PropTypes, Component } from 'react';
import styles from './Loader.css';
import withStyles from '../../../decorators/withStyles';
import classNames from 'classnames';
import _ from 'underscore';

const configs = {
	base: {
		sectors: 4,
		roundDurations: [1500,1300,1100,1700],
		colours: ['rgba(0,0,0,.2)','rgba(255,255,255,.35)','rgba(0,0,0,.3)','rgba(255,255,255,.45)'],
		thickness: 0.125,
		scale: 1
	},
	colour: {
		colours: ['rgba(255,80,60,.4)','rgba(50,255,50,.7)','rgba(100,160,255,.5)','rgba(255,255,0,.6)']
	},
	hero: {
		colours: ['rgba(0,0,0,.5)','rgba(255,255,255,.45)','rgba(0,0,0,.4)','rgba(255,255,255,.55)'],
		thickness: 0.075,
		scale: 3
	}
};

@withStyles(styles)
class Loader extends Component {

	static propTypes = {
		disabled: PropTypes.bool,
		centered: PropTypes.bool,
		inline: PropTypes.bool,
		scale: PropTypes.number,
		speed: PropTypes.number,
		type: PropTypes.string,
		config: PropTypes.shape({
			sectors: PropTypes.number,
			roundDurations: PropTypes.arrayOf(PropTypes.number),
			colours: PropTypes.arrayOf(PropTypes.string),
			thickness: PropTypes.number
		}),
		className: PropTypes.string
	};

	static defaultProps = {
		disabled: null,
		centered: true,
		inline: false,
		colour: false,
		scale: null,
		speed: 1,
		type: null,
		config: null,
		className: ""
	};

	constructor(props) {
		super(props);
	}

	render() {

		let classes = classNames('a-loader-container', {
			'inline': !this.props.centered && this.props.inline,
			'centered': this.props.centered
		}, this.props.className);

		let config = configs.base;
		if (this.props.type && configs.hasOwnProperty(this.props.type)) {
			config = _.assign(config, configs[this.props.type]);
		}
		if (this.props.scale) {
			config.scale = this.props.scale;
		}
		if (this.props.config) {
			config = _.assign(config, this.props.config);
		}

		let styleString = (config.scale * 2) + 'rem';
		let style = {
			container: {
				width: styleString,
				height: styleString,
				fontSize: styleString
			},
			i1: {
				animationDuration: config.roundDurations[0] + 'ms',
				borderTopColor: config.colours[0],
				borderWidth: config.thickness + 'em'
			},
			i2: {
				animationDuration: config.roundDurations[1] + 'ms',
				borderTopColor: config.colours[1],
				borderWidth: config.thickness + 'em'
			},
			i3: {
				animationDuration: config.roundDurations[2] + 'ms',
				borderTopColor: config.colours[2],
				borderWidth: config.thickness + 'em'
			},
			i4: {
				animationDuration: config.roundDurations[3] + 'ms',
				borderTopColor: config.colours[3],
				borderWidth: config.thickness + 'em'
			}
		};


		return (
			<div style={style.container} className={classes}>
				<i style={style.i1}> </i>
				<i style={style.i2}> </i>
				<i style={style.i3}> </i>
				<i style={style.i4}> </i>
			</div>
		);
	}

}

export default Loader;




