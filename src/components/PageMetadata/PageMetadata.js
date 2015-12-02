import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageMetadata.css';

import ScreenContainer from '../ScreenContainer';
import ScreenMetadataBase from '../ScreenMetadataBase';
import ScreenMetadataLayerVector from '../ScreenMetadataLayerVector';

@withStyles(styles)
class PageMetadata extends Component {


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
          component: <ScreenMetadataBase/>
        },
				{
          key: "screen2",
          type: "constant",
          size: 40,
          component: <ScreenMetadataLayerVector/>
        }
      ]
    };
  }


  render() {
    const title = 'Metadata structures';
    this.context.onSetTitle(title);

    var me = this;
    var screenNodes = this.state.screens.map(function (screen) {
      return (
        <ScreenContainer
          key={screen.key}
          screenState={screen}
          close={me.context.setScreenPosition.bind(me, screen.key, "closed")}
          retract={me.context.setScreenPosition.bind(me, screen.key, "retracted")}
          open={me.context.setScreenPosition.bind(me, screen.key, "open")}
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

export default PageMetadata;
