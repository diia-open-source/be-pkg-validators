/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'bson'

export type RuleType =
    | 'any'
    | 'boolean'
    | 'number'
    | 'email'
    | 'object'
    | 'string'
    | 'enum'
    | 'uuid'
    | 'array'
    | 'forbidden'
    | 'function'
    | 'date'
    | 'customDate'
    | 'objectId'
    | 'version'
    | 'phoneNumber'
    | 'internationalPhoneNumber'
    | 'buffer'
    | 'record'

interface BasicRule<T extends RuleType> {
    type: T
    optional?: boolean
    default?: unknown
    null?: boolean
}

interface Sanitazible {
    convert?: boolean
}

export interface NumberRule extends BasicRule<'number'>, Sanitazible {
    min?: number
    max?: number
    equal?: number
    notEqual?: number
    integer?: boolean
    positive?: boolean
    negative?: boolean
}

export interface ArrayRule<T = null> extends BasicRule<'array'> {
    items?: ValidationProperty<T>
    empty?: boolean
    min?: number
    max?: number
    length?: number
    contains?: any
    enum?: any[]
    unique?: boolean
}

export interface ObjectRule<T = null> extends BasicRule<'object'> {
    props?: ValidationSchema<T>
    strict?: boolean
}

export interface RecordRule<K, V> extends BasicRule<'record'> {
    key: EnumRule<K>
    value: ValidationProperty<V> | ValidationProperty<V>[]
}

export interface StringRule extends BasicRule<'string'> {
    empty?: boolean
    min?: number
    max?: number
    length?: number
    pattern?: any
    contains?: any
    enum?: string[]
    alpha?: boolean
    numeric?: boolean
    alphanum?: boolean
    alphadash?: boolean
    uppercase?: boolean
}

export interface EmailRule extends BasicRule<'email'> {
    mode?: string
}

export interface VersionRule extends BasicRule<'version'>, Sanitazible {
    versions?: string[]
}

export interface EnumRule<T = any> extends BasicRule<'enum'> {
    values: T[]
}

export interface DateRule extends BasicRule<'date'>, Sanitazible {
    format?: string
}

export interface ListValidationSchema {
    skip: NumberRule
    limit: NumberRule
}

export interface CustomDateRule extends BasicRule<'customDate'>, Sanitazible {}

export interface ObjectIdRule extends BasicRule<'objectId'>, Sanitazible {}

export interface BooleanRule extends BasicRule<'boolean'>, Sanitazible {}

type CommonRule = BasicRule<'any' | 'forbidden'> | EnumRule

type ComplexRule =
    | StringRule
    | NumberRule
    | BooleanRule
    | ArrayRule
    | ObjectRule
    | DateRule
    | CustomDateRule
    | EmailRule
    | EnumRule
    | ObjectIdRule
    | RecordRule<string, unknown>
    | VersionRule

type ValidationProperty<T = null> = T extends null
    ? ValidationRule
    : T extends string
    ? StringRule | EmailRule | VersionRule | BasicRule<'uuid' | 'phoneNumber' | 'internationalPhoneNumber'>
    : T extends number
    ? NumberRule
    : T extends boolean
    ? BooleanRule
    : T extends Date
    ? DateRule | CustomDateRule | StringRule
    : T extends Buffer
    ? BasicRule<'buffer'>
    : T extends ObjectId
    ? ObjectIdRule | StringRule
    : T extends ArrayLike<infer U>
    ? ArrayRule<U>
    : T extends object
    ? ObjectRule<T> | RecordRule<keyof T, Required<T>[keyof T]>
    : ValidationRule

type Rule = string | boolean | ComplexRule | CommonRule | BasicRule<Exclude<RuleType, CommonRule['type'] | ComplexRule['type']>>

export type ValidationRule<T = null> = T extends null
    ? Rule
    : T extends object
    ? ObjectRule<T>
    : T extends ArrayLike<infer U>
    ? ArrayRule<U>
    : Rule

export type ValidationSchema<T = null> = T extends null
    ? { [path: string]: ValidationRule | ValidationRule[] }
    : { [path in keyof Required<T>]: ValidationProperty<T[path]> | ValidationProperty<T[path]>[] | CommonRule }
