import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Page.css';
import _ from 'underscore';
import classNames from 'classnames';

import ScreenContainer from '../ScreenContainer';

const SCREENSETS = require('../../stores/tempScreenSets');
const screenStack = require('../../stores/screenStack');

@withStyles(styles)
class Page extends Component {


	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
		activePageKey: PropTypes.func.isRequired,
		setScreenPosition: PropTypes.func.isRequired,
		onSetScreenData: PropTypes.func.isRequired
	};

	static childContextTypes = {
		onSetScreenData: PropTypes.func.isRequired,
		openScreen: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		var screenSet = _.findWhere(SCREENSETS, {key: this.props.screenSet});

		this.buildScreenStack(screenSet);

		this.state = {
			key: screenSet.key,
			title: screenSet.title,
			screens: screenSet.screens
		};

	}

	buildScreenStack(screenSet) {
		// create screenStack from screenSet
		screenStack[screenSet.key] = screenStack[screenSet.key] || [];
		screenSet.screens.map(function(screen){
			screenStack[screenSet.key].unshift({
				key: screen.key,
				position: screen.position || "open",
				userDidThat: true
			});
		});

		// reorder screenStack to be open-first
		screenStack[screenSet.key].sort(function(a, b){
			if((a.position == "closed" || a.position == "retracted") && b.position == "open"){
				return 1;
			}
			return 0;
		});

		// reindex screenStack orders
		screenStack[screenSet.key].map(function(record){
			screenSet.screens.map(function(stateRecord, stateIndex){
				if(stateRecord.key == record.key) record.order = stateIndex;
			});
		});
	}

	fitScreens(){
		if(!screenStack[this.state.key] || !screenStack[this.state.key][0]) return;
		var position = screenStack[this.state.key][0].position;
		this.context.setScreenPosition.call(this, screen.key, position, {init: true});
	}

	getChildContext(){
		return {
			onSetScreenData: this.context.onSetScreenData.bind(this),
			openScreen: this.openScreen.bind(this)
		};
	}

	componentWillReceiveProps(newProps) {
		if (newProps.screenSet != this.state.key) {
			var screenSet = _.findWhere(SCREENSETS, {key: newProps.screenSet});
			if(!screenStack[newProps.screenSet]) {
				this.buildScreenStack(screenSet);
			}
			this.setState({
				key: screenSet.key,
				title: screenSet.title,
				screens: screenSet.screens,
				screenSetChanged: true
			});
		}
	}

	componentDidUpdate() {
		// todo run screenPosition on first screen in screenStack
		if(this.state.screenSetChanged) {
			this.fitScreens();
			this.state.screenSetChanged = false;
		}

	}

	componentDidMount(){
		//this.context.setScreenData.bind(this)("analyses2", {zkouska: "jo", necojineho: "neco uplne jineho"});
		this.fitScreens();
	}

	openScreen(key,component,parentUrl,options,data,openerCallback) {
		var screenSet = {
			key: this.state.key,
			title: this.state.title,
			screens: this.state.screens
		};
		var screen = {
			key: key,
			isDynamic: true,
			position: "closed",
			component: component,
			parentUrl: parentUrl,
			data: data
		};
		if(options.type) {
			screen.type = options.type;
		}
		if(options.size) {
			screen.size = options.size;
		}
		screenSet.screens.push(screen);
		screenStack[screenSet.key].unshift({
			key: screen.key,
			position: screen.position,
			userDidThat: true
		});
		this.setState({
			screens: screenSet.screens
		});
	}

	render() {
		this.context.onSetTitle(this.state.title);
		this.context.activePageKey(this.state.key);

		//console.log("Page props.screenSet: ", this.props.screenSet);
		//var screenSet = _.findWhere(SCREENSETS, {key: this.props.screenSet});
		//console.log("Page screenSet:", screenSet);
		//var screenNodes = screenSet.screens.map(function(screen) {
		var screenNodes = this.state.screens.map(function(screen) {
			return (
				<ScreenContainer
					ref={screen.key}
					key={screen.key}
					screenState={screen}
					onClose={this.context.setScreenPosition.bind(this, screen.key, "closed")}
					onRetract={this.context.setScreenPosition.bind(this, screen.key, "retracted")}
					onOpen={this.context.setScreenPosition.bind(this, screen.key, "open")}
					onSetScreenData={this.context.onSetScreenData.bind(this)}
					refs={this.refs}
				/>
			);
		}.bind(this));

		return (
			<div id="content">
				<div className={classNames("content", {"has-maximised": this.state.hasMaximised})}>
					{screenNodes}
				</div>
			</div>
		);
	}

}

export default Page;
