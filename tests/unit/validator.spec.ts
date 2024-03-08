import { ValidationError } from '@diia-inhouse/errors'

import { AppValidator } from '../../src/validator'

describe('AppValidator', () => {
    let appValidator: AppValidator

    beforeEach(() => {
        appValidator = new AppValidator()
    })

    it('should compile and validate schema correctly', async () => {
        const schema = {
            id: 'number',
            name: 'string',
            email: 'email',
        }

        const validateFn = appValidator.compile(schema)

        expect(validateFn({ id: 1, name: 'John Doe', email: 'john@example.com' })).toBe(true)
        expect(() => {
            validateFn({ id: 'invalid', name: 'John Doe', email: 'john@example.com' })
        }).toThrow(ValidationError)
    })

    it('should throw a ValidationError when validation fails', () => {
        const schema = {
            id: 'number',
            name: 'string',
            email: 'email',
        }

        expect(() => {
            appValidator.validate({ id: 'invalid', name: 'John Doe', email: 'john@example.com' }, schema)
        }).toThrow(ValidationError)
    })
})
