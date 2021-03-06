import * as Immutable from 'immutable';
import {
    SET_NOTES,
    SET_NOTE,
    SET_GROUPS,
    SET_GROUP,
    SET_USERS,
    SET_FILES,
    SET_FILE,
    RESET_DATA,
    REMOVE_NOTE,
    REMOVE_FILE,
} from './actionTypes';
import { removeNoteWithChildren } from '../../../utils/data';

const initialState = new Immutable.Map({
    notes: null,
    groups: null,
    users: new Immutable.Map(),
    files: new Immutable.Map(),
});

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case RESET_DATA: {
            return initialState;
        }

        // Notes
        case SET_NOTES: {
            const { notes } = action;

            return state.set('notes', notes);
        }
        case SET_NOTE: {
            const { note } = action;

            return state.setIn(['notes', note.get('id')], note);
        }
        case REMOVE_NOTE: {
            const { noteId } = action;

            return state.set('notes', removeNoteWithChildren(state.get('notes', new Immutable.Map()), noteId));
        }

        // Groups
        case SET_GROUPS: {
            const { groups } = action;

            return state.set('groups', groups);
        }
        case SET_GROUP: {
            const { group } = action;

            return state.setIn(['groups', group.get('id')], group);
        }

        // Users
        case SET_USERS: {
            const { users } = action;

            return state.set('users', users);
        }

        // Files
        case SET_FILES: {
            const { files } = action;

            return state.set('files', files);
        }
        case SET_FILE: {
            const { file } = action;
            return state.setIn(['files', file.get('id')], file);
        }
        case REMOVE_FILE: {
            const { fileId } = action;
            return state.set('files', state.get('files', new Immutable.Map()).delete(fileId));
        }

        default:
            return state;
    }
}
