import ImmutableSet from './ImmutableSet'

class MapOneToMany {
    #map = new Map()

    constructor() {
    }

    keys(key) {
        return this.#map.keys();
    }

    has(key) {
        return this.#map.has(key);
    }

    get size() {
        return this.#map.size
    }

    add(key, value) {
        let values = this.#map.get(key);
        if (values === null || values === undefined) {
            values = new Set();
            this.#map.set(key, values);
        }
        return values.add(value);
    }

    get(key) {
        let values = this.#map.get(key);
        values = new ImmutableSet(values);
        values.seal()

        return values;
    }

    remove(key, value) {
        let status = null
        if (value === null || value === undefined) {
            // remove all values for key
            status = this.#map.delete(key);
        } else {
            let values = this.#map.get(key);
            status = values.delete(value);
            if (values.size === 0) {
                status = this.#map.delete(key);
            }
        }

        return status
    }

}

export default MapOneToMany;
