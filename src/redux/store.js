import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk';
import createHashHistory from 'history/createHashHistory';
import createRootReducer from './modules'

export const history = createHashHistory();

const configureStore = () => {
    const initialState = {};
    const enhancers = [];
    const middleware = [thunk, routerMiddleware(history)];

    if (process.env.NODE_ENV !== 'production') {
        const { devToolsExtension } = window;

        if (typeof devToolsExtension === 'function') {
            enhancers.push(devToolsExtension());
        }
    }

    const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

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
