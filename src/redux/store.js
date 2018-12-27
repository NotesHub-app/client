import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import rootReducer from './modules';
import usersDataMiddleware from './middlewares/usersDataMiddleware';
import saveUiSettingsMiddleware from './middlewares/saveUiSettingsMiddleware';

const configureStore = () => {
    const initialState = {};
    const enhancers = [];
    const middleware = [thunk, batchDispatchMiddleware, usersDataMiddleware, saveUiSettingsMiddleware];

    if (process.env.NODE_ENV !== 'production') {
        const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

        if (typeof devToolsExtension === 'function') {
            enhancers.push(devToolsExtension());
        }
    }

    const composedEnhancers = compose(
        applyMiddleware(...middleware),
        ...enhancers,
    );

    const store = createStore(rootReducer, initialState, composedEnhancers);

    if (process.env.NODE_ENV !== 'production') {
        if (module.hot) {
            module.hot.accept('./modules', () => {
                store.replaceReducer(rootReducer);
            });
        }
    }

    return store;
};

export default configureStore;
