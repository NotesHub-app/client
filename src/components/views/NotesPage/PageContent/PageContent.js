import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
import NoteEditor from './NoteEditor';
import { getNoteDetails } from '../../../../redux/modules/data/actions';

export class PageContent extends React.Component {
    static propTypes = {
        noteId: PropTypes.string,
        note: PropTypes.object.isRequired,
    };

    checkNoteLoaded() {
        const { note, getNoteDetails } = this.props;

        if (!note.get('_loaded')) {
            getNoteDetails(note.get('id'));
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { note, push } = this.props;

        if (!note) {
            push('/notes');
            return;
        }
        if (this.props.note.get('id') !== prevProps.note.get('id')) {
            this.checkNoteLoaded();
        }
    }

    componentDidMount() {
        const { note, push } = this.props;

        if (!note) {
            push('/notes');
            return;
        }
        this.checkNoteLoaded();
    }

    render() {
        const { note } = this.props;

        if (!note) {
            return <span />;
        }

        if (!note.get('_loaded')) {
            return <div>ЗАГРУЗКА ЗАМЕТКИ...</div>;
        }

        return <NoteEditor {...this.props} />;
    }
}

function mapStateToProps(state, ownProps) {
    const { noteId } = ownProps;
    return {
        note: state.data.getIn(['notes', noteId]),
    };
}

export default connect(
    mapStateToProps,
    {
        getNoteDetails,
        push,
    }
)(PageContent);
