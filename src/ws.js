import socketIoClient from 'socket.io-client';
import * as Immutable from 'immutable';
import config from './config';
import { SET_NOTE } from './redux/modules/data/actionTypes';

class WS {
    init(store) {
        this.store = store;
        this.io = socketIoClient(config.socketUrl);

        this.io.on('note:updated', this.handleNoteUpdated);
    }

    auth(token) {
        this.io.emit('auth', { token });
    }

    handleNoteUpdated = ({ note }) => {
        note = Immutable.fromJS(note);
        this.store.dispatch({
            type: SET_NOTE,
            note,
        });
    }
}

export default new WS();
