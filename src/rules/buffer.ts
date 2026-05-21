import Fastest, { MessagesType } from 'fastest-validator'

import { Rule, RuleValidator } from '../interfaces/rule.js'

export class BufferValidationRule implements Rule {
    getName(): string {
        return 'buffer'
    }

    getMessage(): string {
        return "The '{field}' field must be an Buffer object!"
    }

    getRule(validator: Fastest): RuleValidator {
        /**
         * Signature: function(value, field, parent, errors, context)
         */
        return ({ messages }: { messages: MessagesType }) => {
            const source = `
                if (!value || !(Buffer.isBuffer(value) || value.type === 'Buffer')) {
                    ${validator.makeError({ type: 'buffer', actual: 'value', messages })}
                    return value;
                }

                return value;
            `

            return {
                source,
            }
        }
    }
}
