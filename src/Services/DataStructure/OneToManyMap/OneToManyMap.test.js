
import MapOneToMany from './MapOneToMany'

describe('One to Many Map Tests', () => {
    describe('values set is immutable', () => {
        describe('from null', () => {
            let values = null
            beforeEach(() => {
                const otmMap = new MapOneToMany()
                values = otmMap.get()
            })

            it('add throws error', () => {
                expect(() => {values.add(333)}).toThrow();
            })

            it('delete throws error', () => {
                expect(() => {values.delete(333)}).toThrow();
            })

            it('clear throws error', () => {
                expect(() => {values.clear()}).toThrow();
            })
        })

        describe('from value', () => {
            let values = null
            beforeEach(() => {
                const otmMap = new MapOneToMany()
                otmMap.add(123, 456)
                values = otmMap.get(123)
            })

            it('add throws error', () => {
                expect(() => {values.add(333)}).toThrow();
            })

            it('delete throws error', () => {
                expect(() => {values.delete(456)}).toThrow();
            })

            it('clear throws error', () => {
                expect(() => {values.clear()}).toThrow();
            })
        })
    })

    describe('non-empty map', () => {
        let testMap = null
        beforeEach(() => {
            const otmMap = new MapOneToMany()
            otmMap.add(123, 456)
            otmMap.add(123, 789)
            otmMap.add(111, 333)

            testMap = otmMap
        })

        it('get', () => {
            expect(testMap.size).toEqual(2)
            const values = testMap.get(123)
            expect(values.size).toEqual(2)
        })

        it('removing key, destroys backing values set', () => {
            testMap.remove(123)

            expect(testMap.size).toEqual(1)
            const keys = Array.from(testMap.keys())
            expect(keys).toContain(111)
            expect(keys).not.toContain(123)
        })

        it('removing one value, of multiples', () => {
            testMap.remove(123, 456)

            expect(testMap.size).toEqual(2)
            const values = testMap.get(123)
            expect(values).not.toContain(456)
            expect(values).toContain(789)
            expect(values.size).toEqual(1)
        })

        it('removing last value, destroys backing values set', () => {
            testMap.remove(111, 333)

            const keys = Array.from(testMap.keys())
            expect(keys).not.toContain(111)
            expect(keys).toContain(123)
            expect(keys.length).toEqual(1)
            expect(testMap.size).toEqual(1)
        })
    })

})
