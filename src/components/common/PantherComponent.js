import React, { PropTypes, Component } from 'react';

import logger from '../../core/Logger';

class PantherComponent extends Component {
	constructor(props) {
		super(props);

		logger.info("PantherComponent# constructor(), Props: ", props);
	}

	setStateFromStores(props, keys) {
		logger.info("PantherComponent# setStateFromStores(), Props: ", props, ", keys:", keys);
	}
}

export default PantherComponent;
