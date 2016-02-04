class FauxStore {

	getById(id) {
		return Promise.resolve(null);
	}

	getFiltered(options) {
		return Promise.resolve(null);
	}

	getAll() {
		return Promise.resolve(null);
	}

}

export default FauxStore;
