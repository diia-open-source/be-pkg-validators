import FastestValidator from 'fastest-validator'

import { ObjectIdValidationRule } from '../../../src/rules'

describe('bufferValidationRule', () => {
    const rule = new ObjectIdValidationRule()

    const validator = new FastestValidator({
        messages: {
            [rule.getName()]: rule.getMessage(),
        },
    })

    validator.add(rule.getName(), rule.getRule(validator))

    const compiledRule = validator.compile({
        objectId: {
            type: rule.getName(),
        },
    })

    it.each([
        '5f58e2b7b56b98724374908c',
        '60c5aaf0e347ee7088155b25',
        '5e12c3d4c2c825a6077b3e9d',
        '610257cbdcdb894f21e72e6f',
        '5d8f6a218f63b0028f40e562',
    ])('test valid objectId', async (objectId) => {
        expect(compiledRule({ objectId })).toBeTruthy()
    }) //

    it.each([1, 'string', false, 'asdfasdf123234234'])('test invalid objectId %s', (objectId) => {
        expect(compiledRule({ objectId })).toEqual([
            {
                type: rule.getName(),
                actual: objectId,
                message: rule.getMessage().replace('{field}', rule.getName()),
                field: rule.getName(),
            },
        ])
    })
})
