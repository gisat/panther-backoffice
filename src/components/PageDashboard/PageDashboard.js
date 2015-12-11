import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageDashboard.css';
import classNames from 'classnames';
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
      key: "dashboard",
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
    const title = 'Dashboard';
    this.context.onSetTitle(title);

    var screenNodes = this.state.screens.map(function (screen) {
      return (
        <ScreenContainer
          key={screen.key}
          screenState={screen}
          onClose={this.context.setScreenPosition.bind(this, screen.key, "closed")}
          onRetract={this.context.setScreenPosition.bind(this, screen.key, "retracted")}
          onOpen={this.context.setScreenPosition.bind(this, screen.key, "open")}
        />
      );
    }.bind(this));


    return (
      <div id="content">
        <div className={classNames("content", {"has-maximised": this.state.hasMaximised})}>
          {screenNodes}
        </div>
      </div>
    );
  }

}

export default PageDashboard;
