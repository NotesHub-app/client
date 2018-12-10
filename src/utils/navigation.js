/**
 * Получить treeId для заметки
 * @param noteId
 * @returns {string}
 */
export function getNoteNodeTreeId(noteId) {
    return `note_${noteId}`;
}

/**
 * Получить treeId для корня группы
 * @param groupId
 * @returns {string}
 */
export function getRootGroupNodeTreeId(groupId) {
    return `rootGroup_${groupId}`;
}

/**
 * Получить treeId для корня персональных заметок
 * @param noteId
 * @returns {string}
 */
export function getRootPersonalNodeTreeId(noteId) {
    return 'rootPersonal';
}
