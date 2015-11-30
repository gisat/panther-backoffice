import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Page.css';


@withStyles(styles)
class Page extends Component {

  constructor(props){
    super(props);

    console.log("Page constructoir");

    this.closeScreen = this.closeScreen.bind(this);
    this.testung = this.testung.bind(this);
  }

  testung(param){
    console.log("TESTUNG");
    console.log("TESTUNG PARAM: ", param);
  }

  //closeScreen(screenKey) {
  //  var newScreens = this.state.screens; // I'am not sure if it is not just link and if it is a problem
  //  newScreens.map(function(obj){
  //    var newObj = obj;
  //    if(obj.key == screenKey){
  //      newObj.classes = "closed";
  //    }
  //    return newObj;
  //  });
  //
  //  this.setState({
  //    screens: newScreens
  //  });
  //}

  //render() {
  //  return (
  //    <div id="content">
  //      <div className="content" id={this.props.key}>
  //      </div>
  //    </div>
  //  );
  //}

}

export default Page;
