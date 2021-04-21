
import OneToManyMap from './OneToManyMap'

describe('One to Many Map Tests', () => {
    it('set value create backing set', () => {
        const otmMap = new OneToManyMap()
        otmMap.add(123, 456)

        const values = otmMap.get(123)
        expect(values.size).toEqual(1)
        expect(Array.from(values)[0]).toEqual(456)
    })
})
