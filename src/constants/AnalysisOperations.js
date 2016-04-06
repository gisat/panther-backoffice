import keyMirror from 'fbjs/lib/keyMirror';

//export const spatial = {
//	COUNT: null,
//	SUM_AREA: null,
//	SUM_ATTRIBUTE: null,
//	AVG_AREA: null,
//	AVG_ATTRIBUTE_WEIGHT_AREA: null,
//	AVG_ATTRIBUTE_WEIGHT_ATTRIBUTE: null
//};

export const analysisOperationsMetadata = {
	SPATIAL: {
		COUNT: {
			key: "count",
			name: "COUNT"
		},
		SUM_AREA: {
			key: "sumarea",
			name: "SUM (area/length)"
		},
		SUM_ATTRIBUTE: {
			key: "sumattr",
			name: "SUM (attribute)"
		},
		AVG_AREA: {
			key: "avgarea",
			name: "AVERAGE (area/length)"
		},
		AVG_ATTRIBUTE_WEIGHT_AREA: {
			key: "avgattrarea",
			name: "AVERAGE (attribute), weighted by area/length"
		},
		AVG_ATTRIBUTE_WEIGHT_ATTRIBUTE: {
			key: "avgattrattr",
			name: "AVERAGE (attribute), weighted by attribute"
		}
	},
	LEVEL: {
		SUM: {
			key: "sum",
			name: "SUM"
		},
		AVG_WEIGHT_AREA: {
			key: "avgarea",
			name: "AVERAGE, weighted by area/length"
		},
		AVG_WEIGHT_ATTRIBUTE: {
			key: "avgattr",
			name: "AVERAGE, weighted by attribute"
		}
	}
};

export default {
	SPATIAL: keyMirror(analysisOperationsMetadata.SPATIAL),
	LEVEL: keyMirror(analysisOperationsMetadata.LEVEL)
};
