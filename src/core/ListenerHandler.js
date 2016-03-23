class ListenerHandler {
	constructor(component, storeChangeHandler) {
		this.storeListeners = {};

		this.component = component;
		this.storeChangeHandler = storeChangeHandler;
	}

	addListener(store, args) {
		if (!this.storeListeners[store]) {
			this.storeListeners[store] = [];
		}
		var newListener = this.storeChangeHandler.bind(this.component, args);
		store.addChangeListener(newListener);
		this.listeners[store].push(newListener);
	}

	cleanListeners() {
		for(let store in this.storeListeners) {
			this.storeListeners[store].forEach(function(listener){
				store.removeChangeListener(listener);
			});
		}
	}
}

export default ListenerHandler;
