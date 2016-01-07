import React, { PropTypes, Component } from 'react';
import styles from './ScreenPlacesBase.css';
import withStyles from '../../../decorators/withStyles';

import UIScreenButton from '../../atoms/UIScreenButton';

import LinkTableByScopePlace from '../../elements/LinkTableByScopePlace';
import LinkTableVectorByScopePlace from '../../elements/LinkTableVectorByScopePlace';
import LinkTableRasterByScopePlace from '../../elements/LinkTableRasterByScopePlace';
import SelectorPlace from '../../sections/SelectorPlace';


@withStyles(styles)
class ScreenPlacesBase extends Component{

	constructor(props) {
		super(props);

		this.state = {
			activeScreenOpener: null
		};

	}

	openScreenScopeExample(openerKey,scopeKey,e) {
		this.setState({
			activeScreenOpener: openerKey
		});
	}

	render() {

		var isParentScreenDisabled = "NA";
		if(this.props.disabled){
			isParentScreenDisabled = "disabled"
		}
		else {
			isParentScreenDisabled = "enabled"
		}

		return (
			<div>
				<div className="screen-setter"><div>
					<SelectorPlace/>
				</div></div>
				<div className="screen-content"><div>
					<h1 className="fit-after">Ho Chi Minh City</h1>
					<div className="heading-sub">
						Scope:&nbsp;
						<UIScreenButton
							onClick={this.openScreenScopeExample.bind(this,1,1)}
							className={this.state.activeScreenOpener==1 ? 'screen-opener' : ''}
						>
							Local
						</UIScreenButton>
					</div>
			{/* <p>disable pass test: <b>{isParentScreenDisabled}</b></p> */}
					<h2>Attribute sets</h2>
					<LinkTableByScopePlace/>

					<h2>Vector layers</h2>
					<LinkTableVectorByScopePlace/>

					<h2>Raster layers</h2>
					<LinkTableRasterByScopePlace/>

				</div></div>
			</div>
		);

	}
}

export default ScreenPlacesBase;
