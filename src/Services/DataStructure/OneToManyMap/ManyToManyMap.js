import OneToManyMap from './OneToManyMap'

class MapManyToMany {
    #mapRightToLefts = new OneToManyMap()
    #mapLeftToRights = new OneToManyMap()

    #getFromMap(map, key) {

    }

    constructor(typeOfLeftSide, typeOfRightSide) {
        const nameGetLeftsOfRight = `get${typeOfLeftSide}sOf${typeOfRightSide}`
        this[nameGetLeftsOfRight] = (rightSide) => {
            return this.#mapRightToLefts.get(rightSide)
        }

        const nameGetRightsOfLeft = `get${typeOfRightSide}sOf${typeOfLeftSide}`
        this[nameGetRightsOfLeft] = (leftSide) => {
            return this.#mapLeftToRights.get(leftSide)
        }

        const nameLinkLeftToRight = `link${typeOfLeftSide}To${typeOfRightSide}`
        this[nameLinkLeftToRight] = (leftSide, rightSide) => {
            return this.#mapRightToLefts.add(rightSide, leftSide)
        }
        const nameLinkRightToLeft = `link${typeOfRightSide}To${typeOfLeftSide}`
        this[nameLinkRightToLeft] = (rightSide, leftSide) => {
            return this.#mapLeftToRights.add(leftSide, rightSide)
        }

    }

    remove(key) {
        const leftSideValues = this.#mapRightToLefts.get(key)
        for (const leftSideValue of leftSideValues) {
            this.#mapLeftToRights.remove(leftSideValue, key)
        }
        this.#mapRightToLefts.remove(key)

        const rightSideValues = this.#mapLeftToRights.get(key)
        for (const rightSideValue of rightSideValues) {
            this.#mapRightToLefts.remove(rightSideValues, key)
        }
        this.#mapLeftToRights.remove(key)
    }
}

export default MapManyToMany;
