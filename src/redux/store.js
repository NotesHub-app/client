import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import createBrowserHistory from 'history/createBrowserHistory';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import createRootReducer from './modules';
import usersDataMiddleware from './middlewares/usersDataMiddleware';
import saveUiSettingsMiddleware from './middlewares/saveUiSettingsMiddleware';
import lastNoteMiddleware from './middlewares/lastNoteMiddleware';

export const history = createBrowserHistory();

const configureStore = () => {
    const initialState = {};
    const enhancers = [];
    const middleware = [
        thunk,
        routerMiddleware(history),
        batchDispatchMiddleware,
        usersDataMiddleware,
        saveUiSettingsMiddleware,
        lastNoteMiddleware,
    ];

    if (process.env.NODE_ENV !== 'production') {
        const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

        if (typeof devToolsExtension === 'function') {
            enhancers.push(devToolsExtension());
        }
    }

    const composedEnhancers = compose(
        applyMiddleware(...middleware),
        ...enhancers
    );

    const store = createStore(createRootReducer(history), initialState, composedEnhancers);

    if (process.env.NODE_ENV !== 'production') {
        if (module.hot) {
            module.hot.accept('./modules', () => {
                store.replaceReducer(createRootReducer(history));
            });
        }
    }

    return store;
};

export default configureStore;
