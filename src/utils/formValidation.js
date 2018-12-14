import { SubmissionError } from 'redux-form';

export const required = value => (value ? undefined : 'Обазательно к заполнению');

/**
 * Максимальная длина
 * @param max
 * @returns {function(*=): *}
 */
export const maxLength = max => value => {
    value = value || '';
    return value.length > max ? `Длина значения не должна быть более ${max} символов` : undefined;
};

/**
 * Минимальная длина
 * @param min
 * @returns {function(*=): *}
 */
export const minLength = min => value => {
    value = value || '';
    return value.length < min ? `Длина значения не должна быть менее ${min} символов` : undefined;
};

/**
 * Формат емейла
 * @param value
 * @returns {*}
 */
export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Неверный адрес' : undefined;

export function processServerValidationError(err) {
    if (err.status === 422) {
        const errObject = {};
        err.response.body.errors.forEach(({ param, msg }) => {
            errObject[param] = msg;
        });
        throw new SubmissionError(errObject);
    }
}
