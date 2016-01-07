import React, { PropTypes, Component } from 'react';
import styles from './MetadataListLayerVector.css';
import withStyles from '../../../decorators/withStyles';

import { Icon, IconButton, Buttons } from '../../SEUI/elements';
import { CheckboxFields, Checkbox } from '../../SEUI/modules';
import { Table } from '../../SEUI/collections';
import _ from 'underscore';

const LAYERTEMPLATES = [
			{ key: 1, name: 'Road network' },
			{ key: 2, name: 'Hospitals' },
			{ key: 3, name: 'Land cover' },
			{ key: 4, name: 'Land cover change' },
			{ key: 5, name: 'Possible low-income settlements (areals)' },
			{ key: 7, name: 'Possible low-income settlements (mid-points)' }
		];


@withStyles(styles)
class MetadataListLayerVector extends Component{

	constructor(props) {
		super(props);

		this.state = {
			itemType: "layerVector",
			selectedTemplate: null
		};

	}



	onSelectTemplate (value) {
		this.state.selectedTemplate = value;
	}

	openScreenExample(itemType,itemKey) {
		if(itemKey) {
			this.state.selectedTemplate = itemKey;
		} else {
			this.state.selectedTemplate = null;
		}
	}


	componentDidMount() {



	}

	render() {

		var thisComponent = this;

		var itemsInsert = LAYERTEMPLATES.map(function (item) {
			return (
				<a
					className={thisComponent.state.selectedTemplate==item.key ? 'puma-item template screen-opener' : 'puma-item template'}
					href="#"
					onClick={thisComponent.openScreenExample.bind(
							thisComponent,
							thisComponent.state.itemType,
							item.key
						)}
					key={"vectorlayertemplate-" + item.key}
				>
					<span>{item.name}</span>
				</a>
			);
		});

		return (
			<div>



				<a
					className="puma-item add"
					href="#"
					onClick={thisComponent.openScreenExample.bind(
							thisComponent,
							thisComponent.state.itemType,
							null
						)}
				>
					<span><Icon name="plus"/></span>
				</a>

				{itemsInsert}

			</div>
		);

	}
}

export default MetadataListLayerVector;
