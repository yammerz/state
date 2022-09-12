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
 
export default class State {
	constructor(){
		this.lastUid = -1;
		this.keys = {};
		this.internalState = {};
	}

	/**
	 * Subscribe. Sets a state object key and callback
	 * @param { string } key 
	 * @param { function } func 
	 * @returns { string } token
	 */
	subscribe(key, func){
        
		// key is not registered yet
		if ( !Object.hasOwn(this.keys, key ) ){
			this.keys[key] = [];
		}

		var token = (++this.lastUid).toString();

		this.keys[key].push( { token : token, func : func } );

		// return token for unsubscribing
		return token;
	}

	/**
	 * Unsubscribes with token. Remove State key and callback.
	 * @param { string } token 
	 * @returns { string | boolean } token or false
	 */
	unsubscribe( token ){

		let keys = this.keys;

		for ( var m in keys ){

			if ( Object.hasOwn(keys, m ) ){

				for ( var i = 0, j = keys[m].length; i < j; i++ ){

					if ( keys[m][i].token === token ){

						keys[m].splice( i, 1 );

						return token;

					}

				}

			}

		}

		return false;

	}

	publish(key, data){

		const self = this;

		if ( !Object.hasOwn(this.keys, key ) ){
			return false;
		}

		var notify = function(){

			var subscribers = self.keys[key],

				throwException = function(e){

					return function(){

						throw e;

					};

				}; 

			for ( var i = 0, j = subscribers.length; i < j; i++ ){

				try {
					//call callback
					subscribers[i].func( key, ...data );

				} catch( e ){

					setTimeout( throwException(e), 0);

				}

			}

		};

		setTimeout( notify , 0 );

		return true;
	}

	getState(key){
		return this.internalState[key];
	}

	setState(object) {
		if (!isObject(object)) throw new Error('value must be a object');
		const currentState = clone(this.internalState);
		const nextState = Object.assign(clone(currentState), object);
		this.internalState = nextState;
		return nextState;
	}

 
}
