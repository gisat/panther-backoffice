import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PagePlaces.css';
import classNames from 'classnames';

import ScreenContainer from '../ScreenContainer';
import ScreenPlacesBase from '../ScreenPlacesBase';
import ScreenLinksByAttSetAULevel from '../ScreenLinksByAttSetAULevel';

@withStyles(styles)
class PagePlaces extends Component {


  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    activePageKey: PropTypes.func.isRequired,
    setScreenPosition: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      key: "places",
      screens: [
        {
          key: "screenPlacesBase",
          component: <ScreenPlacesBase />
        },
        {
          key: "screenLinksByAttSetAULevel",
          //type: "constant",
          size: 40,
          position: "retracted",
          component: <ScreenLinksByAttSetAULevel />
        }
      ]
    };
  }


  render() {
    const title = 'Place management';
    this.context.onSetTitle(title);
    this.context.activePageKey(this.state.key);

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

export default PagePlaces;
