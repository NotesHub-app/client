import * as Immutable from 'immutable';
import { SET_UI_SETTINGS_VALUES } from './actionTypes';
import { navigationNodesSelector } from '../../selectors';

export function setUiSettingsValues(values) {
    values = Immutable.fromJS(values);

    const expendedNavigationTreeNodes = values.get('expendedNavigationTreeNodes');
    if (expendedNavigationTreeNodes) {
        values = values.set('expendedNavigationTreeNodes', expendedNavigationTreeNodes.toSet());
    }

    return {
        type: SET_UI_SETTINGS_VALUES,
        values,
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

/**
 * Переключить состояние раскрытости ветку в дереве навигации по заметкам
 * @param nodeTreeId
 */
export function toggleNavigationTreeNode(nodeTreeId) {
    return (dispatch, getState) => {
        const expendedNavigationTreeNodes = getState().uiSettings.get('expendedNavigationTreeNodes');
        if (expendedNavigationTreeNodes.has(nodeTreeId)) {
            dispatch(collapseNavigationTreeNode(nodeTreeId));
        } else {
            dispatch(expendNavigationTreeNode(nodeTreeId));
        }
    };
}

/**
 * Выставить статус алерта удаления заметки
 * @param noteId
 * @param isOpen
 * @returns {{type: string, values: any}}
 */
export function setRemoveNoteAlertStatus({ noteId, isOpen }) {
    return {
        type: SET_UI_SETTINGS_VALUES,
        values: Immutable.fromJS({
            removeNoteAlert: Immutable.fromJS({
                noteId,
                isOpen,
            }),
        }),
    };
}

/**
 * Выставить активный таб для футера заметок
 * @param tabName
 * @returns {Function}
 */
export function setActiveNoteFooterTab(tabName) {
    return (dispatch, getState) => {
        const activeNoteFooterTab = getState().uiSettings.get('activeNoteFooterTab');
        if (tabName === activeNoteFooterTab) {
            dispatch(setUiSettingsValues({ activeNoteFooterTab: null }));
        } else {
            dispatch(setUiSettingsValues({ activeNoteFooterTab: tabName }));
        }
    };
}

/**
 * Выставить значение фильтра заметок
 * @param filterStr
 * @returns {Function}
 */
export function setNavigationFilter(filterStr) {
    return (dispatch, getState) => {
        const nodes = navigationNodesSelector(getState());
        let expendedNodes = new Immutable.Set();

        const uiSettings = {
            navigationFilter: filterStr,
        };

        if (filterStr) {
            filterStr = filterStr.toLowerCase();
            const expandParents = node => {
                const parent = nodes.find(i => i.treeId === node.parentTreeId);

                if (parent) {
                    expendedNodes = expendedNodes.add(parent.treeId);

                    if (parent.parentTreeId) {
                        expandParents(parent);
                    }
                }
            };

            nodes.forEach(node => {
                let title = '';
                if (node.data) {
                    title = node.data.get('title').toLowerCase();
                }

                if (title.includes(filterStr)) {
                    expandParents(node);
                }
            });

            uiSettings.expendedNavigationTreeNodes = expendedNodes;
        }

        dispatch(setUiSettingsValues(uiSettings));
    };
}
