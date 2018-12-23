import * as Immutable from 'immutable';

/**
 * Удалить заметку вместе с потомками
 * @param notes
 * @param noteId
 */
export function removeNoteWithChildren(notes, noteId) {
    const collectedIds = new Set([noteId]);
    const collectChildrenOf = noteId => {
        notes.forEach(note => {
            if (note.get('parentId') === noteId) {
                collectedIds.add(note.get('id'));
                collectChildrenOf(note.get('id'));
            }
        });
    };
    collectChildrenOf(noteId);
    collectedIds.forEach(id => {
        notes = notes.delete(id);
    });
    return notes;
}

/**
 * Получение MD-ссылки на файл
 * @param file
 * @returns {string}
 */
export function getNoteFileLink(file) {
    const isImage = file.get('mimeType', '').startsWith('image/');
    return `${isImage ? '!' : ''}[${file.get('fileName')}](file://${file.get('downloadCode')})`;
}

/**
 * Удаление ссылки на файлы у заметки
 * @param note
 * @param fileIds
 * @returns {*}
 */
export function removeNoteFileIds(note, fileIds) {
    const noteFileIds = note.get('fileIds', new Immutable.List()).filter(i => !fileIds.includes(i));
    return note.set('fileIds', noteFileIds);
}
