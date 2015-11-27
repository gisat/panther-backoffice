import React, { PropTypes, Component } from 'react';
import styles from './Menu.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import UISVG from '../UISVG';


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
              <UISVG src='icon-dashboard.isvg' />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="./places" onClick={Link.handleClick} tabIndex="1">
							<UISVG src='icon-places.isvg' />
              <span>Places</span>
            </a>
          </li>
          <li>
            <a href="./datalayers" onClick={Link.handleClick} tabIndex="1">
							<UISVG src='icon-datalayers.isvg' />
              <span>Data layers</span>
            </a>
          </li>
          <li>
            <a href="./analyses" onClick={Link.handleClick} tabIndex="1">
							<UISVG src='icon-analyses.isvg' />
              <span>Analyses</span>
            </a>
          </li>
          <li>
            <a href="./metadata" onClick={Link.handleClick} tabIndex="1">
							<UISVG src='icon-metadata.isvg' />
              <span>Metadata structures</span>
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
