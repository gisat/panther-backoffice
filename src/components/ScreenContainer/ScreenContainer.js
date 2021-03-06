import React, { PropTypes, Component } from 'react';
//import styles from './ScreenContainer.css';
//import withStyles from '../../decorators/withStyles';
import classNames from 'classnames';
import _ from 'underscore';

import utils from '../../utils/utils';

import ActionCreator from '../../actions/ActionCreator';
import ScreenStore from '../../stores/ScreenStore';

import { Icon, IconButton, Buttons } from '../SEUI/elements';

import ListenerHandler from '../../core/ListenerHandler';
import logger from '../../core/Logger'
import PantherComponent from "../common/PantherComponent";

import ScreenContainerUpdateController from './ScreenContainerUpdateController';

var initialState = {
	isFocused: false,
	focusUpdate: false
};


//@withStyles(styles)
class ScreenContainer extends PantherComponent {

	//static propTypes = {
	//  classes: PropTypes.string,
	//  key: PropTypes.string.isRequired,
	//  component: PropTypes.object
	//};

	static contextTypes = {
		activePageKey: PropTypes.func.isRequired
	};
	static childContextTypes = {
		onInteraction: React.PropTypes.func
	};

	constructor(props) {
		super(props);
		this.state = utils.deepClone(initialState);

		this.focusListener = new ListenerHandler(this, this._focusScreen, 'addFocusListener', 'removeFocusListener');
	}

	getChildContext(){
		return {
			/**
			 * returns the function wrapping
			 * - move the screen in screenStack to the front
			 * - call another function
			 * Use:
			 * - callback: onClick={this.context.onInteraction( this.onChangeActive.bind(this,1) )}
			 *   ...or without parameter onFocus={this.context.onInteraction()}
			 * - directly: this.context.onInteraction()()
			 * @param funcToRunAfter (function) another function to be called after
			 * @returns function
			 */
			// todo remove?
			// remove if focus events are enough (interactions bubble through)
			onInteraction: function(funcToRunAfter){
				return function() {
					var page = this.context.activePageKey();
					var removed = [];
					logger.trace("ScreenContainer# onInteraction(), Screen interaction: ", page, "Current props: ",
						this.props, ", funcToRunAfter:", funcToRunAfter, ", Current this: ", this);

					if(funcToRunAfter) {
						funcToRunAfter();
					}
				}.bind(this); // binds to ScreenContainer
			}.bind(this) // binds to ScreenContainer
		};
	}

	_focusScreen(screenKey) {
		if(screenKey==this.props.screenState.key) {
			if(this._domSelf) {
				this._domSelf.focus();
			} else {
				logger.warn("ScreenContainer# _focusScreen(), ", screenKey, " _domSelf is null", this);
			}
		}
	}

	componentDidMount() {
		super.componentDidMount();
		logger.trace("ScreenContainer# componentDidMount(), ScreenStore: ",ScreenStore);
		this.focusListener.add(ScreenStore);
	}

	componentWillReceiveProps() {
		this.setState({
			focusUpdate: false
		});
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		this.focusListener.clean();
	}

	onPanelFocus() {
		this.setState({
			isFocused: true,
			focusUpdate: true
		});
		ActionCreator.logScreenActivity(this.props.screenState.key);
	}

	onPanelBlur() {
		this.setState({
			isFocused: false,
			focusUpdate: true
		});
	}

	retractOrOpenScreen() {
		switch(this.props.screenState.position) {
			case "retracted":
				this.openScreen();
				break;
			default: // "open", "open maximised"
				this.retractScreen();
				break;
		}
	}

	openScreen() {
		ActionCreator.openScreen(this.props.screenState.key);
	}

	retractScreen() {
		ActionCreator.retractScreen(this.props.screenState.key);
	}

	closeScreen() {
		ActionCreator.closeScreen(this.props.screenState.key);
	}

	///**
	// * setUrl combines parent URL an current screen URL
	// * function is passed to Screen as prop
	// * Use in getUrl:
	// * getUrl(){
	// *   return this.props.setUrl.call(this, "analyses");
	// * }
	// * @param screenUrl: URL to be appended to parentUrl
	// * @returns string URL
	// */
	//setUrl(screenUrl){
	//	var parentUrl = this.props.parentUrl || "";
	//
	//	//console.log("setUrl this.props: ", this.props);
	//
	//	//if(screenUrl[0] === "/"){
	//	//	screenUrl = screenUrl.slice(1);
	//	//}
	//	//if(parentUrl[parentUrl.length - 1] === "/"){
	//	//	parentUrl = parentUrl.slice(0, parentUrl.length - 1);
	//	//}
	//	//return parentUrl + "/" + screenUrl;
	//
	//	return path.join(parentUrl, screenUrl);
	//}


	render() {
		var disabled = this.props.screenState.disabled || false;
		//var typeClass = this.props.screenState.type || "";
		var typeClass = this.props.screenState.size ? "constant" : "";
		var sizeClass = this.props.screenState.size ? "const" + this.props.screenState.size : "";
		var contentSizeClass = this.props.screenState.contentSize ? "content" + this.props.screenState.contentSize : "";
		var contentAlignClass = this.props.screenState.contentAlign || "";
		var positionClass = this.props.screenState.position || "open";
		var disabledClass = (disabled || positionClass == "retracted" || positionClass == "closed") ? "disabled":"";
		var focusedClass = (this.state && this.state.isFocused) ? "focused" : "";
		var classes = this.props.screenState.classes || "";

		var screenStyles = {};

		var forceWidth = this.props.screenState.forceWidth || null;
		if(forceWidth !== null){
			screenStyles.width = forceWidth + "rem";
		}

		var totallyLocalData = {};
		_.assign(totallyLocalData,this.props.screenState.data);
		var screen = React.createElement(
			this.props.screenState.component,
			{
				disabled: disabled,
				data: totallyLocalData,
				screenKey: this.props.screenState.key,
				parentUrl: this.props.screenState.parentUrl || "",
				screenSet: this.props.screenSet
			}
		);

		return (
			<div
				className={classNames("screen", classes, typeClass, sizeClass, contentSizeClass, positionClass, disabledClass, contentAlignClass, focusedClass)}
				style={screenStyles}
				tabIndex="-1"
				ref={(el) => this._domSelf = el}
				onFocus={this.onPanelFocus.bind(this)}
				onBlur={this.onPanelBlur.bind(this)}
			>
				<div className="screen-scroll">
					{/*React.cloneElement(this.props.screenState.component, {
						disabled: disabled,
						data: totallyLocalData,
						parentUrl: this.props.screenState.parentUrl || ""
					} )*/}
					<ScreenContainerUpdateController
						focusUpdate={this.state.focusUpdate}
						disabled={this.props.disabled}
					>
						{screen}
					</ScreenContainerUpdateController>
				</div>
				<div className="screen-controls middle">
					<Buttons basic icon vertical>
						<IconButton
							name="chevron right"
							onClick={this.retractOrOpenScreen.bind(this)}
						/>
					</Buttons>
				</div>
				<div
					className="screen-overlay"
					onClick={this.openScreen.bind(this)}
				></div>
				<div className="screen-controls top">
					<Buttons basic icon vertical>
						<IconButton
							name="remove"
							onClick={this.closeScreen.bind(this)}
						/>
					</Buttons>
				</div>
			</div>
		);
	}

}


export default ScreenContainer;
