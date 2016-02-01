import React, { PropTypes, Component } from 'react';
import styles from './ScreenContainer.css';
import withStyles from '../../decorators/withStyles';
import classNames from 'classnames';

import { Icon, IconButton, Buttons } from '../SEUI/elements';

const screenStack = require('../../stores/screenStack');

@withStyles(styles)
class ScreenContainer extends Component{

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

	//constructor(props) {
	//	super(props);
	//
	//}

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
			onInteraction: function(funcToRunAfter){
				return function() {
					var page = this.context.activePageKey();
					var removed = [];
					//console.log("/ screenStack[page][0]: ", screenStack[page][0]);
					console.log("SCREEN-INTERACTION " + page + "/" + this.props.screenState.key);
					//console.log("ONSCREENINTERACTIVITY\nfuncToRunAfter:", funcToRunAfter, "\nthis:", this);
					screenStack[page].map(function (screen, index) {
						if (screen.key == this.props.screenState.key) {
							removed = screenStack[page].splice(index, 1);
						}
					}.bind(this)); // binds to ScreenContainer
					screenStack[page].unshift(removed[0]);
					//console.log("\\ screenStack[page][0]: ", screenStack[page][0]);
					if(funcToRunAfter) funcToRunAfter();
				}.bind(this); // binds to ScreenContainer
			}.bind(this) // binds to ScreenContainer
			//onSetScreenData: this.props.onSetScreenData
		};
	}

	componentDidMount() {
		console.log("CDM");
		// todo ! only first mount on opening (now runs every time page is switched
		if(this.props.screenState.isDynamic){
			var thisComponent = this;
			setTimeout(function () {
				thisComponent.props.onOpen();
			}, 100);
		}
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
		var contentAlignClass = this.props.screenState.contentAlign || "";
		var positionClass = this.props.screenState.position || "open";
		var disabledClass = (disabled || positionClass == "retracted" || positionClass == "closed") ? "disabled":"";
		var classes = this.props.screenState.classes || "";

		var screenStyles = {};

		var forceWidth = this.props.screenState.forceWidth || null;
		if(forceWidth !== null){
			screenStyles.width = forceWidth + "rem";
		}

		return (
			<div className={classNames("screen", classes, typeClass, sizeClass, positionClass, disabledClass, contentAlignClass)} style={screenStyles}>
				<div className="screen-scroll"><div>
					{React.cloneElement(this.props.screenState.component, {
						disabled: disabled,
						data: this.props.screenState.data || {},
						parentUrl: this.props.screenState.parentUrl || ""
					} )}
				</div></div>
				<div className="screen-controls middle">
					<Buttons basic icon vertical>
						<IconButton
							name="chevron right"
							onClick={this.props.onRetract.bind(null,{init: false})}
						/>
					</Buttons>
				</div>
				<div
					className="screen-overlay"
					onClick={this.props.onOpen.bind(null,{init: false})}
				></div>
				<div className="screen-controls top">
					<Buttons basic icon vertical>
						<IconButton
							name="remove"
							onClick={this.props.onClose.bind(null,{init: false})}
						/>
					</Buttons>
				</div>
			</div>
		);
	}

}


export default ScreenContainer;
