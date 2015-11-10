import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageMetadata.css';

import ScreenContainer from '../ScreenContainer';
import ScreenMetadataBase from '../ScreenMetadataBase';

@withStyles(styles)
class PageMetadata extends Component {


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
        },
        {
          key: "screen2",
          classes: "retracted",
          component: "<button>Nemačkej mě</button>"
        }
      ]
    };
  }


  render() {
    const title = 'Dashboard';
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
