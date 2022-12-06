
class NestedMap {
	#structure = {}
	#action = null

	set(keyPieces, action) {
		console.log(keyPieces, this.#action)
		if (!keyPieces.length) {
			this.#action = action;
		} else {
			const nextKeyFrag = keyPieces.shift();
			let nextStructure = this.#structure[nextKeyFrag];
			if (!nextStructure) {
				nextStructure = new NestedMap();
				this.#structure[nextKeyFrag] = nextStructure;
			}
			nextStructure.set(keyPieces, action);
		}
	}

	get(keyPieces) {
		if (!keyPieces.length) {
			return this.#action;
		} else {
			const nextKeyFrag = keyPieces.shift();
			const nextStructure = this.#structure[nextKeyFrag];
			if (!nextStructure) {
				keyPieces.unshift(nextKeyFrag);
				return this.#action;
			} else {
				const action = nextStructure.get(keyPieces);
				if (action === null) {
					keyPieces.unshift(nextKeyFrag);
					action = this.#action;
				}
				return action;
			}
		}
	}
}

class ClosestMatchMap {
	#structure = new NestedMap();
	#charSplit = ''

	#splitKey(key) {
		const sKey = '' + key;
		if (sKey) {
			return sKey.split(this.#charSplit);
		}
		return '';
	}

	setCharacterToSplitOn(char) {
		this.#charSplit = char;
	}

	register(key, action) {
		const keyPieces = this.#splitKey(key);
		if (!keyPieces) return;

		this.#structure.set(keyPieces, action);
	}

	get(key) {
		const keyPieces = this.#splitKey(key);
		if (!keyPieces) return null;

		const clostestAction = this.#structure.get(keyPieces);

		return {
			remainingPath: keyPieces.join(''),
			action: clostestAction,
		};
	}
}
