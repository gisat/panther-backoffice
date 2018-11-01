import React, { PropTypes, Component } from 'react'; 
import PantherComponent from '../../common/PantherComponent';
import styles from './DataLayersMetadataPreview.css';
import withStyles from '../../../decorators/withStyles';
import _ from 'underscore';
import Select from 'react-select';


import utils from '../../../utils/utils';


import logger from '../../../core/Logger';

@withStyles(styles)
class DataLayersMetadataPreview extends PantherComponent{

	static propTypes = {
		disabled: React.PropTypes.bool,
	};

	static defaultProps = {
		disabled: false
	};

	render() {

		

		return (
			<div className="ptr-datalayers-metadata-preview">

			

			</div>
		);

	}
}

export default DataLayersMetadataPreview;
