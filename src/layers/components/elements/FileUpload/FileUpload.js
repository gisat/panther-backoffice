import React, {PropTypes, Component} from 'react';
import superagent from 'superagent';
import path from "path";

import {apiProtocol, apiHost, apiPath} from '../../../../config';
import FileUploadProgress from '../FileUploadProgress';

class FileUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isUploading: false,
			runningOperationId: null,
			name: ''
		}
	}

	url() {
		return apiProtocol + apiHost + path.join(apiPath, '/rest/importer/layer').replace(/\\/g, "/");
	}

	statusUrl(id) {
		if(!id) {
			return null;
		} else {
			return apiProtocol + apiHost + path.join(apiPath, `rest/layerImporter/status/${id}`).replace(/\\/g, "/");
		}
	}

	uploadFile() {
		let fileInput = $('#data-layer-upload')[0];
		let file = fileInput.files[0];
		let name = this.state.name;

		let payload = new FormData();
		payload.append('file', file);
		payload.append('name', name);
		this.setState({
			isUploading: true
		});

		superagent
			.post(this.url())
			.send(payload)
			.then(data => {
				this.setState({
					isUploading: true,
					runningOperationId: data.body.id
				})
			})
			.catch(err => {
				// TODO: Let user know in a better fashion.
				alert(err);
			});
	}

	uploadFinished(error) {
		if(!error) {
			this.setState({isUploading: false});
		}
	}

	onChangeName(e) {
		this.setState({
			name: e.target.value
		});
	}

	render() {
		// Either Upload the File
		// Or Show the progress
		if (this.state.isUploading) {
			return <FileUploadProgress
				onComplete = {this.uploadFinished.bind(this)}
				url = {this.statusUrl(this.state.runningOperationId)}
			/>
		} else {
			return (
				<div>
					<h2>Upload the layer</h2>

					<form>
						<div>File to upload: <input type="file" id="data-layer-upload" name="file"/></div>

						<div>Name: <input type="text" onChange={this.onChangeName.bind(this)}/></div>

						<input type="button" value="Upload" onClick={this.uploadFile.bind(this)}/>
					</form>
				</div>
			);
		}
	}
}

export default FileUpload;
