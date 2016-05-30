import { Dispatcher } from 'flux';

class SafeDispatcher extends Dispatcher {
	dispatch(payload) {
		setTimeout(function(){
			super.dispatch(payload)
		}, 1);
	}
}

var AppDispatcher = new SafeDispatcher();

export default AppDispatcher;
