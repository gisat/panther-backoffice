import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageAnalyses.css';
import _ from 'underscore';

//import { Segment, Button, Input, Header, IconButton } from '../SEUI/elements';
//import { Popup, Modal } from '../SEUI/modules';
//import { Form, Fields, Field } from '../SEUI/collections';

import Page from '../Page';
import ScreenContainer from '../ScreenContainer';
import ScreenAnalysesBase from '../ScreenAnalysesBase';
import TestScreen from '../TestScreen';

@withStyles(styles)
class PageAnalyses extends Page {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };




  constructor(props) {
    super(props);

    this.state = {
      show: false,
      screens: [
        {
          key: "screen1",
          classes: "open",
          disabled: false,
          component: <ScreenAnalysesBase/>
        },
        {
          key: "screen2",
          classes: "retracted",
          disabled: true,
          component: <TestScreen/>
        }
      ]
    };
  }



  closeScreen(screenKey) {

    var newScreens = this.state.screens;
    newScreens.map(function(obj){
      var newObj = obj;
      if(obj.key == screenKey){
        newObj.classes = "closed";
      }
      return newObj;
    });

    console.log("newScreens: ", newScreens);


    this.setState({
      screens: newScreens
    });

    //s[0].classes = "closed";
    //console.log("s: ", s);
  }

  render() {
    const title = 'Analyses';
    this.context.onSetTitle(title);

    var me = this;
    var screenNodes = this.state.screens.map(function (screen) {
      console.log("screen.classes v Page...: ",screen.classes);
      return (
        <ScreenContainer key={screen.key} component={screen.component} classes={screen.classes} closeme={me.closeScreen.bind(me, screen.key)}/>
      );
    });



    return (


      <div id="content">
        <div className="content" id={this.props.key}>
          {screenNodes}
        </div>
      </div>
    );
  }

}

export default PageAnalyses;
