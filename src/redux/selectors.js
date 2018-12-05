import { createSelector } from 'reselect';
import { getUrlQueryParameterByName } from '../utils/url';

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
        // TODO сначала отсортировать сущности по возрасту

        let results = [{ treeId: 'rootPersonal', type: 'personal', parentTreeId: null }];
        groups.forEach(group => {
            results.push({
                treeId: `rootGroup_${group.get('id')}`,
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
                treeId: `note_${note.get('id')}`,
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
    }
);

export const loginFormUrlParamsSelector = createSelector(
    url => url,
    url => ({
        afterRegistration: !!getUrlQueryParameterByName('afterRegistration', url),
        afterRestorePassword: !!getUrlQueryParameterByName('afterRestorePassword', url),
        email: getUrlQueryParameterByName('email', url),
    })
);
