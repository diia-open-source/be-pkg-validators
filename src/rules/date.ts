import Fastest from 'fastest-validator'

import { Rule, RuleValidator } from '../interfaces/rule'

export class DateValidationRule implements Rule {
    constructor(private readonly checkPattern: RegExp = /\d{2}\.\d{2}\.\d{4}/) {}

    getName(): string {
        return 'customDate'
    }

    getMessage(): string {
        return "The '{field}' field must be a valid date string format (DD.MM.YYYY)!"
    }

    getRule(validator: Fastest): RuleValidator {
        /**
         * Signature: function(value, field, parent, errors, context)
         */
        return ({ schema, messages }): { sanitized: boolean; source: string } => {
            let sanitized = false
            const src: string[] = [
                `
                if (typeof value !== 'string' || !${this.checkPattern.toString()}.test(value)) {
                    ${validator.makeError({ type: 'customDate', actual: 'value', messages })}
                }
            `,
            ]

            if (schema.convert === true) {
                sanitized = true
                src.push(`
                    var origValue = value;
                    if (!(value instanceof Date)) {
                        var parts = origValue.split('.');
                        value = new Date(Date.UTC(parts[2], parts[1] - 1, parts[0]));
                        if (isNaN(value)) {
                            ${validator.makeError({ type: 'customDate', actual: 'origValue', messages })}
                        }
                    }
                `)
            }

            src.push('return value;')

            return {
                sanitized,
                source: src.join('\n'),
            }
        }
    }
}
