import FastestValidator from 'fastest-validator'

import { availableMobileCodes } from '../../../src'
import { PhoneNumberValidationRule } from '../../../src/rules'

describe('phoneNumberValidationRule', () => {
    const rule = new PhoneNumberValidationRule()

    const validator = new FastestValidator({
        messages: {
            [rule.getName()]: rule.getMessage(),
        },
    })

    validator.add(rule.getName(), rule.getRule(validator))

    const compiledRule = validator.compile({
        phoneNumber: {
            type: rule.getName(),
        },
    })

    it.each([['380' + availableMobileCodes[0] + '1234567'], ['380' + availableMobileCodes[1] + '9876543']])(
        'test valid phone number %s',
        async (phoneNumber) => {
            expect(compiledRule({ phoneNumber })).toBeTruthy()
        },
    ) //

    it.each([['3801111111'], ['380' + availableMobileCodes[0] + '123']])('test invalid phone number %s', (phoneNumber) => {
        expect(compiledRule({ phoneNumber })).toEqual([
            {
                type: rule.getName(),
                actual: phoneNumber,
                message: rule.getMessage().replace('{field}', rule.getName()),
                field: rule.getName(),
            },
        ])
    })
})
