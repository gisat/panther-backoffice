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
    activePageKey: PropTypes.func.isRequired,
    setScreenPosition: PropTypes.func.isRequired,
    setScreenData: PropTypes.func.isRequired
  };

  static childContextTypes = {
    onSetScreenData: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      key: "analysis",
      screens: [
        {
          key: "analyses1",
          component: <ScreenAnalysesBase/>,
          data: {
            x: 7
          }
        },
        {
          key: "analyses2",
          //type: "constant",
          size: 40,
          position: "retracted",
          component: <ScreenAnalysisSpatial/>,
          data: {
            neco: 42,
            necojineho: 100
          }
        },
        {
          key: "analyses3",
          contentAlign: "fill",
          //size: 80,
          position: "retracted",
          component: <ScreenAnalysisSpatialRules/>,
          data: {
            rule_id: 47,
            title: "pumpa"
          }
        }
      ]
    };
  }

  getChildContext(){
    return {
      onSetScreenData: this.context.setScreenData.bind(this)
    };
  }

  render() {
    const title = 'Analyses';
    this.context.onSetTitle(title);
    this.context.activePageKey(this.state.key);

    var screenNodes = this.state.screens.map(function(screen) {
      return (
        <ScreenContainer
          ref={screen.key}
          key={screen.key}
          screenState={screen}
          onClose={this.context.setScreenPosition.bind(this, screen.key, "closed")}
          onRetract={this.context.setScreenPosition.bind(this, screen.key, "retracted")}
          onOpen={this.context.setScreenPosition.bind(this, screen.key, "open")}
          onSetScreenData={this.context.setScreenData.bind(this)}
          refs={this.refs}
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

  componentDidMount(){
    console.log("screenState: ", this.props.screenState);
    //this.context.setScreenData.bind(this)("analyses2", {zkouska: "jo", necojineho: "neco uplne jineho"});
  }

}

export default PageAnalyses;
