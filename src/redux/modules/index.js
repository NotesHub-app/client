import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import user from './user';
import uiSettings from './uiSettings';
import data from './data';
import api from './api';

export default history =>
    combineReducers({
        user,
        uiSettings,
        data,
        api,

        // Дополнительные
        form: formReducer,
        router: connectRouter(history),
    });
