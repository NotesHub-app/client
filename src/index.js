import React from 'react';
import ReactDOM from 'react-dom';
import * as Immutable from 'immutable';
import configureStore, { history } from './redux/store';
import Root from './components/main/Root';
import './styles/index.scss';
import { prepareBrowserEnv } from './utils/browser';
import { isElectron } from './utils/electron-helpers';
import * as serviceWorker from './serviceWorker';
import { SET_USER } from './redux/modules/user/actionTypes';

prepareBrowserEnv();

(async () => {
    // Инициализирует redux-store
    const store = configureStore();

    const savedUserData = localStorage.getItem('noteshub:user');
    if (savedUserData) {
        try {
            const user = Immutable.fromJS(JSON.parse(savedUserData));
            store.dispatch({
                type: SET_USER,
                user,
            });
        } catch (e) {
            // не получилось восстановить пользователя
        }
    }

    // Инициализируем electron
    if (isElectron()) {
        const { default: initElectron } = await import('./initElectron');
        initElectron(store);
    }

    // Монтируем React контейнер на страницу
    const target = document.querySelector('#root');
    ReactDOM.render(<Root history={history} store={store} />, target);

    if (isElectron()) {
        // Заворачиваем в таймаут чтоб не показывать процесс монтирования содержимого
        setTimeout(() => {
            window.ipcRenderer.send('open-main-window');
        }, 500);
    }

    if (module.hot) {
        module.hot.accept('./components/main/Root', () => {
            ReactDOM.render(<Root history={history} store={store} />, target);
        });
    }
})();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
