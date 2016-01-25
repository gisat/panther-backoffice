class FauxStore {

	getById(id) {
		return Promise.resolve([]);
	}

	getFiltered(options) {
		return Promise.resolve([]);
	}

	getAll() {
		return Promise.resolve([]);
	}

}

export default FauxStore;
