import React, {PropTypes, Component} from 'react';
import {apiProtocol, apiHost, apiPath} from '../../../config';

class LulcIntegrationPage extends Component {
	constructor() {
		super();
	}

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired
	};

	componentDidMount() {
		this.setState({
			ready: true
		});
	}

	render() {
		return (
			<form method="POST" action={apiProtocol + apiHost + apiPath + '/rest/integration/lulc'} encType="multipart/form-data" >
				<div>
					<label>Scope Id: <input name="scopeId" type="text" /></label>
				</div>
				<div>
					<label>Place Name: <input name="placeName" type="text" /></label>
				</div>
				<div>
					<label>Place Bbox: <input name="bbox" type="text" /></label>
				</div>
				<div>
					<label>Place AU1 Table: <input name="analyticalLevels[]" type="text" /></label>
				</div>
				<div>
					<label>Place AU2 Table: <input name="analyticalLevels[]" type="text" /></label>
				</div>
				<div>
					<label>Place AU3 Table: <input name="analyticalLevels[]" type="text" /></label>
				</div>

				<div>
					<label>AU 1: <input name="au1" type="file" /></label>
				</div>
				<div>
					<label>AU 2: <input name="au2" type="file" /></label>
				</div>
				<div>
					<label>AU 3: <input name="au3" type="file" /></label>

				</div>
				<div>
					<label>VHR:  <input name="vhr" type="file" /></label>
				</div>
				<div>
					<label>HR: <input name="hr" type="file" /></label>
				</div>
				<div>
					<label>LULC Change: <input name="lulc_change" type="file" /></label>
				</div>
				<div>
					<label>Flood: <input name="flood" type="file" /></label>
				</div>
				<div>
					<label>Green Extension: <input name="green_extension" type="file" /></label>
				</div>
				<div>
					<label>Informal Settlements: <input name="informal_settlements" type="file" /></label>
				</div>
				<div>
					<label>Node: <input name="node" type="file" /></label>
				</div>
				<div>
					<label>Transport: <input name="" type="file" /></label>
				</div>
				<div>
					<input type="submit" value="Integrate" />
				</div>
			</form>
		);
	}
}

export default LulcIntegrationPage;
