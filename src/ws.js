import socketIoClient from 'socket.io-client';
import * as Immutable from 'immutable';
import { batchActions } from 'redux-batched-actions';
import config from './config';
import {
    REMOVE_NOTE,
    REMOVE_GROUP,
    SET_GROUP,
    SET_NOTE,
    SET_FILE,
    REMOVE_FILE,
} from './redux/modules/data/actionTypes';
import { removeNoteFileIds } from './utils/data';
import { patchNote } from './redux/modules/data/actions';

class WS {
    init(store) {
        this.store = store;
    }

    connect() {
        this.io = socketIoClient(config.socketUrl, {
            query: {
                token: localStorage.getItem('noteshub:token'),
                clientId: config.wsClientId,
            },
        });

        this.io.on('note:updated', this.handleNoteUpdated);
        this.io.on('note:fileUpdated', this.handleNoteFileUpdated);
        this.io.on('note:fileRemoved', this.handleNoteFileRemoved);
        this.io.on('note:removed', this.handleNoteRemoved);
        this.io.on('group:updated', this.handleGroupUpdated);
        this.io.on('group:removed', this.handleGroupRemoved);
    }

    disconnect() {
        this.io.close();
    }

    noteSubscribe(noteId) {
        this.io.emit('note:subscribe', { noteId });
    }

    /**
     * При обновлении/создании заметки
     * @param noteId
     * @param note
     * @param notePatch
     * @param isPatch
     */
    handleNoteUpdated = ({ noteId, note, notePatch, isPatch }) => {
        if (isPatch) {
            this.store.dispatch(patchNote(noteId, notePatch));
        } else {
            note = Immutable.fromJS(note);
            // Только если уже не обновлено

            this.store.dispatch({
                type: SET_NOTE,
                note,
            });
        }
    };

    /**
     * При обновлении/создании файла у заметки
     * @param note
     */
    handleNoteFileUpdated = ({ noteId, file }) => {
        file = Immutable.fromJS(file);

        // Добавляем файл к заметке
        let note = this.store.getState().data.getIn(['notes', noteId]);
        const noteFileIds = note.get('fileIds', new Immutable.List());
        if (!noteFileIds.includes(file.get('id'))) {
            note = note.set('fileIds', noteFileIds.push(file.get('id')));
        }

        this.store.dispatch(
            batchActions([
                {
                    type: SET_FILE,
                    file,
                },
                {
                    type: SET_NOTE,
                    note,
                },
            ]),
        );
    };

    /**
     * При удалении файла заметки
     * @param note
     */
    handleNoteFileRemoved = ({ fileId, noteId }) => {
        // Удаляем файл у заметки
        const note = removeNoteFileIds(this.store.getState().data.getIn(['notes', noteId]), [fileId]);

        this.store.dispatch(
            batchActions([
                {
                    type: REMOVE_FILE,
                    fileId,
                },
                {
                    type: SET_NOTE,
                    note,
                },
            ]),
        );
    };

    /**
     * При удалении заметки
     * @param noteId
     */
    handleNoteRemoved = ({ noteId }) => {
        this.store.dispatch({
            type: REMOVE_NOTE,
            noteId,
        });
    };

    /**
     * При обновлении/создании группы
     * @param note
     */
    handleGroupUpdated = ({ group }) => {
        group = Immutable.fromJS(group);
        this.store.dispatch({
            type: SET_GROUP,
            group,
        });
    };

    /**
     * При удалении группы
     * @param noteId
     */
    handleGroupRemoved = ({ groupId }) => {
        this.store.dispatch({
            type: REMOVE_GROUP,
            groupId,
        });
    };
}

export default new WS();
