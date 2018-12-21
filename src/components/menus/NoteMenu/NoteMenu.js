import React from 'react';
import { Intent, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import { getNoteNodeTreeId } from '../../../utils/navigation';
import { copyTextToBuffer } from '../../../utils/browser';

export default class NoteMenu extends React.Component {
    static propTypes = {
        note: PropTypes.object.isRequired,
        setRemoveNoteAlertStatus: PropTypes.func.isRequired,
        expendNavigationTreeNode: PropTypes.func.isRequired,
        createNote: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
    };

    handleAddSubNote = async () => {
        const { push, createNote, expendNavigationTreeNode, note } = this.props;

        const newNote = await createNote({ parentId: note.get('id') });

        // Раскрываем текущую заметку
        expendNavigationTreeNode(getNoteNodeTreeId(newNote.get('parentId')));

        // Перейти в созданную заметку
        push(`/notes/${newNote.get('id')}`);
    };

    handleRemoveNote = () => {
        const { setRemoveNoteAlertStatus, note } = this.props;
        setRemoveNoteAlertStatus({
            isOpen: true,
            noteId: note.get('id'),
        });
    };

    handleCopyNoteLink = () => {
        const { note } = this.props;

        // В названии экранируем квадратные скобки
        const title = note.get('title').replace(/([\][])/g, '\\$1');

        copyTextToBuffer(`[${title}](note://${note.get('id')})`);
    };

    render() {
        return (
            <Menu>
                <MenuItem text="Добавить вложенную запись" icon="plus" onClick={this.handleAddSubNote} />
                <MenuItem text="Копировать ссылку для заметки" icon="link" onClick={this.handleCopyNoteLink} />
                <MenuDivider />
                <MenuItem text="Удалить запись" icon="trash" intent={Intent.DANGER} onClick={this.handleRemoveNote} />
            </Menu>
        );
    }
}
