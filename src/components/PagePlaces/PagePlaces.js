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
          classes: "open",
          component: <ScreenPlacesBase />
        },
        {
          key: "screenLinksByAttSetAULevel",
          classes: "open constant const40",
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
          component={screen.component}
          classes={screen.classes}
          close={me.context.setScreenPosition.bind(me, screen.key, "closed")}
          retract={me.context.setScreenPosition.bind(me, screen.key, "retracted")}
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
