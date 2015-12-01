import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageAnalyses.css';
import _ from 'underscore';

import Page from '../Page';
import ScreenContainer from '../ScreenContainer';
import ScreenAnalysesBase from '../ScreenAnalysesBase';
import ScreenAnalysisSpatial from '../ScreenAnalysisSpatial';
import ScreenAnalysisSpatialRules from '../ScreenAnalysisSpatialRules';


@withStyles(styles)
class PageAnalyses extends Component {


	static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    closeScreen: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      show: false,
      screens: [
        {
          key: "analyses1",
          classes: "open",
          disabled: false,
          component: <ScreenAnalysesBase/>
        },
        {
          key: "analyses2",
          classes: "retracted constant const40",
          disabled: true,
          component: <ScreenAnalysisSpatial/>
        },
        {
          key: "analyses3",
          classes: "retracted too wide wide80", // too should not actually be set initially
          component: <ScreenAnalysisSpatialRules/>
        }
      ]
    };
  }



  //closeScreen(screenKey) {
  //
  //  var newScreens = this.state.screens;
  //  newScreens.map(function(obj){
  //    var newObj = obj;
  //    if(obj.key == screenKey){
  //      newObj.classes = "closed";
  //    }
  //    return newObj;
  //  });
  //
  //  //console.log("newScreens: ", newScreens);
  //
  //
  //  this.setState({
  //    screens: newScreens
  //  });
  //
  //  //s[0].classes = "closed";
  //  //console.log("s: ", s);
  //}

  render() {
    const title = 'Analyses';
    this.context.onSetTitle(title);

    var me = this;
    var screenNodes = this.state.screens.map(function (screen) {
      console.log("PageAnalysis.render / state.screens.map / screen.key: ", screen.key, " / screen: ", screen);
      return (
        <ScreenContainer key={screen.key} component={screen.component} classes={screen.classes} close={me.context.closeScreen.bind(me, screen.key)} />
      ); // closeme={me.closeScreen.bind(me, screen.key)}
    });

    return (
      <div id="content">
        <div className="content">
          {screenNodes}
        </div>
      </div>
    );
  }

}

export default PageAnalyses;
