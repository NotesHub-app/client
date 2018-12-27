import { combineReducers } from 'redux';
import user from './user';
import uiSettings from './uiSettings';
import data from './data';
import api from './api';

export default combineReducers({
    user,
    uiSettings,
    data,
    api,
});
