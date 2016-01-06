import React from 'react';

import ScreenAnalysesBase from '../components/ScreenAnalysesBase';
import ScreenAnalysisSpatial from '../components/ScreenAnalysisSpatial';
import ScreenAnalysisSpatialRules from '../components/ScreenAnalysisSpatialRules';

import ScreenDashboardBase from '../components/ScreenDashboardBase';

import ScreenDataLayersBase from '../components/ScreenDataLayersBase';

import ScreenMetadataBase from '../components/ScreenMetadataBase';
import ScreenMetadataLayerVector from '../components/ScreenMetadataLayerVector';

import ScreenPlacesBase from '../components/ScreenPlacesBase';
import ScreenLinksByAttSetAULevel from '../components/ScreenLinksByAttSetAULevel';

module.exports = [
	{
		key: "analyses",
		screens: [
			{
				key: "analyses1",
				component: <ScreenAnalysesBase/>,
				data: {
					x: 7
				}
			},
			{
				key: "analyses2",
				//type: "constant",
				size: 40,
				position: "retracted",
				component: <ScreenAnalysisSpatial parentUrl="/analyses/spatial"/>,
				data: {
					neco: 42,
					necojineho: 100
				}
			},
			{
				key: "analyses3",
				contentAlign: "fill",
				//size: 80,
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
		screens: [
			{
				key: "screen1",
				component: <ScreenDashboardBase/>
			}
		]
	},

	{
		key: "dataLayers",
		screens: [
			{
				key: "screen1",
				component: <ScreenDataLayersBase/>
			}
		]
	},

	{
		key: "metadata",
		screens: [
			{
				key: "screen1",
				component: <ScreenMetadataBase/>
			},
			{
				key: "screen2",
				//type: "constant",
				size: 40,
				//position: "retracted",
				component: <ScreenMetadataLayerVector/>
			}
		]
	},

	{
		key: "places",
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
