import React, { PropTypes } from 'react';
import BaseComponent from '../base/BaseComponent';

import withStyles from '../../decorators/withStyles';
import styles from './WorldWindow.css';

import logger from '../../core/Logger';
import utils from '../../utils/utils';
import _ from 'underscore';
import classNames from 'classnames';
//import WorldWind from '../../../tools/lib/worldwindlib';

//var initialState = {
//	sidebarExpanded: true,
//	sidebarTab: 'scope'
//};


@withStyles(styles)
class WorldWindow extends BaseComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		id: PropTypes.string,
		onMount: PropTypes.func,
		onManualRedraw: PropTypes.func,
		onManualRedrawEnd: PropTypes.func,
		mapState: PropTypes.object,
		//store: PropTypes.shape({
		//	operations: PropTypes.object
		//}).isRequired
	};

	static defaultProps = {
		disabled: false,
		id: 'worldwindow'
	};

	constructor(props) {
		super(props);
		this._canvasId = "wwdCanvas-" + this.props.id;
	}

	componentDidMount() {
		super.componentDidMount();
		try {
			this.wwd = new WorldWind.WorldWindow(this._canvasId);
			if (this.wwd) {
				var blueMarbleLayer = new WorldWind.BMNGLandsatLayer();
				blueMarbleLayer.enabled = false;
				var bingLayer = new WorldWind.BingAerialWithLabelsLayer(null);
				bingLayer.enabled = true;

				this.wwd.addLayer(blueMarbleLayer);
				this.wwd.addLayer(bingLayer);

				if (this.props.onManualRedrawEnd) {
					this.wwd.addEventListener("mouseup", this.props.onManualRedrawEnd.bind(this, this.wwd));
					this.wwd.addEventListener("wheel", this.props.onManualRedrawEnd.bind(this, this.wwd));
				}

				if (this.props.mapState) {
					this.wwd.navigator.lookAtLocation.latitude = this.props.mapState.latitude;
					this.wwd.navigator.lookAtLocation.longitude = this.props.mapState.longitude;
					this.wwd.navigator.range = this.props.mapState.range;
					this.wwd.navigator.tilt = this.props.mapState.tilt;
					this.wwd.navigator.heading = this.props.mapState.heading;
					this.wwd.redraw();
				}

				this.props.onMount(this.wwd);
			}
		} catch(exception) {
			logger.error("WorldWindow#componentDidMount",exception);
		}
	}

	render() {
		let ret = (
			<div className="world-wind-globe">
				<canvas className="world-wind-canvas" id={this._canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);

		return ret;
	}
}

export default WorldWindow;
