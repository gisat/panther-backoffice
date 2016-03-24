import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Page.css';
import _ from 'underscore';
import classNames from 'classnames';

import utils from '../../utils/utils';

import ScreenContainer from '../ScreenContainer';

import ScreenStore from '../../stores/ScreenStore';

import ListenerHandler from '../../core/ListenerHandler';

var initialState = {
	key: null,
	title: null,
	screens: [],
	screenSets: {}
};


@withStyles(styles)
class Page extends Component {


	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
		activePageKey: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired,
		setStateFromStores: PropTypes.func.isRequired
	};

	static childContextTypes = {
		setStateDeep: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string
	};

	getChildContext(){
		return {
			setStateDeep: this.context.setStateDeep,
			screenSetKey: this.props.screenSet
		};
	}

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);
		this.changeListener = new ListenerHandler(this, this._onStoreChange, 'addChangeListener', 'removeChangeListener');
	}

	store2state(props) {
		if (!props) {
			props = this.props;
		}
		return {
			screenSet: ScreenStore.getById(props.screenSet),
			screenSetChanged: true
		};
	}

	_onStoreChange() {
		this.context.setStateFromStores.call(this, this.store2state());
	}

	componentDidMount() {
		if(this.props.screenSet) {
			this.changeListener.add(ScreenStore);
			this.context.setStateFromStores.call(this, this.store2state());
		}
	}

	componentWillUnmount() {
		if(this.props.screenSet) {
			this.changeListener.clean();
		}
	}

	componentWillReceiveProps(newProps) {
		if (newProps.screenSet != this.state.screenSet.key) {
			this.context.setStateFromStores.call(this, this.store2state(newProps));
		}
	}

	componentDidUpdate() {
		// todo run screenPosition on first screen in screenStack
		if(this.state.screenSetChanged) {
			this.fitScreens();
			this.setState({
				screenSetChanged: false
			});
		}
	}

	fitScreens(){
		// todo is this ever used?
	}

	render() {
		let ret = null;
		if(this.state.screenSet) {
			this.context.onSetTitle(this.state.screenSet.title);
			this.context.activePageKey(this.state.screenSet.key);
			var screenNodes = this.state.screenSet.screens.map(function (screen) {
				return (
					<ScreenContainer
						ref={screen.key}
						key={screen.key}
						screenState={screen}
						refs={this.refs}
					/>
				);
			}.bind(this));

			ret = (
				<div id="content">
					<div className={classNames("content", {"has-maximised": this.state.screenSet.hasMaximised})}>
						{screenNodes}
					</div>
				</div>
			);

		}
		return ret;
	}

}

export default Page;
