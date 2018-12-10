import * as Immutable from 'immutable';
import { SET_USER } from './actionTypes';
import { callApi } from '../../../utils/api';

let refreshTokenTimoutId = null;
const refreshTokenTime = 8 * 60 * 1000; // 8min

/**
 * Авторизация пользователя
 * @param email
 * @param password
 * @param remember
 */
export function login({ email, password, remember }) {
    return async (dispatch, getState) => {
        let user = await dispatch(
            callApi({ endpoint: 'auth/login', method: 'post', params: { email, password }, requireAuth: false })
        );
        if (remember) {
            localStorage.setItem('noteshub:user', JSON.stringify(user));
        }
        user = Immutable.fromJS(user);

        dispatch({
            type: SET_USER,
            user,
        });

        refreshTokenTimoutId = setTimeout(() => {
            dispatch(refreshToken(remember));
        }, refreshTokenTime);
    };
}

function refreshToken(remember) {
    return async (dispatch, getState) => {
        let user = await dispatch(callApi({ endpoint: 'auth/keep-token', method: 'get' }));

        if (remember) {
            localStorage.setItem('noteshub:user', JSON.stringify(user));
        }
        user = Immutable.fromJS(user);

        dispatch({
            type: SET_USER,
            user,
        });

        refreshTokenTimoutId = setTimeout(() => {
            dispatch(refreshToken(remember));
        }, refreshTokenTime);
    };
}

/**
 * Выход пользователя
 */
export function logout() {
    return (dispatch, getState) => {
        if (refreshTokenTimoutId) {
            clearTimeout(refreshTokenTimoutId);
            refreshTokenTimoutId = null;
        }
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
