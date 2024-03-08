import FastestValidator, { ValidationSchema } from 'fastest-validator'

import { ErrorCode, ValidationError, ValidationErrorField } from '@diia-inhouse/errors'

import { Rule } from './interfaces/rule'
import { BufferValidationRule, DateValidationRule, ObjectIdValidationRule, PhoneNumberValidationRule, VersionValidationRule } from './rules'
import { InternationalPhoneNumberValidationRule } from './rules/internationalPhoneNumber'

export class AppValidator {
    private readonly validator: FastestValidator

    private customRules: Rule[]

    constructor() {
        this.customRules = [
            new BufferValidationRule(),
            new DateValidationRule(),
            new ObjectIdValidationRule(),
            new PhoneNumberValidationRule(),
            new InternationalPhoneNumberValidationRule(),
            new VersionValidationRule(),
        ]

        this.validator = new FastestValidator({ messages: this.getCustomValidatorsMessages() })

        this.addCustomValidationRules()
    }

    compile(schema: ValidationSchema): (params: unknown) => boolean {
        return (params: unknown): boolean => this.validate(params, schema)
    }

    validate(params: unknown, schema: ValidationSchema): boolean {
        const res = <true | ValidationErrorField[]>this.validator.validate(<Record<string, unknown>>params, schema)

        if (res !== true) {
            throw new ValidationError(res, ErrorCode.ValidationError)
        }

        return true
    }

    private getCustomValidatorsMessages(): Record<string, string> {
        const res: Record<string, string> = {}

        this.customRules.forEach((rule: Rule) => {
            res[rule.getName()] = rule.getMessage()
        })

        return res
    }

    private addCustomValidationRules(): void {
        this.customRules.forEach((rule: Rule) => {
            this.validator.add(rule.getName(), rule.getRule(this.validator))
        })
    }
}
