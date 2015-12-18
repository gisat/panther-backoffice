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

  constructor(props) {
    super(props);

    //// nasty thing
    // todo bez init, kdyz to neni ze statu
    // prevest do page?
    switch(props.screenState.position){
      case "retracted":
            props.onRetract({init: true});
            break;
      case "closed":
            props.onClose({init: true});
            break;
      default:
            props.onOpen({init: true});
    }
  }

  getChildContext(){
    return {
      // returns the function wrapping
      //  - move the screen in screenStack to the front
      //  - call another function
      // param funcToRunAfter: another function to be called after
      // Example use: <a onClick={this.context.onInteraction( this.onChangeActive.bind(this,1) )}>
      //  ...or without parameter <input onFocus={this.context.onInteraction()}>
      onInteraction: function(funcToRunAfter){
        return function() {
          var page = this.context.activePageKey();
          var removed = [];
          //console.log("/ screenStack[page][0]: ", screenStack[page][0]);
          console.log("SCREEN-INTERACTION");
          //console.log("ONSCREENINTERACTIVITY\nfuncToRunAfter:", funcToRunAfter, "\nthis:", this);
          screenStack[page].map(function (screen, index) {
            if (screen.key == this.props.screenState.key) {
              removed = screenStack[page].splice(index, 1);
            }
          }.bind(this));
          screenStack[page].unshift(removed[0]);
          //console.log("\\ screenStack[page][0]: ", screenStack[page][0]);
          if(funcToRunAfter) funcToRunAfter();
        }.bind(this); // binds to ScreenContainer
      }.bind(this) // binds to ScreenContainer
    };
  }


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
          {React.cloneElement(this.props.screenState.component, { disabled: disabled})}
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

  componentDidMount() {
    //$(".screen").click(function() {
    //  if ( $(this).hasClass("retracted") ) {
    //    if ( !$(this).hasClass("limited") ) {
    //      /* todo check if there is enough space */
    //      $(this).siblings(".screen.open").removeClass("open").addClass("retracted");
    //    }
    //    $(this).removeClass("retracted").addClass("opening").delay(300).queue(function(){
    //      $(this).removeClass("opening").addClass("open").dequeue();
    //    });
    //    /* todo tabindex behaviour? input disabling? anchors? */
    //    $(this).siblings(".screen.retracted").find(":input").prop("disabled", true);
    //    $(this).siblings(".screen.retracted").find("a").prop("tabindex", "-1");
    //    /* disable inputs or tabindex=-1 only? */
    //    /* todo enabling */
    //  }
    //});
  }

}


export default ScreenContainer;
