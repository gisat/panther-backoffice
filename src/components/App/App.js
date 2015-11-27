
import React, { PropTypes, Component } from 'react';
import styles from './App.css';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';

import Menu from '../Menu';


@withContext
@withStyles(styles)
class App extends Component {


  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  render() {
    return !this.props.error ? (
      <div>
        <Menu />
        {this.props.children}
      </div>
    ) : this.props.children;
  }

}



export default App;
