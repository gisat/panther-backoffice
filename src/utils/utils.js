import React from 'react';
import ActionCreator from '../actions/ActionCreator';
import {Model} from '../constants/ObjectTypes';
import ScopeStore from '../stores/ScopeStore';
import ThemeStore from '../stores/ThemeStore';
import AttributeSetStore from '../stores/AttributeSetStore';
import ScopeModel from '../models/ScopeModel';
import _ from 'underscore';

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
	 * @param responseData - data to send back with response - e.g. state variable to store created object in
	 * @param stateHash - state hash to send along with action for later pairing
	 * @returns {Array} - values without new (those are added when handling action response)
	 */
	handleNewObjects: function(values, objectType, responseData, stateHash) {
		var newValues = [];
		for (var singleValue of this.deepClone(values)) {
			if(singleValue.create){
				delete singleValue.create; // discard new object bit
				delete singleValue.label; // discard temp compatibility key
				delete singleValue.value; // discard temp compatibility key
				delete singleValue.key; // discard temp key = name
				let valueModel = new Model[objectType](singleValue);
				valueModel.active = false;
				ActionCreator.createObjectAndRespond(valueModel,objectType,responseData,stateHash);
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
	},

	getPeriodsForScope: function(scope) {
		return new Promise(function(resolve, reject){

			var scopePromise = null;
			if(scope instanceof ScopeModel) {
				scopePromise = Promise.resolve(scope);
			}else{
				scopePromise = ScopeStore.getById(scope);
			}

			scopePromise.then(function(scopeModel){
				ThemeStore.getFiltered({scope: scopeModel}).then(function(themeModels){

					if(!themeModels.length){
						return reject("getPeriodsForScope: themes with filter {scope: "+scope+"} not find.");
					}

					var periodKeys = [];
					var periodModels = [];

					for(let theme of themeModels){
						if(!theme.hasOwnProperty("periods")){
							return reject("getPeriodsForScope: no periods property in theme!");
						}
						for(let period of theme.periods){
							periodKeys.push(period.key);
							periodModels.push(period);
						}
					}

					resolve({
						keys: _.uniq(periodKeys),
						models: _.uniq(periodModels)
					});

				}, function(){

					reject("getPeriodsForScope: theme with filter {scope: " + scope + "} not resolved.");

				});
			});
		});
	},

	getAttSetsForScope: function(scope) {
		return new Promise(function(resolve, reject){

			var scopePromise = null;
			if(scope instanceof ScopeModel) {
				scopePromise = Promise.resolve(scope);
			}else{
				scopePromise = ScopeStore.getById(scope);
			}

			scopePromise.then(function(scopeModel){
				ThemeStore.getFiltered({scope: scopeModel}).then(function(themeModels){

					if(!themeModels.length){
						return reject("getAttSetsForScope: themes with filter {scope: "+scope+"} not found.");
					}

					var attSetKeys = [];
					var attSetModels = [];
					var promises = [];

					for(let theme of themeModels){
						if(!theme.hasOwnProperty("topics")){
							return reject("getAttSetsForScope: no topics property in theme!");
						}
						for(let topic of theme.topics){

							var attSetPromise = AttributeSetStore.getFiltered({topic: topic});
							promises.push(attSetPromise);
							attSetPromise.then(function(attributeSets){

								for(let attSet of attributeSets){
									attSetKeys.push(attSet.key);
									attSetModels.push(attSet);
								}

							}, function(){

								reject("getAttSetsForScope: attributeSets with filter {topic: " + topic + "} not resolved.");

							});

						}
					}

					Promise.all(promises).then(function(){
						resolve({
							keys: _.uniq(attSetKeys),
							models: _.uniq(attSetModels)
						});
					});


				}, function(){

					reject("getAttSetsForScope: theme with filter {scope: " + scope + "} not resolved.");

				});
			});
		});
	},

	deepClone: function(data) {
		var clone = data;
		if(_.isObject(data) && !React.Component.isPrototypeOf(data)) {

			clone = _.clone(data);

			_.each(clone, function (value, key) {
				clone[key] = this.deepClone(value);
			}, this);

		}

		return clone;
	},

	getModelsKeys(modelArray) {
		var keyArray = [];
		_.each(modelArray, function(model, key) {
			keyArray.push(model.key);
		});
		return keyArray;
	}

}


