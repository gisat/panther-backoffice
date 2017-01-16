import React, {PropTypes, Component} from 'react';

import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial13Permissions extends PantherComponent {

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	render() {

		return (
			<div>
				<div className="screen-content-only help-page">
					<div>
						<h2>Video Tutorial 14: Permissions</h2>

						<p>It is possible to limit access to the resources in the platform to specific users or groups. The
							resources that are relevant for authorization are Scope, Place, Topic and Group. It is possible to specify
							permissions to create these resources and then per resource it is possible to specify permissions to read,
							update and delete.</p>

						<p>User has a permission towards reosurce when either the user has permission set or when one of the group,
							he is member of has permission set.</p>

						<h3>Permissions to create resources</h3>

						<ol className="plain list-steps">
							<li>Go to the <b>permission</b> page in the BackOffice.</li>
							<li>On the left side choose either <b>User</b> or <b>Group</b></li>
							<li>Choose specific user or group.</li>
							<li>There is part Permissions for creation of types, where you can choose among the resources and by
								removing from the list removing the permissions. By adding to the list adding the permission to chosen
								group or user. Saving happend automatically by choosing.
							</li>
						</ol>

						<h3>Permissions to read, update, delete specific resource</h3>

						<ol className="plain list-steps">
							<li>Go to the <b>permission</b> page in the BackOffice.</li>
							<li>On the left side choose from: Place, Scope, Topic, Group</li>
							<li>Choose specific resource</li>
							<li>On the left side there are lists. These lists are saved whenever new item is added or an item is
								removed.
							</li>
							<li>These lists allows you to specify who wil have permission to read, update or delete chose resource.
							</li>
						</ol>

						<iframe
							className="help-video"
							width="720"
							height="421"
							src="https://www.youtube.com/embed/RKAZ7FlkmVI?rel=0&cc_load_policy=1&cc_lang_pref=en"
							frameBorder="0"
							allowFullScreen
						></iframe>

					</div>
				</div>
			</div>
		);

	}
}

export default ScreenHelpTutorial13Permissions;
