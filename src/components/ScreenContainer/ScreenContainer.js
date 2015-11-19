import React, { PropTypes, Component } from 'react';
import styles from './ScreenContainer.css';
import withStyles from '../../decorators/withStyles';

const OPEN = 1;
const CLOSED = 2;
const RETRACTED = 3;

@withStyles(styles)
class ScreenContainer extends Component{

  //static propTypes = {
  //  classes: PropTypes.element.isRequired,
  //  key: PropTypes.object,
  //  component: PropTypes.object
  //};

  constructor(props) {
		super(props);

		this.state = {
			disabled: true
		};
	}

	render() {
    var classes = "screen " + this.props.classes;
    return (
      <div className={classes} id={this.props.key}><div>
  			{/*this.props.component*/}
				{React.cloneElement(this.props.component, { disabled: this.state.disabled })}
				{/* apparently this is how we pass props to an unknown component */}
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

  setPosition(position){
    console.log("Nastavuji se na ", position);
  }

}


export default ScreenContainer;
