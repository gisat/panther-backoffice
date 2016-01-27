export default {
	stringHash: function(str) {
		if(!str) str = "";
		var hash = 0, strlen = str.length;
		if (strlen === 0) return hash;
		for (var i = 0, n; i < strlen; ++i) {
			n = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + n;
			hash |= 0;
		}
		return hash >>> 0;
	}
}


