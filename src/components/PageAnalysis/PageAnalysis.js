import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './PageAnalysis.css';

//import { Segment, Button, Input, Header, IconButton } from '../SEUI/elements';
//import { Popup, Modal } from '../SEUI/modules';
//import { Form, Fields, Field } from '../SEUI/collections';

import ScreenContainer from '../ScreenContainer';
import TestPlaceScreen from '../TestPlaceScreen';
import TestScreen from '../TestScreen';

@withStyles(styles)
class PageAnalysis extends Component {

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
          component: <TestPlaceScreen/>
        },
        {
          key: "screen2",
          classes: "retracted",
          component: <TestScreen/>
        }
      ]
    };
  }

  onMouseEnter() {
    this.setState({
      show: true
    });
  }

  onMouseLeave() {
    this.setState({
      show: false
    });
  }

  render() {
    const title = 'Analyses';
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


      //<div className="ContactPage">
      //  <div className="ContactPage-container">
      //    <h1>{title}</h1>
      //    <p>...</p>
      //    <Header dividing tag="h1" key="popokatepetl">
      //      Header
      //    </Header>
      //    <IconButton
      //      name="heart"
      //      onMouseEnter={this.onMouseEnter.bind(this)}
      //      onMouseLeave={this.onMouseLeave.bind(this)}
      //    >
      //      It's alive!
      //      <Popup active={this.state.show}>Very much so.</Popup>
      //    </IconButton>
      //    <IconButton
      //      name="idea"
      //      onMouseEnter={this.onMouseEnter.bind(this)}
      //      onMouseLeave={this.onMouseLeave.bind(this)}
      //    >
      //      I know!
      //      <Popup active={this.state.show}>I am clever like that.</Popup>
      //    </IconButton>
      //  </div>
      //</div>

    );
  }

}

export default PageAnalysis;
