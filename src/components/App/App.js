import React, { PropTypes } from 'react';
import styles from './App.css';
import PantherComponent from '../common/PantherComponent';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';

import config from '../../config';
import logger from '../../core/Logger';
import ListenerHandler from '../../core/ListenerHandler';
import Location from '../../core/Location';

import OperationStore from '../../stores/OperationStore';
import UserStore from '../../stores/UserStore';

import Navigation from '../Navigation';
import Page from '../Page';

import Loader from '../atoms/Loader';


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
		this.logoutListener = new ListenerHandler(this, this._onLogout, 'addLogoutListener', 'removeLogoutListener');
	}

	componentDidMount(){
		super.componentDidMount();
		this.changeListener.add(OperationStore);
		this.logoutListener.add(UserStore);
	}

	_onStoreChange() {
		logger.trace("ReallyNotOperationStore# _onStoreChange()");
		let operations = OperationStore.getAll();
		let count = Object.keys(operations).length;
		this.setState({
			loading: count
		});
	}

	_onLogout() {
		let url = '';
		if (config.publicPath) {
			let cleanPublicPath = config.publicPath.replace(/^\/*(.*?)\/*$/, "$1");
			if (cleanPublicPath) {
				url = "/" + cleanPublicPath;
			}
		}
		Location.replaceState(null, url);
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		this.logoutListener.clean();
	}


	render() {
		let ret = "";

		let loadingOverlay = (
			<div id="loading-overlay">
				<Loader />
			</div>
		);
		if(this.state.loading){
			loadingOverlay = (
				<div id="loading-overlay" className="active">
					<Loader />
				</div>
			);
		}

		if(this.props.children.type===Page) {
			let activeScreenSetKey = this.props.children.props.screenSet;
			let page = React.Children.only(this.props.children);

			ret = (
				<div>
					{loadingOverlay}
					<Navigation
						activeScreenSet={activeScreenSetKey}
						scope={this.state.scope || null}
						currentUser={this.props.currentUser}
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
