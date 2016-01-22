class FauxStore {

	getById(id) {
		return Promise.resolve(id);
	}

	getFiltered(options) {
		return Promise.resolve(options);
	}

}

export default FauxStore;
