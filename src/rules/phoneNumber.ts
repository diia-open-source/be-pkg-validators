import Fastest from 'fastest-validator'

import { Rule, RuleValidator } from '../interfaces/rule'
import { availableMobileCodes } from '../schemas'

export class PhoneNumberValidationRule implements Rule {
    private checkPattern: RegExp

    constructor() {
        this.checkPattern = new RegExp(`^38(${availableMobileCodes.map((code) => `0${code}`).join('|')})\\d{7}$`)
    }

    getName(): string {
        return 'phoneNumber'
    }

    getMessage(): string {
        return "The '{field}' field must be a string and valid phone number. E.g. 380xxxxxxx!"
    }

    getRule(validator: Fastest): RuleValidator {
        /**
         * Signature: function(value, field, parent, errors, context)
         */
        return ({ messages }): { source: string } => {
            const source = `
                if (typeof value !== 'string' || !${this.checkPattern.toString()}.test(value)) {
                    ${validator.makeError({ type: 'phoneNumber', actual: 'value', messages })}
                }

                return value;
            `

            return {
                source,
            }
        }
    }
}
