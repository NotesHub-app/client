import * as Immutable from 'immutable';

const initialState = new Immutable.Map({
    lastCallStatus: null,
});

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        default:
            return state;
    }
}
