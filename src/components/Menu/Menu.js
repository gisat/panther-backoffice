import React, { Component } from 'react';
import styles from './Menu.css';
import withStyles from '../../decorators/withStyles';



var Menu = React.createClass({
  render: function() {
    return (
      <nav id="menu" >
        <ul>
          <li><a href="#" tabIndex="1">
            <img src="img/temp-dashboard.svg" className="svg" />
            <span>Dashboard</span></a></li>
          <li><a href="#" tabIndex="1" className="current">
            <img src="img/temp-places.svg" className="svg"/>
            <span>Places</span></a></li>
          <li><a href="#" tabIndex="1">
            <img src="img/temp-datalayers.svg" className="svg" />
            <span>Data layers</span></a></li>
          <li><a href="#" tabIndex="1">
            <img src="img/temp-analyses.svg" className="svg" />
            <span>Analyses</span></a></li>
          <li><a href="#" tabIndex="1">
            <img src="img/temp-metadata.svg" className="svg" />
            <span>Metadata structures</span></a></li>
        </ul>
      </nav>
    );
  },

  componentDidMount: function() {

    $("#menu").focusin(function() {
      $(this).addClass("open");
    });
    $("#menu").focusout(function() {
      $(this).removeClass("open");
    });
  }
});




export default Menu;
