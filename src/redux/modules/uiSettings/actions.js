import * as Immutable from 'immutable';
import { SET_UI_SETTINGS_VALUES } from './actionTypes';

export function setUiSettingsValues(values) {
    return {
        type: SET_UI_SETTINGS_VALUES,
        values: Immutable.fromJS(values),
    };
}

/**
 * Раскрыть ветку в дереве навигации по заметкам
 * @param nodeTreeId
 */
export function expendNavigationTreeNode(nodeTreeId) {
    return (dispatch, getState) => {
        const expendedNavigationTreeNodes = getState().uiSettings.get('expendedNavigationTreeNodes');
        dispatch(setUiSettingsValues({ expendedNavigationTreeNodes: expendedNavigationTreeNodes.add(nodeTreeId) }));
    };
}

/**
 * Свернуть ветку в дереве навигации по заметкам
 * @param nodeTreeId
 */
export function collapseNavigationTreeNode(nodeTreeId) {
    return (dispatch, getState) => {
        const expendedNavigationTreeNodes = getState().uiSettings.get('expendedNavigationTreeNodes');
        dispatch(setUiSettingsValues({ expendedNavigationTreeNodes: expendedNavigationTreeNodes.delete(nodeTreeId) }));
    };
}
