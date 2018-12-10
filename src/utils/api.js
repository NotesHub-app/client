import superagent from 'superagent';
import { logout } from '../redux/modules/user/actions';
import config from '../config';

/**
 * Вызов API функции сервера
 * @param endpoint
 * @param method
 * @param params
 * @param requireAuth
 * @returns {Function}
 */
export function callApi({ endpoint, method = 'post', params, requireAuth = true }) {
    return async (dispatch, getState) => {
        method = method || 'post';

        let request = superagent[method](`${config.apiUrl}/${endpoint}`);

        // Если метод требует авторизацию - прикрепляем токен JWT
        if (requireAuth) {
            request = request.set('Authorization', `${getState().user.get('token')}`);
        }

        if (params && method !== 'get') {
            request = request.send(params);
        }

        request = request.set('Accept', 'application/json').set('Content-Type', 'application/json; charset=utf-8');

        try {
            const result = await request;
            return Promise.resolve(JSON.parse(result.text), endpoint, params);
        } catch (err) {
            // При неавторизованных действиях - всегда разлогиниваемся
            if (err.status === 401) {
                return dispatch(logout());
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
