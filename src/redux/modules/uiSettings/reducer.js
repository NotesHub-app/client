import * as Immutable from 'immutable';
import { SET_UI_SETTINGS_VALUES } from './actionTypes';

const initialState = new Immutable.Map({
    connectionProblem: false,
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
