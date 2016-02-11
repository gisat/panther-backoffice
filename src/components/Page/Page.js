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
		onSetScreenData: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired
	};

	static childContextTypes = {
		onSetScreenData: PropTypes.func.isRequired,
		openScreen: PropTypes.func.isRequired,
		setStateDeep: PropTypes.func.isRequired
	};

	getChildContext(){
		return {
			onSetScreenData: this.context.onSetScreenData.bind(this),
			openScreen: this.openScreen.bind(this),
			setStateDeep: this.context.setStateDeep
		};
	}

	constructor(props) {
		super(props);

		var screenSets = [];
		screenSets[this.props.screenSet] = _.findWhere(SCREENSETS, {key: this.props.screenSet});

		this.buildScreenStack(screenSets[this.props.screenSet]);

		this.state = {
			key: screenSets[this.props.screenSet].key,
			title: screenSets[this.props.screenSet].title,
			screens: screenSets[this.props.screenSet].screens,
			screenSets: screenSets
		};
	}

	componentDidMount(){
		//this.context.setScreenData.bind(this)("analyses2", {zkouska: "jo", necojineho: "neco uplne jineho"});
		this.fitScreens();
	}

	componentWillReceiveProps(newProps) {
		//console.log("pageWillReceiveProps",newProps.screenSet,this.state.key);
		//console.log(this.state.screenSets);
		if (newProps.screenSet != this.state.key) {
			var screenSets = this.state.screenSets;
			if(!this.state.screenSets[newProps.screenSet]) {
				screenSets[newProps.screenSet] = _.findWhere(SCREENSETS, {key: newProps.screenSet});
			}
			if(!screenStack[newProps.screenSet]) {
				this.buildScreenStack(screenSets[newProps.screenSet]);
			}
			this.setState({
				key: this.state.screenSets[newProps.screenSet].key,
				title: this.state.screenSets[newProps.screenSet].title,
				screens: this.state.screenSets[newProps.screenSet].screens,
				screenSets: screenSets,
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

	onSetScreenData(screenKey, data){
		return this.context.onSetScreenData.bind(this, screenKey, data)();
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

	openScreen(key,component,parentUrl,options,data,openerCallback) {
		var screenSets = this.state.screenSets;
		var screenSet = {
			key: this.state.key,
			title: this.state.title,
			screens: this.state.screens
		};
		var existingScreen = _.findWhere(screenSet.screens, {key: key});
		if(existingScreen) {
			// todo send data
			console.log("Screen already exists:",existingScreen);
			this.onSetScreenData(existingScreen.key, data)();
			this.refs[key].onDynamicOpen();
		} else {
			var screen = {
				key: key,
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
			screenSets[this.state.key].screens.push(screen);
			screenStack[screenSet.key].unshift({
				key: screen.key,
				position: screen.position,
				userDidThat: true
			});
			this.setState({
					screens: screenSet.screens,
					screenSets: screenSets
				},
				function(){
					this.refs[key].onDynamicOpen();
				});
		}

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
