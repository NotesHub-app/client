import React from 'react';
import { Intent, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import { getNoteNodeTreeId } from '../../../utils/navigation';

export default class NoteMenu extends React.Component {
    static propTypes = {
        noteId: PropTypes.string.isRequired,
        setRemoveNoteAlertStatus: PropTypes.func.isRequired,
        expendNavigationTreeNode: PropTypes.func.isRequired,
        createNote: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
    };

    handleAddSubNote = async () => {
        const { push, createNote, expendNavigationTreeNode, noteId } = this.props;

        const note = await createNote({ parentId: noteId });

        // Раскрываем текущую заметку
        expendNavigationTreeNode(getNoteNodeTreeId(noteId));

        // Перейти в созданную заметку
        push(`/notes/${note.get('id')}`);
    };

    handleRemoveNote = () => {
        const { setRemoveNoteAlertStatus, noteId } = this.props;
        setRemoveNoteAlertStatus({
            isOpen: true,
            noteId,
        });
    };

    render() {
        return (
            <Menu>
                <MenuItem text="Добавить вложенную запись" icon="plus" onClick={this.handleAddSubNote} />
                <MenuDivider />
                <MenuItem text="Удалить запись" icon="trash" intent={Intent.DANGER} onClick={this.handleRemoveNote} />
            </Menu>
        );
    }
}
