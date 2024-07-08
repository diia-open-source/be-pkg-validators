import Fastest, { MessagesType } from 'fastest-validator'

import { Rule, RuleValidator } from '../interfaces/rule'

const PATTERN = /^[\da-f]{24}$/i

export class ObjectIdValidationRule implements Rule {
    getName(): string {
        return 'objectId'
    }

    getMessage(): string {
        return "The '{field}' field must be an objectId string!"
    }

    getRule(validator: Fastest): RuleValidator {
        /**
         * Signature: function(value, field, parent, errors, context)
         */
        return ({ messages }: { messages: MessagesType }): { source: string } => {
            const source = `
                if (typeof value !== 'string' || !${PATTERN.toString()}.test(value)) {
                    ${validator.makeError({ type: 'objectId', actual: 'value', messages })}
                }

                return value;
            `

            return {
                source,
            }
        }
    }
}
