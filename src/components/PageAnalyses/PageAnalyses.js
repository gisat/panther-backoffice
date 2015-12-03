import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageAnalyses.css';
import _ from 'underscore';

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
          disabled: false,
          component: <ScreenAnalysesBase/>
        },
        {
          key: "analyses2",
          type: "constant",
          size: 40,
          position: "retracted",
          disabled: true,
          component: <ScreenAnalysisSpatial/>
        },
        {
          key: "analyses3",
          type: "too wide", // too should not actually be set initially
          size: 80,
          position: "retracted",
          component: <ScreenAnalysisSpatialRules/>
        }
      ]
    };
  }


  render() {
    const title = 'Analyses';
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

    //this.context.setScreenPosition.bind(this)();

    return (
      <div id="content">
        <div className="content">
          {screenNodes}
        </div>
      </div>
    );
  }

}

export default PageAnalyses;
