import logger from '../core/Logger';

class LoadingCounter {

	constructor(){
		this.operationsCount = 0;
	}

	increase(){
		this.operationsCount++;
		logger.info("LoadingCounter#increase: Increased to " + this.operationsCount);
		return this.operationsCount;
	}

	decrease(){
		this.operationsCount--;
		if(this.operationsCount < 0){
			logger.warn("LoadingCounter#decrease: operationsCount below zero! Possibly forgotten to increase before operation. (" + this.operationsCount + ")");
			this.operationsCount = 0;
		}
		logger.info("LoadingCounter#decrease: Decreased to " + this.operationsCount);
		return this.operationsCount;
	}

	getCount(){
		return this.operationsCount;
	}

}

let instance = new LoadingCounter();

export default instance;
