import React, { PropTypes, Component } from 'react';
import PantherComponent from '../../common/PantherComponent';

class ConfigPermissionsUser extends PantherComponent {
	render() {
		return (
			<div>
				<div>ConfigPermissionsUser</div>

				<div>Permissions</div>
				<table>
					<thead>
					<tr>
						<th>Type</th>
						<th>Operation</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<td>Scope</td>
						<td>Create</td>
						<td>REMOVE</td>
					</tr>
					<tr>
						<td><select><option>Scope</option><option>Place</option></select></td>
						<td><select><option>Create</option><option>Update</option></select></td>
						<td>ADD</td>
					</tr>
					</tbody>
				</table>

			</div>
		);
	}
}

export default ConfigPermissionsUser;
