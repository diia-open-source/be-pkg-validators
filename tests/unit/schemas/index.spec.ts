import { ValidationError } from '@diia-inhouse/errors'

import { AppValidator, getStringDateSchema } from '../../../src'

function expectValidationError(fn: () => unknown, expectedMessage: string): void {
    let thrown: ValidationError | undefined

    try {
        fn()
    } catch (err) {
        thrown = err as ValidationError
    }

    expect(thrown).toBeInstanceOf(ValidationError)

    const { errors } = thrown!.getData() as { errors: { messages: string; field: string }[] }

    expect(errors).toEqual(
        expect.arrayContaining([
            {
                field: 'date',
                message: "The 'date' field must be a string.",
                messages: expectedMessage,
                type: 'string',
            },
        ]),
    )
}

describe('getStringDateSchema', () => {
    let appValidator: AppValidator

    beforeEach(() => {
        appValidator = new AppValidator()
    })

    it('should validate date in dd.MM.yyyy format', () => {
        const schema = {
            date: getStringDateSchema('dd.MM.yyyy'),
        }

        const validateFn = appValidator.compile(schema)

        expect(validateFn({ date: '25.12.2023' })).toBe(true)
        expect(validateFn({ date: '31.12.2023' })).toBe(true)

        expectValidationError(() => validateFn({ date: '32.12.2023' }), 'The date must be a valid date string dd.MM.yyyy format!')
        expectValidationError(() => validateFn({ date: '2023-12-25' }), 'The date must be a valid date string dd.MM.yyyy format!')
    })

    it('should validate date in yyyy-MM-dd format', () => {
        const schema = {
            date: getStringDateSchema('yyyy-MM-dd'),
        }

        const validateFn = appValidator.compile(schema)

        expect(validateFn({ date: '2023-12-25' })).toBe(true)
        expect(validateFn({ date: '2023-12-31' })).toBe(true)

        expectValidationError(() => validateFn({ date: '2023-13-25' }), 'The date must be a valid date string yyyy-MM-dd format!')
        expectValidationError(() => validateFn({ date: '25.12.2023' }), 'The date must be a valid date string yyyy-MM-dd format!')
    })

    it('should validate ISO date string format', () => {
        const schema = {
            date: getStringDateSchema(`yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`),
        }

        const validateFn = appValidator.compile(schema)

        expect(validateFn({ date: '2023-12-25T14:30:00.000Z' })).toBe(true)
        expect(validateFn({ date: '2024-01-01T00:00:00.000Z' })).toBe(true)

        expectValidationError(
            () => validateFn({ date: '2023-13-25T14:30:00.000+02:00' }),
            `The date must be a valid date string yyyy-MM-dd'T'HH:mm:ss.SSS'Z' format!`,
        )
        expectValidationError(
            () => validateFn({ date: '2023-12-25 14:30:00' }),
            `The date must be a valid date string yyyy-MM-dd'T'HH:mm:ss.SSS'Z' format!`,
        )
    })

    it('should respect optional parameter', () => {
        const mandatorySchema = {
            date: getStringDateSchema('yyyy-MM-dd', false),
        }
        const optionalSchema = {
            date: getStringDateSchema('yyyy-MM-dd', true),
        }

        const validateMandatory = appValidator.compile(mandatorySchema)
        const validateOptional = appValidator.compile(optionalSchema)

        expectValidationError(() => validateMandatory({}), 'The date is required in the yyyy-MM-dd format!')
        expectValidationError(() => validateMandatory({ date: '' }), 'The date is required in the yyyy-MM-dd format!')
        expect(validateOptional({})).toBe(true)
    })
})
