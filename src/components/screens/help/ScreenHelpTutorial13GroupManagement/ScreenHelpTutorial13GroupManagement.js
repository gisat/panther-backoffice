import React, {PropTypes, Component} from 'react';

import PantherComponent from "../../../common/PantherComponent";

class ScreenHelpTutorial13GroupManagement extends PantherComponent {

	static contextTypes = {
		onInteraction: PropTypes.func.isRequired,
		screenSetKey: PropTypes.string.isRequired
	};

	render() {

		return (
			<div>
				<div className="screen-content-only help-page">
					<div>
						<h2>Video Tutorial 13: Group Management</h2>

						<p>In the platform it is possible to Create groups of users. It is useful for defining permissions towards
							different Scopes, Places, Topics and Layers.</p>

						<p>There are three different groups, which has specific meaning. Don't delete or edit them. The groups are
							guest, user and admin. Everyone who comes to the platform is member of the group guest. Everyone who is
							logged in is member of the group user. Group admin contains all members who have full rights toward the
							system. In case you are admin you can add other administrators if you decide to do so.</p>

						<ol className="plain list-steps">
							<li>Go to the <b>permission</b> page in the BackOffice.</li>
							<li>Choose <b>Group</b> on the left side</li>
							<li>To create group click on the + the same way as for any other type of metadata</li>
							<li>To Edit group, click on the group name</li>
							<li>In the panel on the right, the first part allows you to specify the name of the group.</li>
							<li>In the panel on the right, the second part allows you to specify the members of the group.</li>
							<li>The rest will be explained in the next section of the tutorial.</li>
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

export default ScreenHelpTutorial13GroupManagement;
