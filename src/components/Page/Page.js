import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Page.css';


@withStyles(styles)
class Page extends Component {

  //constructor(props){
  //  super(props);
  //
  //}

  closeScreen(screenKey) {

    var newScreens = this.state.screens;
    newScreens.map(function(obj){
      var newObj = obj;
      if(obj.key == screenKey){
        newObj.classes = "closed";
      }
      return newObj;
    });

    //console.log("newScreens: ", newScreens);


    this.setState({
      screens: newScreens
    });

    //s[0].classes = "closed";
    //console.log("s: ", s);
  }

  render() {
    return (
      <div id="content">
        <div className="content" id={this.props.key}>
        </div>
      </div>
    );
  }

}

export default Page;
