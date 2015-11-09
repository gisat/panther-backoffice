
import React, { PropTypes, Component } from 'react';
import styles from './App.css';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';

import Menu from '../Menu';


@withContext
@withStyles(styles)
class App extends Component {


  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  render() {
    return !this.props.error ? (
      <div>
        <Menu />
        {this.props.children}
      </div>
    ) : this.props.children;
  }


  componentDidMount() {

    $(".screen").click(function() {
      if ( $(this).hasClass("retracted") ) {
        if ( !$(this).hasClass("limited") ) {
          /* todo check if there is enough space */
          $(this).siblings(".screen.open").removeClass("open").addClass("retracted");
        }
        $(this).removeClass("retracted").addClass("opening").delay(300).queue(function(){
          $(this).removeClass("opening").addClass("open").dequeue();
        });
        /* todo tabindex behaviour? input disabling? anchors? */
        $(this).siblings(".screen.retracted").find(":input").prop("disabled", true);
        $(this).siblings(".screen.retracted").find("a").prop("tabindex", "-1");
        /* disable inputs or tabindex=-1 only? */
        /* todo enabling */
      }
    });


    $('img.svg').each(function(){
      var $img = $(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      $.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = $(data).find('svg');
        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass+' replaced-svg');
        }
        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');
        // Replace image with new SVG
        $img.replaceWith($svg);
      });
    });


  }

}



export default App;
