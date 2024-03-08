import FastestValidator from 'fastest-validator'

import { DateValidationRule } from '../../../src/rules'

describe('dateValidationRule', () => {
    const rule = new DateValidationRule()

    const validator = new FastestValidator({
        messages: {
            [rule.getName()]: rule.getMessage(),
        },
    })

    validator.add(rule.getName(), rule.getRule(validator))

    describe('default behavior', () => {
        const compiledRule = validator.compile({
            customDate: {
                type: rule.getName(),
            },
        })

        it.each([new Date().toLocaleString()])('test valid date', async (customDate) => {
            expect(compiledRule({ customDate })).toBeTruthy()
        }) //

        it.each([1, 'string', false, new Date('foo').toLocaleString()])('test invalid date %s', (customDate) => {
            expect(compiledRule({ customDate })).toEqual([
                {
                    type: rule.getName(),
                    actual: customDate,
                    message: rule.getMessage().replace('{field}', rule.getName()),
                    field: rule.getName(),
                },
            ])
        })
    })

    describe('convert', () => {
        const compiledRule = validator.compile({
            customDate: {
                type: rule.getName(),
                convert: true,
            },
        })

        it.each([new Date().toLocaleString()])('test valid date with converting', async (customDate) => {
            expect(compiledRule({ customDate })).toBeTruthy()
        }) //
    })
})
