import Fastest, { MessagesType, ValidationSchema } from 'fastest-validator'

export type RuleValidator = (param: { messages: MessagesType; schema: ValidationSchema }) => { source: string; sanitized?: boolean }

export interface Rule {
    getName(): string
    getMessage(): string
    getRule(validator: Fastest): RuleValidator
}
