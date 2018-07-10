import superagent from 'superagent';

import React, {PropTypes, Component} from 'react';

class FileUploadProgress extends Component {
	constructor(props) {
		super(props);

		this.state = {
			progress: 0
		};

		this.timer = window.setInterval(this.retrieveStatus.bind(this), 1000);
	}

	retrieveStatus() {
		// Update the status based on the information untill either error or done.
		if (this.props.url) {
			superagent
				.get(this.props.url)
				.then(status => {
					if (status.body.status == 'done') {
						window.clearInterval(this.timer);
						this.props.onComplete();
					} else if (status.body.status == 'error') {
						window.clearInterval(this.timer);
						this.props.onComplete(status.message);
					} else {
						let progress = status.body.progress;
						this.setState({progress});
					}
				}).catch(error => {
				console.error(error);
				window.clearInterval(this.timer);
				this.props.onComplete(error);
			});
		}
	}

	render() {
		return (
			<div>
				Progress: {this.state.progress} / 100
			</div>
		);
	}
}

FileUploadProgress.propTypes = {
	onComplete: PropTypes.func,
	url: PropTypes.string
};

FileUploadProgress.defaultProps = {
	onComplete: f => f
};

export default FileUploadProgress;
