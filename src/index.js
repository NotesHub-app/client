import React from 'react';
import ReactDOM from 'react-dom';
import configureStore, { history } from './redux/store';
import Root from './components/main/Root';
import './styles/index.scss';
import { prepareBrowserEnv } from './utils/browser';
import { isElectron } from './utils/electron-helpers';
import * as serviceWorker from './serviceWorker';
import { refreshToken } from './redux/modules/user/actions';
import ws from './ws';

prepareBrowserEnv();

(async () => {
    // Инициализирует redux-store
    const store = configureStore();

    // Инициализируем клиент Socket.IO
    ws.init(store);

    // Пробуем восстановить сессию по refreshToken-у сохраненного с прошлого раза (если он есть)
    if (localStorage.getItem('noteshub:refreshToken')) {
        try {
            await store.dispatch(refreshToken(true));
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
