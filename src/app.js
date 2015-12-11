/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel-core/polyfill';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import Router from './routes';
import Location from './core/Location';
import { addEventListener, removeEventListener } from './utils/DOMUtils';
import ga from 'react-ga';
import { googleAnalyticsId } from './config';

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
    screenStack[me.state.key] = screenStack[me.state.key] || [];


    //////////////// log
    console.log("");
    console.log("###sSP  ["+screenKey+" » "+positionClass+"]  options:", options);
    //console.log("this class: "+this.constructor.name);
    var log = " /Stack: ";
    screenStack[me.state.key].map(function(screen, i){
      log += " [" + i + "]" + screen.key + " " + screen.position;
    });
    console.log(log);
    log = "/ STATE: ";
    newScreens.map(function(screen){
      log += screen.key + " " + screen.position + "(" + (screen.disabled ? "DIS":"en") + ") | ";
    });
    console.log(log);
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
      // remove previous records for the same screen
      var order;
      screenStack[me.state.key].map(function(record, i){
        if(record.key == screenKey){
          order = record.order;
          screenStack[me.state.key].splice(i, 1);
        }
      });
      if(!order){
        // novy
      }
      // add record for this operation
      if(positionClass == "open" || positionClass == "retracted"){
        screenStack[me.state.key].unshift({
          key: screenKey,
          position: positionClass,
          order: order
        });
      }

      //console.log("||||||| screenStack after operation log: ", screenStack);


    } /// if screen defined
    //else{
    //  console.log("@@@@@@@@@@@ setScreenPosition without screenKey @@@@@@@@@@@");
    //}



    ////// manage overflowing screens
    if(true || !options.init) {

      var menuWidth = 3.75;
      var retractedWidth = 5;
      var constPlus = 1;
      var normalWidth = 50;
      var remSize = 16;
      var availableWidth = window.innerWidth / remSize - menuWidth - screenStack[me.state.key].length * retractedWidth;
      console.log("        =init innerWidth:" + window.innerWidth / remSize + " availableWidth:"+availableWidth);

      var retractAllFurther = false;
      var current = true;
      var foundOpen = false;
      screenStack[me.state.key].map(function (record) {
        var size = $.grep(newScreens, function (e) {
          if (typeof e == "undefined") return false;
          return e.key == record.key;
        })[0].size;
        var screenSize = size || normalWidth;
        var realScreenSize = screenSize + constPlus - retractedWidth;
        console.log("        =record "+record.key+"-"+record.position+"    size:"+size+"->"+screenSize+"->"+realScreenSize);
        switch (positionClass) {
          case "open":
            if (record.position == "open") {

              // fits partly or not at all
              if ((availableWidth - realScreenSize) < 0) {

                if(current){
                  update2DArray(newScreens, "key", record.key, "position", newScreens[index].position + " maximised");
                  me.state.hasMaximised = true;
                }else{

                  update2DArray(newScreens, "key", record.key, "disabled", true);

                  // doesn't fit at all
                  if (availableWidth < 0 || retractAllFurther) {
                    update2DArray(newScreens, "key", record.key, "position", "retracted");
                    console.log("         =========== "+record.position+" => retracted ");
                    record.position = "retracted";
                  }else{
                  }

                }

              }

              if (typeof size == "undefined") retractAllFurther = true;

              availableWidth -= realScreenSize;
              console.log("         ======= availableWidth:"+availableWidth);

            } else if (record.position == "retracted") {
              // asi nic?
            }
            break;
          case "retracted":
          case "closed":
            me.state.hasMaximised = false;

            if (record.position == "open") {
              availableWidth -= realScreenSize;
              console.log("         ======= availableWidth:"+availableWidth);
              foundOpen = true;

              if ((availableWidth - realScreenSize) >= 0) { //  || typeof size == "undefined"
                // enable
                update2DArray(newScreens, "key", record.key, "disabled", false);
              }else{
                // disable
                update2DArray(newScreens, "key", record.key, "disabled", true);
                retractAllFurther = true;
              }

            } else if (record.position == "retracted") { // algoritmicky
              if (availableWidth >= 0 && !current && !retractAllFurther) {
                // open
                update2DArray(newScreens, "key", record.key, "position", "open");
                console.log("         =========== "+record.position+" => open ");
                record.position = "open";
                if ((availableWidth - realScreenSize) >= 0) {
                  // enable
                  update2DArray(newScreens, "key", record.key, "disabled", false);
                }else if(!foundOpen){
                  // enable
                  update2DArray(newScreens, "key", record.key, "disabled", false);
                  // maximise
                  update2DArray(newScreens, "key", record.key, "position", newScreens[index].position + " maximised");
                  me.state.hasMaximised = true;
                  retractAllFurther = true;
                }else{
                  // disable
                  update2DArray(newScreens, "key", record.key, "disabled", true);
                  retractAllFurther = true;
                }
                foundOpen = true;
                availableWidth -= realScreenSize;
                console.log("         ======= availableWidth:"+availableWidth);
              }
            }
            if (!current && typeof size == "undefined") retractAllFurther = true;
        }
        current = false;
      });

    }

    // reorder screenStack to be open-first when init run
    if(options.init){
      //console.log("| / screenStack[me.state.key][0].key:", screenStack[me.state.key][0].key);
      screenStack[me.state.key].sort(function(a, b){
        if((a.position == "closed" || a.position == "retracted") && b.position == "open"){
          return 1;
        }
        return 0;
      });
      //console.log("| \\ screenStack[me.state.key][0].key:", screenStack[me.state.key][0].key);
    }


    //////////////// log
    log = "\\ Stack: ";
    screenStack[me.state.key].map(function(screen, i){
      log += " [" + i + "]" + screen.key + " " + screen.position;
    });
    console.log(log);
    log = " \\STATE: ";
    newScreens.map(function(screen){
      log += screen.key + " " + screen.position + "(" + (screen.disabled ? "DIS":"enb") + ") | ";
    });
    console.log(log);
    console.log("  ----------------------------");
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

	var gaOptions = { debug: true };
	ga.initialize(googleAnalyticsId, gaOptions);

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
