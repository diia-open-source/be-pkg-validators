import FastestValidator, { ValidationSchema } from 'fastest-validator'

import { ErrorCode, ErrorType, ValidationError, ValidationErrorField } from '@diia-inhouse/errors'

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

        this.validator = new FastestValidator({ messages: this.getCustomValidatorsMessages(), useNewCustomCheckerFunction: true })

        this.addCustomValidationRules()
    }

    compile(schema: ValidationSchema): (params: unknown) => boolean {
        return (params: unknown): boolean => this.validate(params, schema)
    }

    validate(params: unknown, schema: ValidationSchema, errorType?: ErrorType): boolean {
        const res = this.validator.validate(params as Record<string, unknown>, schema) as true | ValidationErrorField[]

        if (res !== true) {
            throw new ValidationError(res, ErrorCode.ValidationError, errorType)
        }

        return true
    }

    private getCustomValidatorsMessages(): Record<string, string> {
        const res: Record<string, string> = {}

        for (const rule of this.customRules) {
            res[rule.getName()] = rule.getMessage()
        }

        return res
    }

    private addCustomValidationRules(): void {
        for (const rule of this.customRules) {
            this.validator.add(rule.getName(), rule.getRule(this.validator))
        }
    }
}
