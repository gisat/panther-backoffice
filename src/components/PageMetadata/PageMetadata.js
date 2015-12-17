import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageMetadata.css';
import classNames from 'classnames';

import ScreenContainer from '../ScreenContainer';
import ScreenMetadataBase from '../ScreenMetadataBase';
import ScreenMetadataLayerVector from '../ScreenMetadataLayerVector';

@withStyles(styles)
class PageMetadata extends Component {


  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    activePageKey: PropTypes.func.isRequired,
    setScreenPosition: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      key: "metadata",
      screens: [
        {
          key: "screen1",
          component: <ScreenMetadataBase/>
        },
				{
          key: "screen2",
          //type: "constant",
          size: 40,
          //position: "retracted",
          component: <ScreenMetadataLayerVector/>
        }
      ]
    };
  }


  render() {
    const title = 'Metadata structures';
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

export default PageMetadata;
