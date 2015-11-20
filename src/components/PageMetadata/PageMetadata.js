import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageMetadata.css';

import Page from '../Page';
import ScreenContainer from '../ScreenContainer';
import ScreenMetadataBase from '../ScreenMetadataBase';

@withStyles(styles)
class PageMetadata extends Page {


  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      show: false,
      screens: [
        {
          key: "screen1",
          classes: "open",
          component: <ScreenMetadataBase/>
        }
      ]
    };
  }


  render() {
    const title = 'Metadata structures';
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

export default PageMetadata;
