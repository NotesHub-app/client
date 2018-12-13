import superagent from 'superagent';
import trim from 'lodash/trim';
import { refreshToken, logout } from '../user/actions';
import config from '../../../config';

/**
 * Вызов API функции сервера
 * @param endpoint
 * @param method
 * @param params
 * @param requireAuth
 * @param noRefresh - не делать попыток обновить токен
 * @returns {Function}
 */
export function callApi({
    endpoint,
    method = 'post',
    params,
    queryParams,
    requireAuth = true,
    tryToRefreshToken = true,
    useRefreshToken,
    uploadFile,
    progressFileUpload = () => {},
}) {
    return async (dispatch, getState) => {
        try {
            // Формируем URL для запроса
            let url = `${config.apiUrl}/${endpoint}`;

            // Если указаны query параметры - добавляем их к урлу
            if (queryParams) {
                url = `${url}?`;
                for (const param of Object.keys(queryParams)) {
                    const value = queryParams[param];
                    url += `${param}=${encodeURIComponent(value)}&`;
                }
                url = trim(url, '&');
            }

            // Формируем объект запроса с общими параметрами
            let request = superagent[method](url).set('Accept', 'application/json');

            // Крепим авторизационный токен
            if (requireAuth) {
                let token;
                if (useRefreshToken) {
                    token = localStorage.getItem('noteshub:refreshToken');
                } else {
                    token = localStorage.getItem('noteshub:token');
                }
                request = request.set('Authorization', token);
            }

            if (uploadFile) {
                request = request.attach(uploadFile).on('progress', progressFileUpload);
            } else {
                request = request.set('Content-Type', 'application/json; charset=utf-8').send(params);
            }

            const result = await request.send(params).retry(5, () => {
                // TODO Если нет связи - выдать заглушку?
            });

            return Promise.resolve(JSON.parse(result.text));
        } catch (err) {
            if (err.status === 401) {
                if (!tryToRefreshToken) {
                    dispatch(logout());
                    throw err;
                }

                await dispatch(callRefreshToken());

                // Делаем изначальный запрос снова
                return dispatch(
                    callApi({
                        ...arguments[0],
                        tryToRefreshToken: false,
                    })
                );
            }

            throw err;
        }
    };
}

/**
 * Сделать запрос на обновление токена
 * @returns {Function}
 */
function callRefreshToken() {
    return async (dispatch, getState) => {
        // Делаем попытку обновить токен
        try {
            await dispatch(refreshToken());
        } catch (err) {
            // Если и после попытки восстановить токен 401 - тогда логаут
            if (err.status === 401) {
                dispatch(logout());
            }

            throw err;
        }
    };
}
