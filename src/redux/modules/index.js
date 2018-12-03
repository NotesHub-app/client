import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import user from './user';
import uiSettings from './uiSettings';
import data from './data';

export default history =>
    combineReducers({
        user,
        uiSettings,
        data,

        // Дополнительные
        form: formReducer,
        router: connectRouter(history),
    });
