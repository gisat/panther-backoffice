import React, { PropTypes, Component } from 'react';
import styles from './ScreenContainer.css';
import withStyles from '../../decorators/withStyles';
import classNames from 'classnames';

import { Icon, IconButton, Buttons } from '../SEUI/elements';

@withStyles(styles)
class ScreenContainer extends Component{

  //static propTypes = {
  //  classes: PropTypes.string,
  //  key: PropTypes.string.isRequired,
  //  component: PropTypes.object
  //};

  constructor(props){
    super(props);

    //// nasty thing
    // todo bez init, kdyz to neni ze statu
    // prevest do page
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

  render() {
    //console.log("ScreenContainer.render| props.page: ", this.props.page, " | props.thekey: ", this.props.thekey);
    var disabled = this.props.screenState.disabled || false;
    //var typeClass = this.props.screenState.type || "";
    var typeClass = this.props.screenState.size ? "constant" : "";
    var sizeClass = this.props.screenState.size ? "const" + this.props.screenState.size : "";
    var contentAlignClass = this.props.screenState.contentAlign || "";
    var positionClass = this.props.screenState.position || "open";
    var disabledClass = (disabled || positionClass == "retracted" || positionClass == "closed") ? "disabled":"";
    var classes = this.props.screenState.classes || "";

    return (
      <div className={classNames("screen", classes, typeClass, sizeClass, positionClass, disabledClass, contentAlignClass)}>
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
