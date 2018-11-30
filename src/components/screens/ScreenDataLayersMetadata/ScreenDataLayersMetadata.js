import React, {PropTypes, Component} from 'react';
//import styles from './ScreenDataLayersMetadata.css';
//import withStyles from '../../../decorators/withStyles';

import path from "path";

import utils from '../../../utils/utils';
import _ from 'underscore';
import superagent from 'superagent';

import ActionCreator from '../../../actions/ActionCreator';

//import PeriodStore from '../../../stores/PeriodStore';
import ListenerHandler from '../../../core/ListenerHandler';

import DataLayerStore from '../../../stores/DataLayerStore';

import logger from '../../../core/Logger';
import ControllerComponent from "../../common/ControllerComponent";
import {Input} from "../../SEUI/elements/input/input";
import ConfigControls from "../../atoms/ConfigControls";
import config from "../../../config";


//@withStyles(styles)
class ScreenDataLayersMetadata extends Component {

	constructor(props) {
		super(props);

		this.state = {
			metadata: props.data.dataLayer.metadata,
			sourceUrl: props.data.dataLayer.sourceUrl,
			saving: false,
			saved: false,
			localSource: false
		};
	}

	componentDidMount() {
		this.isLocalVector(this.props.data.dataLayer.key)
			.then((result) => {
				if(result) {
					this.setState({
						localSource: `${config.geoserverProtocol}${config.geoserverAddress}/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=${this.props.data.dataLayer.key}&outputFormat=SHAPE-ZIP`
					})
				}
			})
	}

	isLocalVector(dataLayerIdentificator) {
		let dataLayerIdentificatorParts = dataLayerIdentificator.split(`:`);
		let workspace = dataLayerIdentificatorParts[0];
		let dataLayerName = dataLayerIdentificatorParts[1];

		let datastore;

		if(workspace === `geonode`) {
			datastore = `datastore`;
		} else if(workspace === `panther`) {
			datastore = `views`;
		}

		return superagent
			.get(`${config.geoserverProtocol}${config.geoserverAddress}/rest/workspaces/${workspace}/datastores/${datastore}/featuretypes/${dataLayerName}`)
			.auth(`admin`, `geoserver`)
			.then((response) => {
				if(response.status === 200) {
					return true;
				}
			})
			.catch((error) => {
				return false;
			})
	}

	setLocalVectorSourceUrl() {
		this.setState({
			sourceUrl: this.state.localSource
		})
	}

	save() {
		this.setState({saving: true, saved: false});

		return superagent
			.put(`${config.apiProtocol}${config.apiHost}${config.apiPath}/rest/layer`)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.send({
				id: this.props.data.dataLayer.id,
				metadata: this.state.metadata,
				source_url: this.state.sourceUrl
			})
			.then((result) => {
				this.setState({saving: false, saved: true});
				DataLayerStore.reload();
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({saving: false});
			})
	}


	delete() {
		this.setState({saving: true, saved: false});

		return superagent
			.put(`${config.apiProtocol}${config.apiHost}${config.apiPath}/rest/layer`)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.send({
				id: this.props.data.dataLayer.id,
				metadata: null,
				source_url: null
			})
			.then((result) => {
				this.setState({saving: false, saved: true});
				DataLayerStore.reload();
			})
			.catch((error) => {
				this.setState({saving: false});
			})
	}

	onChangeMetadata(event) {
		this.setState({
			metadata: event.target.value ? event.target.value : null
		});
	}

	onChangeSourceUrl(event) {
		this.setState({
			sourceUrl: event.target.value ? event.target.value : null,
		});
	}

	render() {

		let ret = null;

		let localSource = this.state.localSource && !this.state.sourceUrl ? (<div className="frame-input-wrapper-info">
			Layer is available on local server. Click <div onClick={this.setLocalVectorSourceUrl.bind(this)} style={{cursor: `pointer`, display: `inline-block`, fontWeight: `bold`}}>here</div> to generate url.
		</div>) : null;

		ret = (
			<div>
				<div className="screen-setter">
					<div>
						<div className="screen-setter-section">Data layer metadata</div>

					</div>
				</div>
				<div className="screen-content">
					<div>
						<div
							className="frame-input-wrapper"
							key="extended-fields-configuration"
						>
							<label className="container">
								Metadata
								<textarea
									name="enumerationValues"
									placeholder=" "
									value={this.state.metadata}
									onChange={this.onChangeMetadata.bind(this)}
								/>
							</label>
						</div>
						<div className="frame-input-wrapper">
							<label className="container">
								Source url
								<Input
									type="text"
									name="sourceUrl"
									placeholder=" "
									value={this.state.sourceUrl}
									onChange={this.onChangeSourceUrl.bind(this)}
								/>
								{localSource}
							</label>
						</div>
						<ConfigControls
							key={0}
							disabled={false}
							saved={(this.state.metadata === this.props.data.dataLayer.metadata && this.state.sourceUrl === this.props.data.dataLayer.sourceUrl) || this.state.saved}
							saving={this.state.saving}
							onSave={this.save.bind(this)}
							onDelete={this.delete.bind(this)}
						/>
					</div>
				</div>
			</div>
		);


		return ret;

	}
}

export default ScreenDataLayersMetadata;
