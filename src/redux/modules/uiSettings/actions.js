import * as Immutable from 'immutable';
import { SET_UI_SETTINGS_VALUES } from './actionTypes';

export function setUiSettingsValues(values) {
    return {
        type: SET_UI_SETTINGS_VALUES,
        values: Immutable.fromJS(values),
    };
}