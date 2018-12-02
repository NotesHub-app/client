import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import user from './user';
import uiSettings from './uiSettings';

export default history =>
    combineReducers({
        user,
        uiSettings,

        // Дополнительные
        form: formReducer,
        router: connectRouter(history),
    });
