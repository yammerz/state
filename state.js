/**
 * Clones an input
 * @param {*} input 
 * @returns { object } object clone
 */
 const clone = input => JSON.parse(JSON.stringify(input));

 /**
  * Returns whether the input is an object
  * @param {*} input 
  * @returns { boolean } true if input is object
  */
 const isObject = input => input != null && typeof input === 'object' && Array.isArray(input) === false;
 
/**
 * A class to manage state
 */
 export default class State {
	#privateState;
	constructor(){
		this.#privateState = {};
	}

	/**
	 * Gets the state by key if key exists
	 * @param { string } key 
	 * @returns a clone of the property value.
	 */
	getStateKey(key){
		let state = false;

		if(Object.hasOwn(this.#privateState, key)){
			state = this.#privateState[key];
		}

		return clone(state);
	}

	/**
	 * @returns a clone of the state object
	 */
	getState(){
		return clone(this.#privateState);
	}

	/**
	 * @param { object } object 
	 * @returns { object } new state object clone
	 */
	setState(object) {

		if (!isObject(object)){
			throw new Error('value must be a object');
		} 

		const currentState = clone(this.#privateState);

		//set new state
		//changes only the prop that has changed
		const newState = Object.assign(clone(currentState), object);

		//The private class property '#privateState' makes the 
		//current state immutable, so props cannot be set directly.
		this.#privateState = newState;
		return newState;
	}

 
}
