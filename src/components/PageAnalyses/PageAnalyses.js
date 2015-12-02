import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageAnalyses.css';
import _ from 'underscore';

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


  render() {
    const title = 'Analyses';
    this.context.onSetTitle(title);

    var me = this;
    var screenNodes = this.state.screens.map(function (screen) {
      return (
        <ScreenContainer key={screen.key} component={screen.component} classes={screen.classes} close={me.context.closeScreen.bind(me, screen.key)} />
      );
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
