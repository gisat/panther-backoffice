import React, { PropTypes, Component } from 'react';
import styles from './ScreenDataLayersBase.css';
import withStyles from '../../../decorators/withStyles';

import DataLayerStore from '../../../stores/DataLayerStore';
import SelectorDataLayer from '../../sections/SelectorDataLayer';
import ConfigDataLayer from '../../sections/ConfigDataLayer';

var initialState = {
	dataLayers: [],
	selectorValue: null
};

var store2state = {
	dataLayers: DataLayerStore.getAll(),
	jiny: DataLayerStore.getAll()
};

@withStyles(styles)
class ScreenDataLayersBase extends Component{

	static contextTypes = {
		setStateFromStores: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = initialState;
	}

	_onStoreChange() {
		this.context.setStateFromStores.call(this, store2state);
	}

	componentDidMount() {
		DataLayerStore.addChangeListener(this._onStoreChange);
		this.context.setStateFromStores.call(this, store2state);
	}

	componentWillUnmount() {
		DataLayerStore.removeChangeListener(this._onStoreChange);
	}

	onSelectorChange (value) {
		this.setState({
			selectorValue: value
		});
	}

	render() {
		return (
			<div>
				<div className="screen-setter"><div>
					<SelectorDataLayer
						disabled={this.props.disabled}
						data={this.state.dataLayers}
						value={this.state.selectorValue}
						onChange={this.onSelectorChange.bind(this)}
					/>
				</div></div>
				<div className="screen-content"><div>
					<ConfigDataLayer
						disabled={this.props.disabled}
						// todo pass selected dataLayer
					/>
				</div></div>
			</div>
		);

	}
}

export default ScreenDataLayersBase;
