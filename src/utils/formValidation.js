export const required = value => (value ? undefined : 'Обазательно к заполнению');

export const maxLength = max => value => {
    value = value || '';
    return value.length > max ? `Длина значения не должна быть более ${max} символов` : undefined;
};

export const minLength = min => value => {
    value = value || '';
    return value.length < min ? `Длина значения не должна быть менее ${min} символов` : undefined;
};

export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Неверный адрес' : undefined;
