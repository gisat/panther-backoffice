import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageAnalyses.css';

import Page from '../Page';
import ScreenContainer from '../ScreenContainer';
import ScreenAnalysesBase from '../ScreenAnalysesBase';
import ScreenAnalysisSpatial from '../ScreenAnalysisSpatial';
import ScreenAnalysisSpatialRules from '../ScreenAnalysisSpatialRules';


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
          key: "analyses1",
          classes: "open",
          component: <ScreenAnalysesBase/>
        },
        {
          key: "analyses2",
          classes: "retracted constant const40",
          component: <ScreenAnalysisSpatial/>
        },
        {
          key: "analyses3",
          classes: "retracted wide",
          component: <ScreenAnalysisSpatialRules/>
        }
      ]
    };
  }


  render() {
    const title = 'Analyses';
    this.context.onSetTitle(title);

    var screenNodes = this.state.screens.map(function (screen) {
      return (
        <ScreenContainer key={screen.key} component={screen.component} classes={screen.classes}/>
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
