import React from 'react';

import ScreenAnalysesBase from '../components/screens/ScreenAnalysesBase';
import ScreenAnalysisSpatial from '../components/screens/ScreenAnalysisSpatial';
import ScreenAnalysisSpatialRules from '../components/screens/ScreenAnalysisSpatialRules';

import ScreenDashboardBase from '../components/screens/ScreenDashboardBase';

import ScreenDataLayersBase from '../components/screens/ScreenDataLayersBase';

import ScreenMetadataBase from '../components/screens/ScreenMetadataBase';
import ScreenMetadataLayerVector from '../components/screens/ScreenMetadataLayerVector';

import ScreenPlacesBase from '../components/screens/ScreenPlacesBase';
import ScreenLinksByAttSetAULevel from '../components/screens/ScreenLinksByAttSetAULevel';

module.exports = [
	{
		key: "analyses",
		title: "Analyses",
		screens: [
			{
				key: "ScreenAnalysesBase",
				component: <ScreenAnalysesBase/>,
				data: {
					x: 7
				}
			},
			{
				key: "ScreenAnalysisSpatial",
				//type: "constant",
				size: 40,
				position: "retracted",
				component: <ScreenAnalysisSpatial/>,
				parentUrl: "/analyses/spatial",
				data: {
					neco: 42,
					necojineho: 100
				}
			},
			{
				key: "ScreenAnalysisSpatialRules",
				//contentAlign: "fill",
				size: 80,
				position: "retracted",
				component: <ScreenAnalysisSpatialRules/>,
				data: {
					rule_id: 47,
					title: "pumpa"
				}
			}
		]
	},

	{
		key: "dashboard",
		title: "Dashboard",
		screens: [
			{
				key: "ScreenDashboardBase",
				component: <ScreenDashboardBase/>
			}
		]
	},

	{
		key: "dataLayers",
		title: "Data layers",
		screens: [
			{
				key: "ScreenDataLayersBase",
				component: <ScreenDataLayersBase/>
			}
		]
	},

	{
		key: "metadata",
		title: "Metadata structures",
		screens: [
			{
				key: "ScreenMetadataBase",
				component: <ScreenMetadataBase/>
			}
		]
	},

	{
		key: "places",
		title: "Places",
		screens: [
			{
				key: "screenPlacesBase",
				component: <ScreenPlacesBase />
			},
			{
				key: "screenLinksByAttSetAULevel",
				//type: "constant",
				size: 40,
				position: "retracted",
				component: <ScreenLinksByAttSetAULevel />
			}
		]
	}
];
