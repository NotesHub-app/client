import * as Immutable from 'immutable';
import forEach from 'lodash/forEach';
import { SET_NOTES, SET_NOTE, SET_GROUPS, RESET_DATA } from './actionTypes';
import { callApi } from '../../../utils/api';
import { listToMap } from '../../../utils/immutable';

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

export function getNoteDetails(noteId) {
    return async (dispatch, getState) => {
        let { note } = await dispatch(callApi({ endpoint: `notes/${noteId}`, method: 'get' }));

        note = Immutable.fromJS(note).set('_loaded', true);

        dispatch({
            type: SET_NOTE,
            note,
        });
    };
}

export function getInitialData() {
    return async (dispatch, getState) => {
        dispatch(getNotes());
        dispatch(getGroups());
    };
}

export function resetData() {
    return {
        type: RESET_DATA,
    };
}
