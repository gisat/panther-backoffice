/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel-core/polyfill';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import Router from './routes';
import Location from './core/Location';
import { addEventListener, removeEventListener } from './utils/DOMUtils';

const screenStack = require('./stores/screenStack');

let cssContainer = document.getElementById('css');
const appContainer = document.getElementById('app');
const context = {
  onSetTitle: value => document.title = value,
  onSetMeta: (name, content) => {
    // Remove and create a new <meta /> tag in order to make it work
    // with bookmarks in Safari
    const elements = document.getElementsByTagName('meta');
    [].slice.call(elements).forEach((element) => {
      if (element.getAttribute('name') === name) {
        element.parentNode.removeChild(element);
      }
    });
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document.getElementsByTagName('head')[0].appendChild(meta);
  },
  setScreenPosition: function(screenKey, positionClass) {
    var me = this;

    // clone state screen array and get index for actual screen
    var newScreens = me.state.screens.slice(0);
    var index = -1;
    if(typeof screenKey != 'undefined') {
      newScreens.map(function (obj, i) {
        if (obj.key == screenKey) {
          index = i;
        }
      });

      // set new position class (open, retracted, closed)
      newScreens[index].position = positionClass;

      switch (positionClass) {
        case "closed":
          // when closing, delete screen from state after a while
          setTimeout(function () {
            delete newScreens[index];
            me.setState({
              screens: newScreens
            });
          }, 1000);
        case "retracted":
          // when closing or retracting, disable content of the screen
          newScreens[index].disabled = true;
          break;
        case "open":
          // when opening, enable content
          newScreens[index].disabled = false;
      }

      // apply changes of state
      me.setState({
        screens: newScreens
      });

    } /// if screen defined
    else{
      console.log("@@@@@@@@@@@@@@@@@ setScreenPosition without screenKey @@@@@@@@@@@@@@@@@");
    }

    ////// log operation to screenStack
    // create stack for the page
    screenStack[me.state.key] = screenStack[me.state.key] || [];
    // remove previous records for the same screen
    screenStack[me.state.key].map(function(record, i){
      if(record.key == screenKey) screenStack[me.state.key].splice(i, 1);
    });
    // add record for this operation
    if(positionClass == "open" || positionClass == "retracted"){
      screenStack[me.state.key].unshift({
        key: screenKey,
        position: positionClass
      });
    }

    ////// compute widths
    var menuWidth = 3.75;
    var retractedWidth = 5;
    var constPlus = 1;
    var normalWidth = 50;

    // predelat do pixelu

    var availableWidth = window.innerWidth/16 - menuWidth - screenStack[me.state.key].length * retractedWidth;
    screenStack[me.state.key].map(function(record, i){
      if(record.position == "open"){
        var screenSize = record.size || normalWidth;
        availableWidth -= (screenSize + constPlus - retractedWidth);
      }
    });

    console.log("availableWidth: ", availableWidth, "screenStack: ", screenStack);
  }
};

function switchClass(text, from, to){ // :-(
  if(typeof from == 'string') from = [from];
  to = " " + to + " ";
  var search = "((^| )(" + from.join("|") + ")($| ))";
  var re = new RegExp(search, 'g');
  return text.replace(re, to).replace(/\s\s+/g, ' ').trim();
}

function render(state) {
  Router.dispatch(state, (newState, component) => {
    ReactDOM.render(component, appContainer, () => {
      // Restore the scroll position if it was saved into the state
      if (state.scrollY !== undefined) {
        window.scrollTo(state.scrollX, state.scrollY);
      } else {
        window.scrollTo(0, 0);
      }

      // Remove the pre-rendered CSS because it's no longer used
      // after the React app is launched
      if (cssContainer) {
        cssContainer.parentNode.removeChild(cssContainer);
        cssContainer = null;
      }
    });
  });
}

function run() {
  let currentLocation = null;
  let currentState = null;

  // Make taps on links and buttons work fast on mobiles
  FastClick.attach(document.body);

  // Re-render the app when window.location changes
  const unlisten = Location.listen(location => {
    currentLocation = location;
    currentState = Object.assign({}, location.state, {
      path: location.pathname,
      query: location.query,
      state: location.state,
      context,
    });
    render(currentState);
  });

  // Save the page scroll position into the current location's state
  const supportPageOffset = window.pageXOffset !== undefined;
  const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
  const setPageOffset = () => {
    currentLocation.state = currentLocation.state || Object.create(null);
    if (supportPageOffset) {
      currentLocation.state.scrollX = window.pageXOffset;
      currentLocation.state.scrollY = window.pageYOffset;
    } else {
      currentLocation.state.scrollX = isCSS1Compat ?
        document.documentElement.scrollLeft : document.body.scrollLeft;
      currentLocation.state.scrollY = isCSS1Compat ?
        document.documentElement.scrollTop : document.body.scrollTop;
    }
  };

  addEventListener(window, 'scroll', setPageOffset);
  addEventListener(window, 'pagehide', () => {
    removeEventListener(window, 'scroll', setPageOffset);
    unlisten();
  });
}

// Run the application when both DOM is ready
// and page content is loaded
if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}
