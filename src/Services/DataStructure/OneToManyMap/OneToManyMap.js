
class OneToManyMap {

    constructor() {
        this._map = new Map();
    }

    keys(key) {
        return this._map.keys();
    }

    add(key, value) {
        let values = this._map.get(key);
        if (values === null || values === undefined) {
            values = new Set();
            this._map.set(key, values);
        }
        values.add(value);
    }

    get(key) {
        let values = this._map.get(key);
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
            this._map.delete(key);
        } else {
            let values = this._map.get(key);
            values.delete(value);
            if (values.size === 0) {
                this._map.delete(key);
            }
        }
    }

}

export default OneToManyMap;
