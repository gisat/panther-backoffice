import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageAnalyses.css';

import Page from '../Page';
import ScreenContainer from '../ScreenContainer';
import ScreenAnalysesBase from '../ScreenAnalysesBase';
import ScreenAnalysisSpatial from '../ScreenAnalysisSpatial';


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
          component: <ScreenAnalysesBase/>
        },
        {
          key: "screen2",
          classes: "retracted constant const40",
          component: <ScreenAnalysisSpatial/>
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
