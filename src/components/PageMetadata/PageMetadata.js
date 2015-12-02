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
    closeScreen: PropTypes.func.isRequired
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
          classes: "open constant const40",
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
        <ScreenContainer key={screen.key} component={screen.component} classes={screen.classes} close={me.context.closeScreen.bind(me, screen.key)} />
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
