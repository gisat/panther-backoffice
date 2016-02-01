import React, { PropTypes, Component } from 'react';
import TestC from '../TestC';
import FabulousNewScreen from '../FabulousNewScreen';

class Dashboard extends Component{

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		onSetScreenData: PropTypes.func.isRequired,
		openScreen: PropTypes.func.isRequired
	};

	onAnchorClick() {
		console.log("clickity");
		this.context.openScreen("FabulousNewScreenNo1",<FabulousNewScreen/>,"dashboard",{size:40},{message:"Hello this is Dashobard"});
	}

	render() {

		var prvni = (
			<TestC colour="#d48e5e" text="první komponenta" key="1" />
		);

		var druha = (
			<TestC colour="#5658fd" text="druhá" key="2" />
		);

		var treti = (
			<TestC colour="#e7f9ce" text="a ještě třetí" key="3" />
		);

		return (
			<div>
				<p>Working on it. Please look at other pages on the left side.</p>
				{/*[
					prvni,
					druha,
					treti
				]*/}
				<a
					href="#"
					onClick={this.onAnchorClick.bind(this)}
				>
					CLICK ME
				</a>
			</div>
		);

	}
}

export default Dashboard;
