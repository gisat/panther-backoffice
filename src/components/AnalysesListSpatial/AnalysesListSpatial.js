import React, { PropTypes, Component } from 'react';
import styles from './AnalysesListSpatial.css';
import withStyles from '../../decorators/withStyles';

import { Icon, IconButton, Buttons } from '../SEUI/elements';
import { CheckboxFields, Checkbox } from '../SEUI/modules';
import { Table } from '../SEUI/collections';
import _ from 'underscore';

const ANALYSES = [
			{ key: 1, name: 'Land cover status' },
			{ key: 2, name: 'Land cover status aggregated' },
			{ key: 3, name: 'Land cover change' },
			{ key: 4, name: 'Land cover formation' },
			{ key: 5, name: 'Land cover consumption' },
			{ key: 7, name: 'Road type' },
			{ key: 8, name: 'Road length' }
		];


@withStyles(styles)
class AnalysesListSpatial extends Component{
	
	constructor(props) {
		super(props);

		this.state = {
			itemType: "analysisSpatial",
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
		
		var itemsInsert = ANALYSES.map(function (item) {
      return (
				<a 
					className={thisComponent.state.selectedTemplate==item.key ? 'puma-item template selected' : 'puma-item template'}
					href="#"
					onClick={thisComponent.openScreenExample.bind(
							thisComponent,
							thisComponent.state.itemType,
							item.key
						)}
          key={"spatialanalysis-" + item.key}
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

export default AnalysesListSpatial;
