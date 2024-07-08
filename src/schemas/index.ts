import fromPairs from 'lodash.frompairs'

import { AppVersions, PlatformType } from '@diia-inhouse/types'

import { ListValidationSchema, ObjectRule } from '../interfaces'
import { ParameterValidation } from '../interfaces/schema'

export const availableMobileCodes: string[] = [
    '39',
    '50',
    '63',
    '66',
    '67',
    '68',
    '73',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99',
]

export const phoneNumberValidation: ParameterValidation = {
    regexp: `^\\+380(${availableMobileCodes.join('|')})\\d{7}$`,
    flags: ['i', 'g'],
    errorMessage: 'Упс, ви ввели неправильний номер телефону. Використовуйте формат + 38 (0ХХ) ХХХ ХХ ХХ.',
}

export const emailValidation: ParameterValidation = {
    regexp: '^([a-zA-Z0-9_%+-]{1,}.{0,1}){0,}[a-zA-Z0-9_%+-]{1,}@([a-zA-Z0-9_%+-]{1,}.{0,1}){1,}[A-Za-z]{2,64}$',
    flags: ['i'],
    errorMessage: 'Упс, ви ввели неправильний email. Виправте дані або спробуйте іншу пошту.',
}

export const emailRuValidation: ParameterValidation = {
    regexp: '^([a-zA-Z0-9_%+-]{1,}.{0,1}){0,}[a-zA-Z0-9_%+-]{1,}@([a-zA-Z0-9_%+-]{1,}.{0,1}){1,}(?!ru|su)[A-Za-z]{2,64}$',
    flags: ['i'],
    errorMessage: 'Йой, це ж електронна адреса з російським доменом. Ми не можемо її прийняти. Спробуйте іншу скриньку, будь ласка.',
}

export const shortTextValidation: ParameterValidation = {
    regexp: String.raw`^([a-z]|[а-яґєії]|\d|-|—|/|\s){1,10}$`,
    flags: ['i'],
    errorMessage: 'Введіть номер до 10 знаків, не використовуйте спецсимволи, окрім «-, /»',
}

export const zipValidation: ParameterValidation = {
    regexp: String.raw`^\d{5}$`,
    flags: [],
    errorMessage: 'Введіть індекс з 5 цифр',
}

/** @deprecated use getListValidationSchema function instead */
export const listValidationSchema: ListValidationSchema = {
    skip: { type: 'number', convert: true, min: 0, optional: true },
    limit: { type: 'number', convert: true, min: 0, max: 100, optional: true },
}

export function getListValidationSchema(min = 0, max = 100): ListValidationSchema {
    return {
        skip: { type: 'number', convert: true, min, optional: true },
        limit: { type: 'number', convert: true, min, max, optional: true },
    }
}

export const appVersionsValidationSchema: ObjectRule<AppVersions> = {
    type: 'object',
    props: {
        versions: {
            type: 'object',
            optional: true,
            props: fromPairs(
                Object.values(PlatformType).map((platformType) => [
                    platformType,
                    { type: 'array', items: { type: 'string' }, optional: true },
                ]),
            ),
        },
        minVersion: {
            type: 'object',
            optional: true,
            props: fromPairs(Object.values(PlatformType).map((platformType) => [platformType, { type: 'string', optional: true }])),
        },
        maxVersion: {
            type: 'object',
            optional: true,
            props: fromPairs(Object.values(PlatformType).map((platformType) => [platformType, { type: 'string', optional: true }])),
        },
    },
    optional: true,
}
