
class ImmutableSet extends Set {
    _isSealed = false

    constructor(baseValues) {
        super(baseValues)
    }

    add() {
        if (this._isSealed) {
            throw 'This Set is immutable and cannot be modified'
        } else {
            super.add.apply(this, arguments)
        }
    }
    delete() {
        if (this._isSealed) {
            throw 'This Set is immutable and cannot be modified'
        } else {
            super.delete.apply(this, arguments)
        }
    }
    clear() {
        if (this._isSealed) {
            throw 'This Set is immutable and cannot be modified'
        } else {
            super.clear.apply(this)
        }
    }

    seal() {
        this._isSealed = true
        Object.freeze(this)
    }
}

export default ImmutableSet;
