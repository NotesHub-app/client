import { getInitialData, resetData } from '../modules/data/actions';
import ws from '../../ws';

export default store => next => action => {
    const beforeUser = store.getState().user;

    const result = next(action);

    const afterUser = store.getState().user;

    // Если разлогинились
    if (beforeUser && !afterUser) {
        // Подгружаем данны
        store.dispatch(resetData());
    }

    // Если залогинились
    if (!beforeUser && afterUser) {
        store.dispatch(getInitialData());

        // Авторизуемся по сокетам
        ws.auth(localStorage.getItem('noteshub:token'));
    }

    return result;
};
