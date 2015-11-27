import React, { PropTypes, Component } from 'react';


class ScreenManager extends Component{

	//constructor(props) {
	//	super(props);
	//}


  closeScreen(page, screenKey) {
    console.log("ScreenManager.closeScreen");
    //var newScreens = page.state.screens; // I'am not sure if it is not just link and if it is a problem
    //newScreens.map(function(obj){
    //  var newObj = obj;
    //  if(obj.key == screenKey){
    //    newObj.classes = "closed";
    //  }
    //  return newObj;
    //});
    //
    //page.setState({
    //  screens: newScreens
    //});

    //console.log("ScreenManager.closeScreen page.state: ", page.state);
  }


	//render() {
  //  return null;
  //}

}

export default ScreenManager;
