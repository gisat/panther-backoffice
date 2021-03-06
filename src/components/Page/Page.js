import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Page.css';
import _ from 'underscore';
import classNames from 'classnames';

import utils from '../../utils/utils';

import ScreenContainer from '../ScreenContainer';

import ScreenStore from '../../stores/ScreenStore';

import ListenerHandler from '../../core/ListenerHandler';
import logger from '../../core/Logger';
import PantherComponent from '../common/PantherComponent';

var initialState = {
	key: null,
	title: null,
	screens: [],
	screenSets: {}
};


@withStyles(styles)
class Page extends PantherComponent {


	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
		activePageKey: PropTypes.func.isRequired
	};

	static childContextTypes = {
		screenSetKey: PropTypes.string
	};

	getChildContext(){
		return {
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
		logger.trace("Page# _onStoreChange()");
		super.setStateFromStores(this.store2state());
	}

	componentDidMount() {
		super.componentDidMount();
		if(this.props.screenSet) {
			this.changeListener.add(ScreenStore);
			super.setStateFromStores(this.store2state());
		}
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		if(this.props.screenSet) {
			this.changeListener.clean();
		}
	}

	componentWillReceiveProps(newProps) {
		if (newProps.screenSet != this.state.screenSet.key) {
			super.setStateFromStores(this.store2state(newProps));
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
						screenSet={this.props.screenSet}
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
