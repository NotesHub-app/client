import * as  Immutable from 'immutable';
import { SET_USER } from './actionTypes';
import { callApi } from '../../../utils/api';

/**
 * Авторизация пользователя
 * @param email
 * @param password
 */
export function login({ email, password }) {
    return async (dispatch, getState) => {
        let user = await dispatch(
            callApi({ endpoint: 'auth/login', method: 'post', params: { email, password }, requireAuth: false }),
        );
        user = Immutable.fromJS(user);

        return dispatch({
            type: SET_USER,
            user,
        });
    };
}

/**
 * Выход пользователя
 */
export function logout() {
    return {
        type: SET_USER,
        user: null,
    };
}
