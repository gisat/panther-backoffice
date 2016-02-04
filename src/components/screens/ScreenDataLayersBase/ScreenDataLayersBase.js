import React, { PropTypes, Component } from 'react';
import styles from './ScreenDataLayersBase.css';
import withStyles from '../../../decorators/withStyles';

import path from "path";

import DataLayerStore from '../../../stores/DataLayerStore';
import SelectorDataLayer from '../../sections/SelectorDataLayer';
import ConfigDataLayer from '../../sections/ConfigDataLayer';

var initialState = {
	dataLayers: [],
	selectorValue: null
};


@withStyles(styles)
class ScreenDataLayersBase extends Component {

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = initialState;
	}

	getUrl() {
		return path.join(this.props.parentUrl, "datalayers/" + this.state.selectorValue);
	}

	store2state(props) {
		//if(!props){
		//	props = this.props;
		//}
		return {
			dataLayers: DataLayerStore.getAll()
		};
	}

	_onStoreChange() {
		this.context.setStateFromStores.call(this, this.store2state());
	}

	componentDidMount() {
		DataLayerStore.addChangeListener(this._onStoreChange.bind(this));
		this.context.setStateFromStores.call(this, this.store2state());
	}

	componentWillUnmount() {
		DataLayerStore.removeChangeListener(this._onStoreChange.bind(this));
	}

	componentWillReceiveProps(newProps) {
		this.context.setStateFromStores.call(this, this.store2state(newProps));
	}

	onSelectorFocus(){
		DataLayerStore.reload();
	}

	onSelectorChange (value) {
		this.setState({
			selectorValue: value
		});
	}

	render() {
		var selectorData = this.state.dataLayers;
		selectorData.sort(function(a, b) {
			if(a.referenced==b.referenced){
				return 0;
			} else if(a.referenced && !b.referenced) {
				return 1;
			} else if(!a.referenced && b.referenced) {
				return -1;
			}
		});

		return (
			<div>
				<div className="screen-setter"><div>
					<SelectorDataLayer
						disabled={this.props.disabled}
						data={selectorData}
						value={this.state.selectorValue}
						onChange={this.onSelectorChange.bind(this)}
						onFocus={this.onSelectorFocus.bind(this)}
					/>
				</div></div>
				<div className="screen-content"><div>
					<ConfigDataLayer
						disabled={this.props.disabled}
						selectorValue={this.state.selectorValue}
						parentUrl={this.getUrl()}
					/>
				</div></div>
			</div>
		);

	}
}

export default ScreenDataLayersBase;
