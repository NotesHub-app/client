import * as Immutable from 'immutable';
import { SET_USER } from './actionTypes';
import { callApi } from '../api/actions';
import { setUiSettingsValues } from '../uiSettings/actions';

const processUserTokens = user => {
    // Держим токены в локалСторадже для того чтоб использовать
    // общие токены при использовании из нескольких вкладок
    localStorage.setItem('noteshub:refreshToken', user.get('refreshToken'));
    localStorage.setItem('noteshub:token', user.get('token'));

    // Не будем их держать в общем объекте пользователя
    user = user.delete('refreshToken');
    user = user.delete('token');

    return user;
};

/**
 * Авторизация пользователя
 * @param email
 * @param password
 * @param remember
 */
export function login({ email, password, remember }) {
    return async (dispatch, getState) => {
        let user = await dispatch(
            callApi({
                endpoint: 'auth/login',
                method: 'post',
                params: { email, password },
                requireAuth: false,
            })
        );
        user = Immutable.fromJS(user);
        user = processUserTokens(user);

        // Переносим UI настройки в персональный редюсер
        dispatch(setUiSettingsValues(user.get('uiSettings')));
        user = user.delete('uiSettings');

        if (!remember) {
            // TODO при закрытии браузера удалить все записи в localStorage
        }

        dispatch({
            type: SET_USER,
            user,
        });
    };
}

/**
 * Обновить основной токен
 * @returns {Function}
 */
export function refreshToken(withUserData) {
    return async (dispatch, getState) => {
        let user = await dispatch(
            callApi({
                endpoint: 'auth/refresh-token',
                useRefreshToken: true,
                tryToRefreshToken: false,
                params: {
                    withUserData,
                },
            })
        );
        user = Immutable.fromJS(user);
        processUserTokens(user);

        if (withUserData) {
            // Переносим UI настройки в персональный редюсер
            dispatch(setUiSettingsValues(user.get('uiSettings')));
            user = user.delete('uiSettings');

            dispatch({
                type: SET_USER,
                user,
            });
        }
    };
}

/**
 * Выход пользователя
 */
export function logout() {
    return (dispatch, getState) => {
        localStorage.removeItem('noteshub:refreshToken');
        localStorage.removeItem('noteshub:token');

        dispatch({
            type: SET_USER,
            user: null,
        });
    };
}

/**
 * Регистрация пользователя
 * @param params
 */
export function registration(params) {
    return async (dispatch, getState) => {
        if (params.code) {
            await dispatch(callApi({ endpoint: `registration/confirm`, method: 'post', params, requireAuth: false }));
        } else {
            await dispatch(callApi({ endpoint: `registration`, method: 'post', params, requireAuth: false }));
        }
    };
}

/**
 * Восстановление пароля
 * @param params
 */
export function restorePassword(params) {
    return async (dispatch, getState) => {
        if (params.code) {
            await dispatch(
                callApi({ endpoint: `restorePassword/confirm`, method: 'post', params, requireAuth: false })
            );
        } else {
            await dispatch(callApi({ endpoint: `restorePassword`, method: 'post', params, requireAuth: false }));
        }
    };
}


export function updateUser(userId, params){
    return async (dispatch, getState) => {
        await dispatch(
            callApi({ endpoint: `users/me`, method: 'patch', params })
        );
    };
}
