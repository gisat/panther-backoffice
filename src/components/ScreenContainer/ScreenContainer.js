import React, { PropTypes, Component } from 'react';
import styles from './ScreenContainer.css';
import withStyles from '../../decorators/withStyles';


@withStyles(styles)
class ScreenContainer extends Component{

  //static propTypes = {
  //  classes: PropTypes.element.isRequired,
  //  key: PropTypes.object,
  //  component: PropTypes.object
  //};

  render() {
    var classes = "screen " + this.props.classes;
    return (
      <div className={classes} id={this.props.key}><div>
        {this.props.component}
      </div></div>
    );
  }

  componentDidMount() {
    $(".screen").click(function() {
      if ( $(this).hasClass("retracted") ) {
        if ( !$(this).hasClass("limited") ) {
          /* todo check if there is enough space */
          $(this).siblings(".screen.open").removeClass("open").addClass("retracted");
        }
        $(this).removeClass("retracted").addClass("opening").delay(300).queue(function(){
          $(this).removeClass("opening").addClass("open").dequeue();
        });
        /* todo tabindex behaviour? input disabling? anchors? */
        $(this).siblings(".screen.retracted").find(":input").prop("disabled", true);
        $(this).siblings(".screen.retracted").find("a").prop("tabindex", "-1");
        /* disable inputs or tabindex=-1 only? */
        /* todo enabling */
      }
    });

  }
}


export default ScreenContainer;
