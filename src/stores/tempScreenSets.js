import React from 'react';

import ScreenAnalysesBase from '../components/screens/ScreenAnalysesBase';
import ScreenAnalysisSpatial from '../components/screens/ScreenAnalysisSpatial';
import ScreenAnalysisSpatialRules from '../components/screens/ScreenAnalysisSpatialRules';

import ScreenDashboardBase from '../components/screens/ScreenDashboardBase';

import ScreenDataLayersBase from '../components/screens/ScreenDataLayersBase';

import ScreenMetadataBase from '../components/screens/ScreenMetadataBase';
import ScreenMetadataLayerVector from '../components/screens/ScreenMetadataLayerVector';

import ScreenPlacesBase from '../components/screens/ScreenPlacesBase';
import ScreenPlaceDataSourceAttSet from '../components/screens/ScreenPlaceDataSourceAttSet';

import ScreenPermissionsBase from '../components/screens/ScreenPermissionsBase';

module.exports = [
	{
		key: "analyses",
		title: "Analyses",
		screens: [
			{
				key: "ScreenAnalysesBase",
				component: ScreenAnalysesBase,
				//component: <ScreenAnalysesBase/>,
				data: {
					x: 7
				}
			},
			{
				key: "ScreenAnalysisSpatial",
				//type: "constant",
				size: 40,
				position: "retracted",
				component: ScreenAnalysisSpatial,
				//component: <ScreenAnalysisSpatial/>,
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
				component: ScreenAnalysisSpatialRules,
				//component: <ScreenAnalysisSpatialRules/>,
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
				component: ScreenDashboardBase,
				contentAlign: "fill"
				//component: <ScreenDashboardBase/>
			}
		]
	},

	{
		key: "dataLayers",
		title: "Data layers",
		screens: [
			{
				key: "ScreenDataLayersBase",
				component: ScreenDataLayersBase
				//component: <ScreenDataLayersBase/>
			}
		]
	},

	{
		key: "metadata",
		title: "Metadata structures",
		screens: [
			{
				key: "ScreenMetadataBase",
				component: ScreenMetadataBase
				//component: <ScreenMetadataBase/>
			}
		]
	},

	{
		key: "permissions",
		title: "Permissions",
		screens: [
			{
				key: "ScreenPermissionsBase",
				component: ScreenPermissionsBase
			}
		]
	},

	{
		key: "places",
		title: "Places",
		screens: [
			{
				key: "screenPlacesBase",
				component: ScreenPlacesBase
				//component: <ScreenPlacesBase />
			},
			{
				key: "screenLinksByAttSetAULevel",
				//type: "constant",
				size: 40,
				position: "retracted",
				component: ScreenPlaceDataSourceAttSet
				//component: <ScreenLinksByAttSetAULevel />
			}
		]
	}
];
