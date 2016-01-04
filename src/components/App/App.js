
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

	//closeScreen(page, screenKey) {
	//  var newScreens = JSON.parse(JSON.stringify(page.state.screens));
	//  newScreens.map(function(obj){
	//    //var newObj = obj;
	//    if(obj.key == screenKey){
	//      obj.classes = "closed";
	//    }
	//    //return obj;
	//  });
	//  console.log("### state.screens: ", page.state.screens, "newScreens: ", newScreens);
	//
	//  page.setState({
	//    screens: newScreens
	//  });
	//}

}



export default App;
