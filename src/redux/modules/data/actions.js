import * as Immutable from 'immutable';
import forEach from 'lodash/forEach';
import { batchActions } from 'redux-batched-actions';
import DiffMatchPatch from 'diff-match-patch';
import {
    SET_NOTES,
    SET_NOTE,
    SET_GROUPS,
    SET_GROUP,
    RESET_DATA,
    REMOVE_NOTE,
    SET_FILE,
    REMOVE_FILE,
} from './actionTypes';
import { callApi } from '../api/actions';
import { listToMap } from '../../../utils/immutable';
import { removeNoteFileIds } from '../../../utils/data';

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
                // Контент отправляем в diff варианте для экономии трафика
                if (field === 'content') {
                    const dmp = new DiffMatchPatch();
                    data[field] = dmp.patch_make(currentNote.get(field), value);
                } else {
                    data[field] = value;
                }

                updatedNote = updatedNote.set(field, value);
            }
        });
        // Только если что-то поменялось
        if (Object.keys(data).length) {
            try {
                dispatch({
                    type: SET_NOTE,
                    note: updatedNote,
                });

                dispatch(callApi({ endpoint: `notes/${noteId}`, method: 'patch', params: data }));
            } catch (e) {
                // Если при сохранении произошел конфликт патчинга контента - значит наше
                // содержимое не актуально - перезагружаем заметку
                if (e.status === 409) {
                    dispatch(getNoteDetails(noteId));
                }
            }
        }
    };
}

/**
 *
 * @param noteId
 * @param notePatch
 */
export function patchNote(noteId, notePatch) {
    return (dispatch, getState) => {
        let note = getState().data.getIn(['notes', noteId]);
        for (const field of Object.keys(notePatch)) {
            const dmp = new DiffMatchPatch();
            const [newValue, result] = dmp.patch_apply(notePatch[field], note.get(field));

            if (!result) {
                // Если пропатчить не удалось - перезапрашиваем заметку по новой
                console.warn('Не удалось пропатчить заметку!');
                return dispatch(getNoteDetails(noteId));
            }
            note = note.set(field, newValue);
        }

        // Инкрементируем индекс внешних изменений для проверки неоьбходимости ререндера формы редактирования заметки
        note = note.set('externalChangesIndex', note.get('externalChangesIndex', 0) + 1);

        dispatch({
            type: SET_NOTE,
            note,
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
 * Удалить много файлов за раз
 * @param fileIds
 * @param noteId
 */
export function removeManyFiles(fileIds, noteId) {
    return async (dispatch, getState) => {
        // Операция удаления на сервере идет медленно - поэтому прогоняем запрос без await
        dispatch(callApi({ endpoint: `files`, method: 'delete', params: { ids: fileIds } }));

        const note = removeNoteFileIds(getState().data.getIn(['notes', noteId]), fileIds);

        const actions = [
            {
                type: SET_NOTE,
                note,
            },
        ];
        fileIds.forEach(fileId => {
            actions.push({
                type: REMOVE_FILE,
                fileId,
            });
        });
        dispatch(batchActions(actions));
    };
}

/**
 * Загрузить файл для заметки
 * @param noteId
 * @param fileObj
 * @param path
 * @param fileName
 */
export function uploadNoteFile({ noteId, fileObj, path, fileName }) {
    return async (dispatch, getState) => {
        let { file } = await dispatch(
            callApi({
                endpoint: `files`,
                method: 'post',
                params: {
                    fileName: fileName || fileObj.name,
                    description: '',
                    noteId,
                },
            }),
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
            ]),
        );

        let { file: uploadedFile } = await dispatch(
            callApi({
                endpoint: `files/${file.get('id')}/upload`,
                uploadFile: fileObj,
                progressFileUpload: ({ percent }) => {
                    file = file.set('_uploadProgress', percent);
                    dispatch({
                        type: SET_FILE,
                        file,
                    });
                },
            }),
        );

        uploadedFile = Immutable.fromJS(uploadedFile);

        dispatch({
            type: SET_FILE,
            file: uploadedFile,
        });

        return uploadedFile;
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
 * Создать группу заметок
 * @param params
 */
export function createGroup(params) {
    return async (dispatch, getState) => {
        let { group } = await dispatch(callApi({ endpoint: `groups`, method: 'post', params }));
        group = Immutable.fromJS(group);

        dispatch({
            type: SET_GROUP,
            group,
        });

        return group;
    };
}

/**
 * Обновить настройки группы
 * @param groupId
 * @param formValues
 */
export function updateGroup(groupId, formValues) {
    return async (dispatch, getState) => {
        let group = getState().data.getIn(['groups', groupId]);
        if (!group) {
            return;
        }

        const params = {};
        if (group.get('title') !== formValues.title) {
            params.title = formValues.title;
            group = group.set('title', formValues.title);
        }

        params.users = [];
        formValues.users.forEach(formUser => {
            if (formUser.deleted) {
                params.users.push(formUser);
                return;
            }
            const groupUser = group.get('users').find(i => i.get('id') === formUser.id);
            if (formUser.role !== groupUser.get('role')) {
                params.users.push(formUser);
            }
        });

        const { updatedAt } = await dispatch(callApi({ endpoint: `groups/${groupId}`, method: 'patch', params }));
        group = group.set('updatedAt', updatedAt);

        // Сбрасываем состояние группы, чтоб в следующий раз загрузить обновленный вариант
        group = group.set('_loaded', false);
        dispatch({
            type: SET_GROUP,
            group,
        });
    };
}

/**
 * Получить настройки группы
 * @param groupId
 */
export function getGroupDetails(groupId) {
    return async (dispatch, getState) => {
        let { group } = await dispatch(callApi({ endpoint: `groups/${groupId}`, method: 'get' }));
        group = Immutable.fromJS(group).set('_loaded', true);

        dispatch({
            type: SET_GROUP,
            group,
        });
    };
}

/**
 * Получение полное содержимое заметки
 * @param noteId
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
 */
export function getInitialData() {
    return async (dispatch, getState) => {
        await dispatch(getNotes());
        await dispatch(getGroups());
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

/**
 * Получение инвайт кода для группы
 * @param groupId
 * @param role
 * @returns {function(*, *): *}
 */
export function getGroupInviteCode(groupId, role) {
    return async (dispatch, getState) => {
        const { code } = await dispatch(callApi({ endpoint: `groups/${groupId}/invite?role=${role}`, method: 'get' }));
        return code;
    };
}

/**
 * Получение инвайт кода для группы
 * @param groupId
 * @param code
 * @returns {function(*, *): *}
 */
export function joinGroup(groupId, code) {
    return async (dispatch, getState) => {
        await dispatch(callApi({ endpoint: `groups/${groupId}/join`, method: 'post', params: { code } }));

        // После этого по новой получаем список заметок и групп
        await dispatch(getInitialData());

        return code;
    };
}
