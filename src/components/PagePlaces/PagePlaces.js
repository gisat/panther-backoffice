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
          classes: "retracted limited lim40",
          component: <ScreenLinksByAttSetAULevel />
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

export default PagePlaces;
