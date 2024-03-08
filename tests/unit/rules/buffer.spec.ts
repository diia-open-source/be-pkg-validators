import FastestValidator from 'fastest-validator'

import { BufferValidationRule } from '../../../src/rules'

describe('bufferValidationRule', () => {
    const rule = new BufferValidationRule()

    const validator = new FastestValidator({
        messages: {
            [rule.getName()]: rule.getMessage(),
        },
    })

    validator.add(rule.getName(), rule.getRule(validator))

    const compiledRule = validator.compile({
        buffer: {
            type: rule.getName(),
        },
    })

    it.each([Buffer.from('test')])('test valid buffer', async (buffer) => {
        expect(compiledRule({ buffer })).toBeTruthy()
    }) //

    it.each([1, 'string', false])('test invalid buffer %s', (buffer) => {
        expect(compiledRule({ buffer })).toEqual([
            {
                type: rule.getName(),
                actual: buffer,
                message: rule.getMessage().replace('{field}', rule.getName()),
                field: rule.getName(),
            },
        ])
    })
})
