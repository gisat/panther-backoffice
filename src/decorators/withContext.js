/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react'; // eslint-disable-line no-unused-vars
import emptyFunction from 'fbjs/lib/emptyFunction';

function withContext(ComposedComponent) {
  return class WithContext extends Component {

    static propTypes = {
      context: PropTypes.shape({
        onInsertCss: PropTypes.func,
        onSetTitle: PropTypes.func,
        onSetMeta: PropTypes.func,
        onPageNotFound: PropTypes.func,
        setScreenPosition: PropTypes.func,
				onSetScreenData: PropTypes.func,
        activePageKey: PropTypes.func,
        page: PropTypes.object,
				setStateFromStores: PropTypes.func
      })
    };

    static childContextTypes = {
      onInsertCss: PropTypes.func.isRequired,
      onSetTitle: PropTypes.func.isRequired,
      onSetMeta: PropTypes.func.isRequired,
      onPageNotFound: PropTypes.func.isRequired,
      setScreenPosition: PropTypes.func.isRequired,
      onSetScreenData: PropTypes.func.isRequired,
			setStateFromStores: PropTypes.func.isRequired,
      activePageKey: PropTypes.func.isRequired,
      page: PropTypes.object.isRequired
    };

    getChildContext() {
      const context = this.props.context;
      return {
        onInsertCss: context.onInsertCss || emptyFunction,
        onSetTitle: context.onSetTitle || emptyFunction,
        onSetMeta: context.onSetMeta || emptyFunction,
        onPageNotFound: context.onPageNotFound || emptyFunction,
        setScreenPosition: context.setScreenPosition || emptyFunction,
				onSetScreenData: context.onSetScreenData || emptyFunction,
				setStateFromStores: context.setStateFromStores || emptyFunction,
        activePageKey: context.activePageKey || emptyFunction,
        page: {}
      };
    }

    render() {
      const { context, ...other } = this.props; // eslint-disable-line no-unused-vars
      return <ComposedComponent {...other} />;
    }

  };
}

export default withContext;
