import React, { PropTypes, Component } from 'react';
import styles from './TestC.css';
import withStyles from '../../../decorators/withStyles';


@withStyles(styles)
class TestC extends Component{

	//static propTypes = {
	//  classes: PropTypes.element.isRequired,
	//  key: PropTypes.object,
	//  component: PropTypes.object
	//};


	constructor(props) {
		super(props);

		this.state = {
			openState: "closed",
			colour: props.colour
		};
	}

	render() {
		return (
			<div className="test-c" id={this.props.key} style={{backgroundColor: this.state.colour}}>
				{this.props.text}<hr />
				{this.state.openState}
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

	setPosition(position){
		console.log("[" + this.props.text + "] Nastavuji se na ", position);
	}

}


export default TestC;
