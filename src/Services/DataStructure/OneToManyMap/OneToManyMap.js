
class OneToManyMap {
    #map = new Map()

    constructor() {
    }

    keys(key) {
        return this.#map.keys();
    }

    has(key) {
        return this.#map.has(key);
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
        if (values) {
            // clone map
            values = new Set(values);
        } else {
          values = new Set(values);
        }

        return values;
    }

    remove(key, value) {
        if (value === null || value === undefined) {
            // remove all values for key
            return this.#map.delete(key);
        } else {
            let values = this.#map.get(key);
            return values.delete(value);
            if (values.size === 0) {
                return this.#map.delete(key);
            }
        }
    }

    get size() {
        return this.#map.size
    }

}

export default OneToManyMap;
