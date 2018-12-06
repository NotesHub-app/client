import * as Immutable from 'immutable';
import { SET_NOTES, SET_NOTE, SET_GROUPS, SET_USERS, SET_FILES, RESET_DATA, REMOVE_NOTE } from './actionTypes';
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
        case SET_GROUPS: {
            const { groups } = action;

            return state.set('groups', groups);
        }
        case SET_USERS: {
            const { users } = action;

            return state.set('users', users);
        }
        case SET_FILES: {
            const { files } = action;

            return state.set('files', files);
        }

        default:
            return state;
    }
}
