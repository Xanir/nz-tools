import MapOneToMany from './MapOneToMany'

class MapManyToMany {
    #mapRightToLefts = new MapOneToMany()
    #mapLeftToRights = new MapOneToMany()

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
            this.#mapLeftToRights.add(leftSide, rightSide)
            this.#mapRightToLefts.add(rightSide, leftSide)
        }
        const nameLinkRightToLeft = `link${typeOfRightSide}To${typeOfLeftSide}`
        this[nameLinkRightToLeft] = (rightSide, leftSide) => {
            this.#mapLeftToRights.add(leftSide, rightSide)
            this.#mapRightToLefts.add(rightSide, leftSide)
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
