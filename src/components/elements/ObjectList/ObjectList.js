import React, { PropTypes, Component } from 'react';
import styles from './ObjectList.css';
import withStyles from '../../../decorators/withStyles';

import { Icon, IconButton, Buttons } from '../../SEUI/elements';
import _ from 'underscore';
import classnames from 'classnames';


@withStyles(styles)
class ObjectList extends Component {

	static propTypes = {
		data: React.PropTypes.array.isRequired,		// array with items to list. Expects item keys "key","name", optionally "id"
		onItemClick: React.PropTypes.func,				// function to call on list item click. Sends item object in argument
		onAddClick: React.PropTypes.func,					// function to call on add item click.
		itemClasses: React.PropTypes.string,			// css classes for items
		selectedItemKey: React.PropTypes.any			// selected item key
	};

	static defaultProps = {
		onItemClick: undefined,
		onAddClick: undefined,
		itemClasses: "",
		selectedItemKey: null
	};

	constructor(props) {
		super(props);

		this.state = {
			selectedItem: this.props.selectedItemKey
		};

	}

	componentWillReceiveProps(newProps) {
		if (newProps.selectedItemKey != this.state.selectedItem) {
			this.setState({
				selectedItem: this.props.selectedItemKey
			});
		}
	}


	handleItemClick  (key, event) {
		if (this.props.onItemClick) {
			event.stopPropagation();
			event.preventDefault();
			var item = _.findWhere(this.props.data, {key: key});
			this.props.onItemClick(item, event);
		}
		this.setState({
			selectedItem: key
		});
	}

	handleAddClick  (event) {
		if (this.props.onAddClick) {
			event.stopPropagation();
			event.preventDefault();
			this.props.onAddClick(event);
		}
		this.setState({
			selectedItem: null
		});
	}


	render() {

		var thisComponent = this;

		var itemsInsert = this.props.data.map(function (item) {
			var className = classnames(
				'puma-item',
				thisComponent.props.itemClasses,
				{	'screen-opener' : thisComponent.state.selectedItem==item.key }
			);
			return (
				<a
					className={className}
					href="#"
					onClick={thisComponent.handleItemClick.bind(thisComponent,item.key)}
					key={item.key}
				>
					<span className="item-id">{item.key}</span>
					<span>{item.name}</span>
				</a>
			);
		});

		return (
			<div>

				<a
					className="puma-item add"
					href="#"
					onClick={this.handleAddClick.bind(thisComponent)}
					key="objectList-add"
				>
					<span><Icon name="plus"/></span>
				</a>

				{itemsInsert}

			</div>
		);

	}
}

export default ObjectList;
