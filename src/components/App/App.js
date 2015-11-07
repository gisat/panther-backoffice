import React, { PropTypes, Component } from 'react';
import styles from './App.css';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';


@withContext
@withStyles(styles)
class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  render() {
    return !this.props.error ? (
      //{this.props.children}
      <div>
        <Menu/>
        <Content vtabs={this.state.vtabs}/>
      </div>
    ) : this.props.children;
  }

}



export default App;
