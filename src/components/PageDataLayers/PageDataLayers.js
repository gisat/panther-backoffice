import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageDataLayers.css';

import ScreenContainer from '../ScreenContainer';
import ScreenDataLayersBase from '../ScreenDataLayersBase';

@withStyles(styles)
class PageDataLayers extends Component {


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
          key: "screen1",
          classes: "open",
          component: <ScreenDataLayersBase/>
        }
      ]
    };
  }


  render() {
    const title = 'Data layer management';
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

export default PageDataLayers;
