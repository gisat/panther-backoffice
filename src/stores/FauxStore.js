class FauxStore {

	byId(id) {
		return Promise.resolve(id);
	}

	filter(options) {
		return Promise.resolve(options);
	}

}

export default FauxStore;
