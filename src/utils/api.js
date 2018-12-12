import superagent from 'superagent';
import * as Immutable from 'immutable';
import { logout } from '../redux/modules/user/actions';
import config from '../config';
import { SET_USER } from '../redux/modules/user/actionTypes';

/**
 * Вызов API функции сервера
 * @param endpoint
 * @param method
 * @param params
 * @param requireAuth
 * @param noRefresh - не делать попыток обновить токен
 * @param token
 * @returns {Function}
 */
export function callApi({ endpoint, method = 'post', params, requireAuth = true, tryRefreshToken = true, token }) {
    return async (dispatch, getState) => {
        method = method || 'post';

        let request = superagent[method](`${config.apiUrl}/${endpoint}`);

        // Если метод требует авторизацию - прикрепляем токен JWT
        if (requireAuth) {
            token = token || getState().user.get('token');
            request = request.set('Authorization', `${token}`);
        }

        if (params && method !== 'get') {
            request = request.send(params);
        }

        request = request.set('Accept', 'application/json').set('Content-Type', 'application/json; charset=utf-8');

        try {
            const result = await request;
            return Promise.resolve(JSON.parse(result.text), endpoint, params);
        } catch (err) {
            if (err.status === 401) {
                if (tryRefreshToken) {
                    // Делаем попытку обновить токен
                    try {
                        let user = await dispatch(
                            callApi({
                                endpoint: 'auth/keep-token',
                                token: localStorage.getItem('noteshub:refreshToken'),
                                tryRefreshToken: false,
                            })
                        );
                        user = Immutable.fromJS(user);

                        localStorage.setItem('noteshub:refreshToken', user.get('refreshToken'));
                        dispatch({
                            type: SET_USER,
                            user,
                        });

                        // Делаем изначальный запрос снова
                        return await dispatch(
                            callApi({
                                ...arguments[0],
                                tryRefreshToken: false,
                            })
                        );
                    } catch (err) {
                        // Если и после попытки восстановить токен 401 - тогда логаут
                        if (err.status === 401) {
                            return dispatch(logout());
                        }
                    }
                } else {
                    return dispatch(logout());
                }
            }

            throw err;
        }
    };
}

/**
 * Загрузка файла на сервер
 * @param endpoint
 * @param file
 * @param progressHandler
 */
export function uploadFile({ endpoint, file, progressHandler = () => {} }) {
    return async (dispatch, getState) => {
        let request = superagent.post(`${config.apiUrl}/${endpoint}`);

        request = request.set('Authorization', `${getState().user.get('token')}`);

        request = request.attach('file', file).on('progress', progressHandler);

        request = request.set('Accept', 'application/json');

        try {
            const result = await request;
            return Promise.resolve(JSON.parse(result.text), endpoint);
        } catch (err) {
            // При неавторизованных действиях - всегда разлогиниваемся
            if (err.status === 401) {
                dispatch(logout());
            }

            throw err;
        }
    };
}
