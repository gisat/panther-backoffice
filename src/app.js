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
  setScreenPosition: function(screenKey, positionClass, options) {
    options = options || {};
    var me = this;
    // clone state screen array
    var newScreens = me.state.screens.slice(0);
    var index = -1;



    //////////////// log
    console.log("");
    console.log("### setScreenPos... k: "+screenKey+" p: "+positionClass+" o:", options);
    var log = "/ ";
    newScreens.map(function(screen){
      var posi = screen.position;
      log += screen.key + " " + posi + "(" + (screen.disabled ? "DIS":"en") + ") | ";
    });
    console.log(log);
    console.log("| screenKey:", screenKey, "| action:", positionClass);
    //////////////// log




    if(typeof screenKey != 'undefined') {

      // get index for actual screen
      newScreens.map(function (obj, i) {
        if (obj.key == screenKey) {
          index = i;
        }
      });

      /////////// set new position class (open, retracted, closed) ///////////
      newScreens[index].position = positionClass;

      // handle disabled
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
          // when closing OR RETRACTING, disable content of the screen
          newScreens[index].disabled = true;
          break;
        case "open":
          // when opening, enable content
          newScreens[index].disabled = false;
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


    } /// if screen defined
    //else{
    //  console.log("@@@@@@@@@@@ setScreenPosition without screenKey @@@@@@@@@@@");
    //}




    ////// manage overflowing screens
    if(!options.init) {

      var menuWidth = 3.75;
      var retractedWidth = 5;
      var constPlus = 1;
      var normalWidth = 50;
      var remSize = 16;
      var availableWidth = window.innerWidth / remSize - menuWidth - screenStack[me.state.key].length * retractedWidth;

      var retractAllFurther = false;
      var current = true;
      screenStack[me.state.key].map(function (record) {
        var size = $.grep(newScreens, function (e) {
          if (typeof e == "undefined") return false;
          return e.key == record.key;
        })[0].size;
        var screenSize = size || normalWidth;
        var realScreenSize = screenSize + constPlus - retractedWidth;
        switch (positionClass) {
          case "open":
            if (record.position == "open") {
              if ((availableWidth - realScreenSize) < 0) {
                // partly fits
                update2DArray(newScreens, "key", record.key, "disabled", true);
                if(current){
                  // currently opened screen is large -> maximise it
                  update2DArray(newScreens, "key", record.key, "position", newScreens[index].position + " maximised");
                }

                if (availableWidth < 0 || retractAllFurther) {
                  // not even a bit fits
                  update2DArray(newScreens, "key", record.key, "position", "retracted");
                  record.position = "retracted";
                }
              }

              if (!retractAllFurther && typeof size == "undefined") retractAllFurther = true;
              availableWidth -= realScreenSize;
            } else if (record.position == "retracted") {
              // asi nic?
            }
            break;
          case "retracted":
          case "closed":
            if (record.position == "open") {
              availableWidth -= realScreenSize;
              if ((availableWidth - realScreenSize) >= 0 || typeof size == "undefined") {
                // enable
                update2DArray(newScreens, "key", record.key, "disabled", false);
              }

            } else if (record.position == "retracted") {
              if (availableWidth >= 0 && !current && !retractAllFurther) {
                update2DArray(newScreens, "key", record.key, "position", "open");
                record.position = "open";
                if ((availableWidth - realScreenSize) >= 0 || typeof size == "undefined") {
                  update2DArray(newScreens, "key", record.key, "disabled", false);
                }
              }
            }
            if (!current && !retractAllFurther && typeof size == "undefined") retractAllFurther = true;
        }
        current = false;
      });

    }


    //////////////// log
    log = "\\ ";
    newScreens.map(function(screen){
      var posi = screen.position;
      log += screen.key + " " + posi + "(" + (screen.disabled ? "DIS":"enb") + ") | ";
    });
    console.log(log);
    console.log("----------------------------");
    //////////////// log



    // apply changes of state
    me.setState({
      screens: newScreens
    });

  }
};

function update2DArray(theArray, testKey, testValue, setKey, setValue){
  theArray.map(function(obj){
    if(obj[testKey] == testValue){
      obj[setKey] = setValue;
    }
  });
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
      context
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
