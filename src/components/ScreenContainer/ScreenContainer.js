import React, { PropTypes, Component } from 'react';
import styles from './ScreenContainer.css';
import withStyles from '../../decorators/withStyles';

import { Icon, IconButton, Buttons } from '../SEUI/elements';

@withStyles(styles)
class ScreenContainer extends Component{

  //static propTypes = {
  //  classes: PropTypes.string,
  //  key: PropTypes.string.isRequired,
  //  component: PropTypes.object
  //};


  render() {
    //console.log("ScreenContainer.render| props.page: ", this.props.page, " | props.thekey: ", this.props.thekey);
    return (
      <div className={"screen " + this.props.classes}>
				<div className="screen-scroll"><div>
					<div className="screen-controls top">
						<Buttons basic icon vertical>
							<IconButton name="remove"
                onClick={this.props.close}
              />
						</Buttons>
					</div>
					<div className="screen-controls middle">
						<Buttons basic icon vertical>
							<IconButton name="chevron right" />
						</Buttons>
					</div>
					{/*this.props.component*/}
					{React.cloneElement(this.props.component, { disabled: this.props.disabled })}
					{/* apparently this is how we pass props to an unknown component */}
				</div></div>
				<div className="screen-overlay"></div>
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
