import * as Immutable from 'immutable';
import { SET_UI_SETTINGS_VALUES } from './actionTypes';

const initialState = new Immutable.Map({
    connectionProblem: false,
    navigationSidebarWidth: 300,
    expendedNavigationTreeNodes: new Immutable.Set(),
    noteContentViewMode: 'combo',
    noteEditorWidth: 50, // проценты
    navigationFilter: '',
    removeNoteAlert: new Immutable.Map({
        isOpen: false,
        noteIs: null,
    }),
    activeNoteFooterTab: null,
    footerContentHeight: 200,
    lastUsedNote: null,
    autoScroll: false,
    editorPosition: 0,
    previewPosition: 0,
    previewNarrowValue: 20,
    previewNarrowEnabled: false,
});

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_UI_SETTINGS_VALUES: {
            const { values } = action;
            return state.merge(values);
        }

        default:
            return state;
    }
}
