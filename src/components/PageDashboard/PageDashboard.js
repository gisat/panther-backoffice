import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageDashboard.css';

import Page from '../Page';
import ScreenContainer from '../ScreenContainer';
import ScreenDashboardBase from '../ScreenDashboardBase';

@withStyles(styles)
class PageDashboard extends Page {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    console.log("PageDashboard constructoir");

    this.state = {
      show: false,
      screens: [
        {
          key: "screen1",
          classes: "open",
          component: <ScreenDashboardBase/>
        }
      ]
    };
  }


  render() {

    this.testung();
    //this.testung("5448");

    const title = 'Dashboard';
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

export default PageDashboard;
