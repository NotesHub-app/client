import { SET_USER } from './actionTypes';

const initialState = null;

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_USER: {
            const { user } = action;

            return user;
        }

        default:
            return state;
    }
}
