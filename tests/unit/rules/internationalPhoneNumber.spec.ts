import FastestValidator from 'fastest-validator'

import { InternationalPhoneNumberValidationRule } from '../../../src/rules'

describe('internationalPhoneNumberValidationRule', () => {
    const rule = new InternationalPhoneNumberValidationRule()

    const validator = new FastestValidator({
        messages: {
            [rule.getName()]: rule.getMessage(),
        },
    })

    validator.add(rule.getName(), rule.getRule(validator))

    const compiledRule = validator.compile({
        internationalPhoneNumber: {
            type: rule.getName(),
        },
    })

    it.each([
        '+1234567890',
        '123-456-7890',
        '123.456.7890',
        '+1 (123) 456-7890',
        '+12 (123) 456-7890',
        '+123 (123) 456-7890',
        '+1234 (123) 456-7890',
        '+12345 (123) 456-7890',
        '+123 (123) 456-7890',
        '+123 (123) 456-789012345678',
    ])('test valid phone number %s', async (internationalPhoneNumber) => {
        expect(compiledRule({ internationalPhoneNumber })).toBeTruthy()
    }) //

    it.each(['+1234', '+12 (123) 456-7890x123'])('test invalid phone number %s', (internationalPhoneNumber) => {
        expect(compiledRule({ internationalPhoneNumber })).toEqual([
            {
                type: rule.getName(),
                actual: internationalPhoneNumber,
                message: rule.getMessage().replace('{field}', rule.getName()),
                field: rule.getName(),
            },
        ])
    })
})
