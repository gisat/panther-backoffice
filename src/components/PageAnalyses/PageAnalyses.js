import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageAnalyses.css';
import _ from 'underscore';
import classNames from 'classnames';

import ScreenContainer from '../ScreenContainer';
import ScreenAnalysesBase from '../ScreenAnalysesBase';
import ScreenAnalysisSpatial from '../ScreenAnalysisSpatial';
import ScreenAnalysisSpatialRules from '../ScreenAnalysisSpatialRules';


@withStyles(styles)
class PageAnalyses extends Component {


	static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    setScreenPosition: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      key: "analysis",
      screens: [
        {
          key: "analyses1",
          component: <ScreenAnalysesBase/>
        },
        {
          key: "analyses2",
          //type: "constant",
          size: 40,
          position: "retracted",
          component: <ScreenAnalysisSpatial/>
        },
        {
          key: "analyses3",
          contentAlign: "fill",
          //size: 80,
          position: "retracted",
          component: <ScreenAnalysisSpatialRules/>
        }
      ]
    };
  }


  render() {
    const title = 'Analyses';
    this.context.onSetTitle(title);

    var screenNodes = this.state.screens.map(function(screen) {
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

export default PageAnalyses;
