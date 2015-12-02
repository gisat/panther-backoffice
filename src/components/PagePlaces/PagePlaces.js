import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PagePlaces.css';

import ScreenContainer from '../ScreenContainer';
import ScreenPlacesBase from '../ScreenPlacesBase';
import ScreenLinksByAttSetAULevel from '../ScreenLinksByAttSetAULevel';

@withStyles(styles)
class PagePlaces extends Component {


  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    setScreenPosition: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      show: false,
      screens: [
        {
          key: "screenPlacesBase",
          component: <ScreenPlacesBase />
        },
        {
          key: "screenLinksByAttSetAULevel",
          type: "constant",
          size: 40,
          component: <ScreenLinksByAttSetAULevel />
        }
      ]
    };
  }


  render() {
    const title = 'Place management';
    this.context.onSetTitle(title);

    var me = this;
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

export default PagePlaces;
