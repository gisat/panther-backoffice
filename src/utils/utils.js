import React from 'react';
import ActionCreator from '../actions/ActionCreator';
import ObjectTypes, {Model, Store, objectTypesMetadata} from '../constants/ObjectTypes';
import ScopeStore from '../stores/ScopeStore';
import TopicStore from '../stores/TopicStore';
import ThemeStore from '../stores/ThemeStore';
import VectorLayerStore from '../stores/VectorLayerStore';
import RasterLayerStore from '../stores/RasterLayerStore';
import GeneralLayerStore from '../stores/GeneralLayerStore';
import AttributeSetStore from '../stores/AttributeSetStore';
import GeneralModel from '../models/Model';
import ScopeModel from '../models/ScopeModel';
import VectorLayerModel from '../models/VectorLayerModel';
import TopicModel from '../models/TopicModel';
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
		var self = this;
		return new Promise(function(resolve, reject){

			var scopePromise = null;
			if(scope instanceof ScopeModel) {
				//scopePromise = Promise.resolve(scope);
				scopePromise = ScopeStore.getById(scope.key);
			}else{
				scopePromise = ScopeStore.getById(scope);
			}

			scopePromise.then(function(scopeModel){

				var periodKeys = [];
				var periodModels = [];

				if (scopeModel.periods.length) {

					resolve({
						keys: self.getModelsKeys(scopeModel.periods),
						models: scopeModel.periods
					});

				} else {

					ThemeStore.getFiltered({scope: scopeModel}).then(function (themeModels) {

						if (!themeModels.length) {
							return reject("getPeriodsForScope: themes with filter {scope: " + scope + "} not find.");
						}

						for (let theme of themeModels) {
							if (!theme.hasOwnProperty("periods")) {
								return reject("getPeriodsForScope: no periods property in theme!");
							}
							for (let period of theme.periods) {
								periodKeys.push(period.key);
								periodModels.push(period);
							}
						}

						resolve({
							keys: _.uniq(periodKeys),
							models: _.uniq(periodModels)
						});

					}, function () {

						reject("getPeriodsForScope: theme with filter {scope: " + scope + "} not resolved.");

					});

				}
			});
		});
	},

	// todo merge with getAttSetsForScope
	getLayerTemplatesForScope: function(scope,layerType) {
		return new Promise(function(resolve, reject){

			var layerStore = GeneralLayerStore;
			if(
				layerType == ObjectTypes.VECTOR_LAYER_TEMPLATE
				|| layerType == "vector"
			) {
				layerStore = VectorLayerStore;
			} else if (
				layerType == ObjectTypes.RASTER_LAYER_TEMPLATE
				|| layerType == "raster"
			) {
				layerStore = RasterLayerStore;
			}

			var scopePromise = null;
			if(scope instanceof ScopeModel) {
				scopePromise = Promise.resolve(scope);
			}else{
				scopePromise = ScopeStore.getById(scope);
			}

			scopePromise.then(function(scopeModel){
				ThemeStore.getFiltered({scope: scopeModel}).then(function(themeModels){

					if(!themeModels.length){
						return reject("getLayerTemplatesForScope: themes with filter {scope: "+scope+"} not found.");
					}

					var retKeys = [];
					var retModels = [];
					var promises = [];

					for(let theme of themeModels){
						if(!theme.hasOwnProperty("topics")){
							return reject("getLayerTemplatesForScope: no topics property in theme!");
						}
						for(let topic of theme.topics){

							var layersPromise = layerStore.getFiltered({topic: topic});
							promises.push(layersPromise);
							layersPromise.then(function(layers){

								for(let layer of layers){
									retKeys.push(layer.key);
									retModels.push(layer);
								}

							}, function(){

								reject("getLayerTemplatesForScope: layers with filter {topic: " + topic + "} not resolved.");

							});

						}
					}

					Promise.all(promises).then(function(){
						resolve({
							keys: _.uniq(retKeys),
							models: _.uniq(retModels)
						});
					});


				}, function(){

					reject("getLayerTemplatesForScope: theme with filter {scope: " + scope + "} not resolved.");

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

	getThemesForTopics: function(topics) {
		return new Promise(function(resolve, reject){

			if(!Array.isArray(topics)) {
				topics = [topics];
			}
			var topicsPromises = [];
			for (var topic of topics) {
				if (topic instanceof TopicModel) {
					topicsPromises.push(Promise.resolve(topic));
				} else {
					topicsPromises.push(TopicStore.getById(topic));
				}
			}

			Promise.all(topicsPromises).then(function(topicModels){
				ThemeStore.getAll().then(function(themeModels){

					var themes = [];

					for(let theme of themeModels){
						if(theme.hasOwnProperty("topics")) {
							for (let topic of theme.topics) {
								if(
									_.contains(topicModels,topic) &&
									!_.contains(themes, theme)
								){
									themes.push(theme);
								}
							}
						}
					}

					//if (themes.length) {
					//	resolve(themes);
					//} else {
					//	resolve(null);
					//}
					resolve(themes);

				});
			});
		});
	},

	getAttSetsForLayers: function(layers) {
		return new Promise(function(resolve, reject){

			if(!Array.isArray(layers)) {
				layers = [layers];
			}
			var layersPromises = [];
			for (var layer of layers) {
				if (layer instanceof VectorLayerModel) {
					layersPromises.push(Promise.resolve(layer));
				} else {
					layersPromises.push(VectorLayerStore.getById(layer));
				}
			}

			Promise.all(layersPromises).then(function(layerModels){
				AttributeSetStore.getAll().then(function(attSetModels){

					var attSets = [];

					for(let attSet of attSetModels){
						if(attSet.hasOwnProperty("vectorLayers")) {
							for (let layer of attSet.vectorLayers) {
								if(_.contains(layerModels,layer)){
									attSets.push(attSet);
								}
							}
						}
					}

					//if (themes.length) {
					//	resolve(themes);
					//} else {
					//	resolve(null);
					//}
					resolve(attSets);

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

	deepCloneKeepModels: function(data) {
		var clone = data;
		if(
			_.isObject(data) &&
			!React.Component.isPrototypeOf(data)
			&& !(data instanceof GeneralModel)
		) {

			clone = _.clone(data);

			_.each(clone, function (value, key) {
				clone[key] = this.deepCloneKeepModels(value);
			}, this);

		}

		return clone;
	},

	clone: function(data) {
		var clone = data;
		if(
			_.isObject(data) &&
			!React.Component.isPrototypeOf(data)
		) {

			clone = _.clone(data);

			_.each(clone, function (value, key) {
				clone[key] = this.deepCloneKeepModels(value);
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


