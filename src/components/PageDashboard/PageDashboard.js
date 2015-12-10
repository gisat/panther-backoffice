import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageDashboard.css';
import ga from 'react-ga';

import ScreenContainer from '../ScreenContainer';
import ScreenDashboardBase from '../ScreenDashboardBase';


@withStyles(styles)
class PageDashboard extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    setScreenPosition: PropTypes.func.isRequired,
    screenStack: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      screens: [
        {
          key: "screen1",
          component: <ScreenDashboardBase/>
        }
      ]
    };
		
		ga.pageview('/');
  }


  render() {

    //this.testung();
    //this.testung("5448");

    const title = 'Dashboard';
    this.context.onSetTitle(title);

    var me = this;
    console.log("PageDashboard constructoir  context: ", this.context);

    var screenNodes = this.state.screens.map(function (screen) {
      return (
        <ScreenContainer
          key={screen.key}
          screenState={screen}
          onClose={me.context.setScreenPosition.bind(me, screen.key, "closed")}
          onRetract={me.context.setScreenPosition.bind(me, screen.key, "retracted")}
          onOpen={me.context.setScreenPosition.bind(me, screen.key, "open")}
        />
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
