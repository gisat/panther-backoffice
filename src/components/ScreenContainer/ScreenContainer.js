import React, { PropTypes, Component } from 'react';
import styles from './ScreenContainer.css';
import withStyles from '../../decorators/withStyles';


@withStyles(styles)
class ScreenContainer extends Component{

  //static propTypes = {
  //  classes: PropTypes.element.isRequired,
  //  key: PropTypes.object,
  //  component: PropTypes.object
  //};

  render() {
    var classes = "screen " + this.props.classes;
    return (
      <div className={classes} id={this.props.key}><div>
        {this.props.component}
      </div></div>
    );
  }

  componentDidMount() {

  }
}


export default ScreenContainer;
