import { getInitialData, resetData } from '../modules/data/actions';

export default store => next => action => {
    const beforeUser = store.getState().user;

    const result = next(action);

    const afterUser = store.getState().user;

    // Если разлогинились
    if (beforeUser && !afterUser) {
        // Подгружаем данны
        store.dispatch(resetData());

        localStorage.setItem('noteshub:user', null);
    }

    // Если залогинились
    if (!beforeUser && afterUser) {
        store.dispatch(getInitialData());
    }

    return result;
};
