import superagent from 'superagent';
import { logout } from '../redux/modules/user';

export function callApi({ endpoint, method, params, requireAuth = true }) {
    return async (dispatch, getState) => {
        method = method || 'post';

        let request = superagent[method](`/api/${endpoint}`);

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
                dispatch(logout());
            }

            throw err;
        }
    };
}
