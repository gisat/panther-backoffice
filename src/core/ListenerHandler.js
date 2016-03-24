class ListenerHandler {
	constructor(component, storeChangeHandler, addListenerName, removeListenerName) {
		this.storeListeners = {};

		this.component = component;
		this.storeChangeHandler = storeChangeHandler;

		this.addListenerName = addListenerName;
		this.removeListenerName = removeListenerName;
	}

	add(store, args) {
		if (!this.storeListeners[store]) {
			this.storeListeners[store] = [];
		}
		var newListener;
		if(args) {
			newListener = this.storeChangeHandler.bind(this.component, args); // Component is needed
		} else {
			newListener = this.storeChangeHandler.bind(this.component);
		}
		store[this.addListenerName](newListener);
		this.storeListeners[store].push(newListener);
	}

	clean() {
		let removeListenerName = this.removeListenerName;
		for(let store in this.storeListeners) {
			if(!this.storeListeners.hasOwnProperty(store)) {
				return;
			}
			this.storeListeners[store].forEach(function(listener){
				// TODO: Understand undefined.
				if(store[removeListenerName]) {
					store[removeListenerName](listener);
				}
			});
		}
	}
}

export default ListenerHandler;
