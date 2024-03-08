import Fastest from 'fastest-validator'

import { Rule, RuleValidator } from '../interfaces/rule'

export class InternationalPhoneNumberValidationRule implements Rule {
    private checkPattern = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/g

    getName(): string {
        return 'internationalPhoneNumber'
    }

    getMessage(): string {
        return "The '{field}' field must be a string and valid international phone number!"
    }

    getRule(validator: Fastest): RuleValidator {
        /**
         * Signature: function(value, field, parent, errors, context)
         */
        return ({ messages }): { source: string } => {
            const source = `
                if (typeof value !== 'string' || !${this.checkPattern.toString()}.test(value)) {
                    ${validator.makeError({ type: 'internationalPhoneNumber', actual: 'value', messages })}
                }

                return value;
            `

            return {
                source,
            }
        }
    }
}
