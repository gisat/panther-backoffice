
import React, { PropTypes, Component } from 'react';
import styles from './App.css';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';

import Menu from '../Menu';
import Page from '../Page';


@withContext
@withStyles(styles)
class App extends Component {


	static propTypes = {
		children: PropTypes.element.isRequired,
		error: PropTypes.object
	};

	render() {
		let ret = "";
		if(this.props.children.type===Page) {
			let activeScreenSetKey = this.props.children.props.screenSet;
			ret = (
				<div>
					<Menu
						activeScreenSet={activeScreenSetKey}
					/>
					{this.props.children}
				</div>
			);
		} else {
			ret = this.props.children;
		}
		return ret;
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
