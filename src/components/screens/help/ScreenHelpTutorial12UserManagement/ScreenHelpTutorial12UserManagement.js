import React, {PropTypes, Component} from 'react';

import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial12UserManagement extends PantherComponent {

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	render() {

		return (
			<div>
				<div className="screen-content-only help-page">
					<div>
						<h2>Video Tutorial 12: User Management</h2>

						<p>In order to fully use the platform, it is necessary to create a new user. User is either created by
							someone with administration rights or invited by someone who is already member of the platform. In the
							administration part is it also possible to delete existing users.</p>

						<h3>Invitation - Any user can invite others</h3>

						<ol className="plain list-steps">
							<li>Go to the <b>Dashboard</b> in the BackOffice</li>
							<li>Click on the <b>User Invitation</b></li>
							<li>This opens new tab with the page for invitation of users. Here specify the email and username of the
								invited user and click on <b>Invite User</b></li>
							<li>The user should now receive link, which allows him to register.</li>
						</ol>

						<h3>Administration - Only administrators can do that. </h3>

						<ol className="plain list-steps">
							<li>Go to the <b>Dashboard</b> in the BackOffice</li>
							<li>Click on the <b>User Management</b></li>
							<ol>
								<li>This opens new tab with the possibility to add user via the button <b>Add user</b> on the top left.
								</li>
							</ol>
							<ol>
								<li>It is also possible here to <b>delete</b> existing user via checking the checkbox to the left of the
									name.
								</li>
								<li>Then select action <b>Delete selected users</b></li>
								<li>Click on the <b>Go</b> button next to it</li>
								<li>Confirm that you really want to delete the user.</li>
							</ol>
						</ol>

					</div>
				</div>
			</div>
		);

	}
}

export default ScreenHelpTutorial12UserManagement;
