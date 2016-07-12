import React, { PropTypes } from 'react';
import styles from './App.css';
import PantherComponent from '../common/PantherComponent';
import OperationStore from '../../stores/OperationStore';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';
import logger from '../../core/Logger';
import Menu from '../Menu';
import Page from '../Page';


@withContext
@withStyles(styles)
class App extends PantherComponent {


	static propTypes = {
		children: PropTypes.element.isRequired,
		error: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {
			scope: null,
			loading: 0
		};
	}

	componentDidMount(){
		super.componentDidMount();
		this.changeListener.add(OperationStore);
	}

	_onStoreChange() {
		logger.trace("ReallyNotOperationStore# _onStoreChange()");
		let operations = OperationStore.getAll();
		let count = Object.keys(operations).length;
		this.setState({
			loading: count
		});
	}

	render() {
		let ret = "";

		let loadingOverlay = null;
		if(this.state.loading){
			loadingOverlay = (
				<div id="loading-overlay"></div>
			);
		}

		if(this.props.children.type===Page) {
			let activeScreenSetKey = this.props.children.props.screenSet;
			let page = React.Children.only(this.props.children);

			ret = (
				<div>
					{loadingOverlay}
					<Menu
						activeScreenSet={activeScreenSetKey}
						scope={this.state.scope || null}
					/>
					{React.cloneElement(page, {
						scope: this.state.scope || null,
						disabled: !!this.state.loading
					})}
				</div>
			);
		} else {
			ret = (
				<div>
					{loadingOverlay}
					{this.props.children}
				</div>
			);
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
