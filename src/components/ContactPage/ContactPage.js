/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './ContactPage.css';
import withStyles from '../../decorators/withStyles';

import { Segment, Button, Input, Header, IconButton } from '../SEUI/elements';
import { Popup, Modal } from '../SEUI/modules';
import { Form, Fields, Field } from '../SEUI/collections';

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
	
	onMouseEnter() {
		this.setState({
				show: true
		});
  }

	onMouseLeave() {
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
          <h1>{title}</h1>
          <p>...</p>
					<Header dividing tag="h1" key="popokatepetl">
						Header
					</Header>
					<IconButton 
						name="heart"
						onMouseEnter={this.onMouseEnter.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
					>
						It's alive!
						<Popup active={this.state.show}>Very much so.</Popup>
					</IconButton>
					<IconButton 
						name="idea"
						onMouseEnter={this.onMouseEnter.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
					>
						I know!
						<Popup active={this.state.show}>I am clever like that.</Popup>
					</IconButton>
        </div>
      </div>
    );
  }

}

export default ContactPage;
