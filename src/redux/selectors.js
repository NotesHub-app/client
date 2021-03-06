import { createSelector } from 'reselect';
import * as Immutable from 'immutable';
import DiffMatchPatch from 'diff-match-patch';
import { getUrlQueryParameterByName } from '../utils/url';
import { getNoteNodeTreeId, getRootGroupNodeTreeId, getRootPersonalNodeTreeId } from '../utils/navigation';

/**
 * Выборка авторизованного пользователя
 */
export const userSelector = state => state.user;

/**
 * Статус, что минимально-требуемые данные загружены с сервера
 * @param state
 * @returns {*}
 */
export const dataReadySelector = state => state.data.get('notes') && state.data.get('groups');

/**
 * Выборка элементов дерева навигации по заметкам
 */
export const navigationNodesSelector = createSelector(
    state => state.data.get('notes'),
    state => state.data.get('groups'),
    (notes, groups) => {
        if (!notes || !groups) {
            return [];
        }
        // TODO сначала отсортировать сущности по возрасту

        let results = [{ treeId: getRootPersonalNodeTreeId(), type: 'personal', parentTreeId: null }];
        groups.forEach(group => {
            results.push({
                treeId: getRootGroupNodeTreeId(group.get('id')),
                type: 'group',
                parentTreeId: null,
                data: group,
            });
        });

        notes.forEach(note => {
            const groupId = note.get('groupId');
            const parentId = note.get('parentId');

            const resultItem = {
                type: 'note',
                treeId: getNoteNodeTreeId(note.get('id')),
                data: note,
            };
            // Если есть родитель
            if (parentId) {
                resultItem.parentTreeId = `note_${parentId}`;
            } else if (groupId) {
                resultItem.parentTreeId = `rootGroup_${groupId}`;
            } else {
                resultItem.parentTreeId = `rootPersonal`;
            }

            results.push(resultItem);
        });

        // Определяем если ли у нодов дети
        results = results.map(node => {
            node.hasChildren = results.some(i => i.parentTreeId === node.treeId);
            return node;
        });

        return results;
    },
);

/**
 * Селектор параметров УРЛ-а для страницы авторизации
 */
export const loginFormUrlParamsSelector = createSelector(
    url => url,
    url => ({
        afterRegistration: !!getUrlQueryParameterByName('afterRegistration', url),
        afterRestorePassword: !!getUrlQueryParameterByName('afterRestorePassword', url),
        back: getUrlQueryParameterByName('back', url),
        email: getUrlQueryParameterByName('email', url),
    }),
);

/**
 * Селектор параметров УРЛ-а для страницы входа в группу по приглашению
 */
export const joinGroupUrlParamsSelector = createSelector(
    url => url,
    url => ({
        code: getUrlQueryParameterByName('code', url),
        groupId: getUrlQueryParameterByName('group', url),
    }),
);

/**
 * Список файлов заметки
 */
export const noteFilesListSelector = createSelector(
    (state, noteId) => state.data.getIn(['notes', noteId]),
    state => state.data.get('files'),
    (note, files) => {
        let result = new Immutable.List();

        note.get('fileIds').forEach(fileId => {
            let file = files.get(fileId);
            // Файл может быть удален, но ссылка на него еще осталась
            if (file) {
                file = file.set(
                    'ext',
                    file
                        .get('fileName', '')
                        .split('.')
                        .pop(),
                );
                result = result.push(file);
            }
        });

        return result;
    },
);

export const noteHistoryListSelector = createSelector(
    (state, noteId) => state.data.getIn(['notes', noteId, 'history']),
    history => history,
);

export const noteHistoryItemSelector = createSelector(
    (state, noteId, historyItemIdx) => state.data.getIn(['notes', noteId, 'history', historyItemIdx]),
    noteHistoryItem => {
        if (!noteHistoryItem || !noteHistoryItem.get('before')) {
            return;
        }

        let diffs = new Immutable.Map();
        let diffHtmls = new Immutable.Map();
        noteHistoryItem.get('before').forEach((beforeValue, key) => {
            const afterValue = noteHistoryItem.getIn(['after', key]);

            const dmp = new DiffMatchPatch();
            const diff = dmp.diff_main(beforeValue, afterValue);
            diffs = diffs.set(key, diff);
            diffHtmls = diffHtmls.set(key, dmp.diff_prettyHtml(diff));
        });

        return noteHistoryItem.set('diffs', diffs).set('diffHtmls', diffHtmls);
    },
);
