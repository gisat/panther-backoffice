import ActionCreator from '../actions/ActionCreator';
import {model} from '../constants/ObjectTypes';

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
	},

	/**
	 * Find objects to create among selected in (Object)Select
	 * @param values - selected objects
	 * @param objectType - data type for Action
	 * @param stateKey - state variable to store created object in
	 * @param stateHash - state hash to send along with action for later pairing
	 * @returns {Array} - values without new (those are added when handling action response)
	 */
	handleNewObjects: function(values, objectType, stateKey, stateHash) {
		var newValues = [];
		for (var singleValue of values) {
			if(singleValue.create){
				delete singleValue.create; // discard new object bit
				delete singleValue.label; // discard temp compatibility key
				delete singleValue.value; // discard temp compatibility key
				delete singleValue.key; // discard temp key = name
				let valueModel = new model[objectType](singleValue);
				ActionCreator.createObjectAndSetState(valueModel,objectType,stateKey,stateHash);
			}
			else {
				newValues.push(singleValue.key);
			}

		}
		return newValues;
	},

	keyNameOptionFactory: function(inputValue) {
		return {
			key: inputValue,
			name: inputValue,
			value: inputValue,
			label: inputValue,
			create: true
		};
	}

}


