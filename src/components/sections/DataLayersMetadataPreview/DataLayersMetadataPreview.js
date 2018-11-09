import React, { PropTypes, Component } from 'react'; 
import PantherComponent from '../../common/PantherComponent';
import styles from './DataLayersMetadataPreview.css';
import withStyles from '../../../decorators/withStyles';
import _ from 'underscore';
import Select from 'react-select';


import utils from '../../../utils/utils';


import logger from '../../../core/Logger';
import ActionCreator from "../../../actions/ActionCreator";
import ScreenDataLayersMetadata from "../../screens/ScreenDataLayersMetadata";
import {Icon} from "../../SEUI/elements";
import UIScreenButton from "../../atoms/UIScreenButton";

@withStyles(styles)
class DataLayersMetadataPreview extends PantherComponent{
	
	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	static propTypes = {
		disabled: React.PropTypes.bool,
	};

	static defaultProps = {
		disabled: false
	};
	
	constructor(props) {
		super(props);
		
		this.onMetadataClick = this.onMetadataClick.bind(this);
	}
	
	onMetadataClick() {
		let screenName = "ScreenDataLayersBase-ScreenDataLayersMetadata";
		let options = {
			component: ScreenDataLayersMetadata,
			// parentUrl: this.props.parentUrl,
			size: 40,
			data: {
				dataLayer: this.props.dataLayer
			}
		};
		ActionCreator.createOpenScreen(screenName, this.context.screenSetKey, options);
	}

	render() {

		

		return (
			<div className="ptr-datalayers-metadata-preview">
				
				<h4>Metadata</h4>

				<div className="ptr-datalayers-metadata-preview-button">
					<UIScreenButton
						basic
						onClick={this.onMetadataClick}
					>
						<Icon name="edit" />
						Edit
					</UIScreenButton>
				</div>

			</div>
		);

	}
}

export default DataLayersMetadataPreview;
