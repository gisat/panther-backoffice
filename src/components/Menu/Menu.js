import React, { PropTypes, Component } from 'react';
import styles from './Menu.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';


@withStyles(styles)
class Menu extends Component {

  static propTypes = {
    className: PropTypes.string,
  };


  //  className="current"
  render() {
    return (
      <nav id="menu" className={this.props.className} >
        <ul>
          <li>
            <a href="./" onClick={Link.handleClick} tabIndex="1">
              <img src={require('./temp-dashboard.svg')} className="svg" />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="./places" onClick={Link.handleClick} tabIndex="1">
              <img src={require('./temp-places.svg')} className="svg"/>
              <span>Places</span>
            </a>
          </li>
          <li>
            <a href="./datalayers" onClick={Link.handleClick} tabIndex="1">
              <img src={require('./temp-datalayers.svg')} className="svg" />
              <span>Data layers</span>
            </a>
          </li>
          <li>
            <a href="./analyses" onClick={Link.handleClick} tabIndex="1">
              <img src={require('./temp-analyses.svg')} className="svg" />
              <span>Analyses</span>
            </a>
          </li>
          <li>
            <a href="./metadata" onClick={Link.handleClick} tabIndex="1">
              <img src={require('./temp-metadata.svg')} className="svg" />
              <span>Metadata structures</span>
            </a>
          </li>

          <li>
            <a href="./privacy" onClick={Link.handleClick} tabIndex="1">
              <img src={require('./temp-metadata.svg')} className="svg" />
              <span>Privacy (static test)</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }

  componentDidMount() {

    $("#menu").focusin(function() {
      $(this).addClass("open");
    });
    $("#menu").focusout(function() {
      $(this).removeClass("open");
    });
  }

}




export default Menu;
