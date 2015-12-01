import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageDashboard.css';

import ScreenContainer from '../ScreenContainer';
import ScreenDashboardBase from '../ScreenDashboardBase';

import ScreenManager from '../ScreenManager';

@withStyles(styles)
class PageDashboard extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    closeScreen: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    console.log("PageDashboard constructoir");

    var sm = (<ScreenManager />);
    console.log(sm);
    //sm.closeScreen(this, 'x');

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

    //this.testung();
    //this.testung("5448");

    const title = 'Dashboard';
    this.context.onSetTitle(title);

    var me = this;
    var screenNodes = this.state.screens.map(function (screen) {
      return (
        <ScreenContainer key={screen.key} component={screen.component} classes={screen.classes} close={me.context.closeScreen.bind(me, screen.key)} />
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
