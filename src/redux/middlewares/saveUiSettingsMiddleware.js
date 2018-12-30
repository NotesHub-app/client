import * as Immutable from 'immutable';
import debounce from 'lodash/debounce';
import { callApi } from '../modules/api/actions';

const saveUiSettings = debounce((store, beforeUiSettings, afterUiSettings) => {
    let diffSettings = new Immutable.Map();
    afterUiSettings.forEach((value, param) => {
        if (afterUiSettings.get(param) !== beforeUiSettings.get(param)) {
            diffSettings = diffSettings.set(param, value);
        }
    });

    store.dispatch(
        callApi({
            endpoint: 'users/me',
            method: 'patch',
            params: { uiSettings: Immutable.fromJS(diffSettings) },
        }),
    );
}, 1000);

export default store => next => action => {
    const beforeUiSettings = store.getState().uiSettings;

    const result = next(action);

    const afterUiSettings = store.getState().uiSettings;

    // Если поменялись настройки UI
    if (beforeUiSettings !== afterUiSettings) {
        // Отправляем запрос на сохранение измененных настроек
        saveUiSettings(store, beforeUiSettings, afterUiSettings);
    }

    return result;
};
