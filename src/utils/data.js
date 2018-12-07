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