import * as Immutable from 'immutable';
import forEach from 'lodash/forEach';
import { batchActions } from 'redux-batched-actions';
import { SET_NOTES, SET_NOTE, SET_GROUPS, RESET_DATA, REMOVE_NOTE, SET_FILE, REMOVE_FILE } from './actionTypes';
import { callApi, uploadFile } from '../../../utils/api';
import { listToMap } from '../../../utils/immutable';

/**
 * Получение заметок
 */
export function getNotes() {
    return async (dispatch, getState) => {
        let { notes } = await dispatch(callApi({ endpoint: 'notes', method: 'get' }));
        notes = listToMap(Immutable.fromJS(notes));

        dispatch({
            type: SET_NOTES,
            notes,
        });
    };
}

/**
 * Обновление заметки
 * @param noteId
 * @param noteContent
 */
export function updateNote(noteId, noteContent) {
    return async (dispatch, getState) => {
        const data = {};
        const currentNote = getState().data.getIn(['notes', noteId]);
        let updatedNote = currentNote;
        forEach(noteContent, (value, field) => {
            if (currentNote.get(field) !== value) {
                data[field] = value;
                updatedNote = updatedNote.set(field, value);
            }
        });
        await dispatch(callApi({ endpoint: `notes/${noteId}`, method: 'patch', params: data }));

        dispatch({
            type: SET_NOTE,
            note: updatedNote,
        });
    };
}

/**
 * Создать заметку
 * @param params
 */
export function createNote(params) {
    return async (dispatch, getState) => {
        const data = {
            title: 'Новая заметка',
            icon: 'document',
            iconColor: '#5c7080',
            content: '',
            ...params,
        };
        let { note } = await dispatch(callApi({ endpoint: `notes`, method: 'post', params: data }));
        note = Immutable.fromJS(note);

        note = note
            .delete('files')
            .set('fileIds', new Immutable.List())
            .set('_loaded', true);

        dispatch({
            type: SET_NOTE,
            note,
        });

        return note;
    };
}

/**
 * Удалить заметку
 * @param noteId
 */
export function removeNote(noteId) {
    return async (dispatch, getState) => {
        await dispatch(callApi({ endpoint: `notes/${noteId}`, method: 'delete' }));
        dispatch({
            type: REMOVE_NOTE,
            noteId,
        });
    };
}

/**
 * Удалить файл
 * @param fileId
 */
export function removeFile(fileId) {
    return async (dispatch, getState) => {
        await dispatch(callApi({ endpoint: `files/${fileId}`, method: 'delete' }));
        dispatch({
            type: REMOVE_FILE,
            fileId,
        });
    };
}

export function uploadNoteFile({ noteId, fileObj, path }) {
    return async (dispatch, getState) => {
        let { file } = await dispatch(
            callApi({
                endpoint: `files`,
                method: 'post',
                params: {
                    fileName: fileObj.name,
                    description: '',
                    noteId,
                },
            })
        );

        file = Immutable.fromJS(file).set('_uploadProgress', 0);

        // Добавляем файл к заметке
        let note = getState().data.getIn(['notes', noteId]);
        note = note.set('fileIds', note.get('fileIds', new Immutable.List()).push(file.get('id')));

        dispatch(
            batchActions([
                {
                    type: SET_FILE,
                    file,
                },
                {
                    type: SET_NOTE,
                    note,
                },
            ])
        );

        const { file: uploadedFile } = await dispatch(
            uploadFile({
                endpoint: `files/${file.get('id')}/upload`,
                file: fileObj,
                progressHandler: ({ percent }) => {
                    file = file.set('_uploadProgress', percent);
                    dispatch({
                        type: SET_FILE,
                        file,
                    });
                },
            })
        );

        dispatch({
            type: SET_FILE,
            file: Immutable.fromJS(uploadedFile),
        });
    };
}

/**
 * Получение своих групп
 */
export function getGroups() {
    return async (dispatch, getState) => {
        let { groups } = await dispatch(callApi({ endpoint: 'groups', method: 'get' }));
        groups = listToMap(Immutable.fromJS(groups));

        dispatch({
            type: SET_GROUPS,
            groups,
        });
    };
}

/**
 * Получение полное содержимое заметки
 * @param noteId
 * @returns {Function}
 */
export function getNoteDetails(noteId) {
    return async (dispatch, getState) => {
        let { note } = await dispatch(callApi({ endpoint: `notes/${noteId}`, method: 'get' }));

        note = Immutable.fromJS(note).set('_loaded', true);
        let files = new Immutable.List();
        let fileIds = new Immutable.List();

        note.get('files').forEach(file => {
            files = files.push(file);
            fileIds = fileIds.push(file.get('id'));
        });

        note = note.delete('files').set('fileIds', fileIds);

        const actions = [];
        files.forEach(file => {
            actions.push({
                type: SET_FILE,
                file,
            });
        });
        actions.push({
            type: SET_NOTE,
            note,
        });
        dispatch(batchActions(actions));
    };
}

/**
 * Получение минимальных пользовательских данных для работы программы
 * @returns {Function}
 */
export function getInitialData() {
    return async (dispatch, getState) => {
        dispatch(getNotes());
        dispatch(getGroups());
    };
}

/**
 * Сброс загруженных данных
 */
export function resetData() {
    return {
        type: RESET_DATA,
    };
}
