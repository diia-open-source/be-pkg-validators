import Fastest, { MessagesType, ValidationSchema } from 'fastest-validator'

import { Rule, RuleValidator } from '../interfaces/rule'

const PATTERN = /^v\d{1,}$/

/**
 * @deprecated
 */
export class VersionValidationRule implements Rule {
    getName(): string {
        return 'version'
    }

    getMessage(): string {
        return "The '{field}' field must be a valid version provided. E.g. v1"
    }

    getRule(validator: Fastest): RuleValidator {
        /**
         * Signature: function(value, field, parent, errors, context)
         */
        return ({ schema, messages }: { schema: ValidationSchema; messages: MessagesType }): { source: string } => {
            const src: string[] = []

            src.push(`
                if (typeof value !== 'string') {
                    ${validator.makeError({ type: 'string', actual: 'value', messages })}
                    return value;
                }
            `)

            if (Array.isArray(schema.versions) && schema.versions.length) {
                const { versions } = schema

                src.push(`
                    if (!${JSON.stringify(versions)}.includes(value)) {
                        ${validator.makeError({ type: 'version', expected: `'${versions.join(', ')}'`, actual: 'value', messages })}
                        return value;
                    }
                `)
            }

            src.push(`
                if (!${PATTERN.toString()}.test(value)) {
                    ${validator.makeError({ type: 'version', actual: 'value', messages })}
                }

                return value;
            `)

            return {
                source: src.join('\n'),
            }
        }
    }
}
