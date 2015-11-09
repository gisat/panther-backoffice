/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './ContactPage.css';
import withStyles from '../../decorators/withStyles';

import { Segment, Button, Input, Header, IconButton, Icon, PopupButton } from '../SEUI/elements';
import { Popup, Modal } from '../SEUI/modules';
import { Form, Fields, Field, Table } from '../SEUI/collections';

import LinkTableByScopePlace from '../LinkTableByScopePlace/LinkTableByScopePlace';

@withStyles(styles)
class ContactPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

	constructor(props) {
		super(props);

		this.state = {
			show: false
		};
	}
	
	onMouseEnterX() {
		this.setState({
				show: true
		});
  }

	onMouseLeaveX() {
		this.setState({
				show: false
		});
	}



  render() {
    const title = 'Contact Us';
    this.context.onSetTitle(title);
   return (
      <div className="ContactPage">
        <div className="ContactPage-container">
					<Header dividing tag="h1" key="popokatepetl">
						Header
					</Header>
					<IconButton 
						name="heart"
						onMouseEnter={this.onMouseEnterX.bind(this)}
            onMouseLeave={this.onMouseLeaveX.bind(this)}
					>
						It's alive!
						<Popup active={this.state.show}>Very much so.</Popup>
					</IconButton>
					<Button 
						
					>
						<Icon name="idea"/>
						I know!
						<Popup>I am clever like that.</Popup>
					</Button>
					
					
					
					<LinkTableByScopePlace/>
					
					
					
				
        </div>
      </div>
    );
  }

}

export default ContactPage;
