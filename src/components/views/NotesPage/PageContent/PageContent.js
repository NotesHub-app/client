import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
        if (this.props.note.get('id') !== prevProps.note.get('id')) {
            this.checkNoteLoaded();
        }
    }

    componentDidMount() {
        this.checkNoteLoaded();
    }

    render() {
        const { note } = this.props;

        if (!note.get('_loaded')) {
            return <div>ЗАГРУЗКА ЗАМЕТКИ...</div>;
        }

        return <NoteEditor note={note} />;
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
    }
)(PageContent);
