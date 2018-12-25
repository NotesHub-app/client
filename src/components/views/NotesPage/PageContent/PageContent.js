import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
import { Spinner } from '@blueprintjs/core';
import NoteEditor from './NoteEditor';
import { getNoteDetails } from '../../../../redux/modules/data/actions';

export class PageContent extends React.Component {
    static propTypes = {
        noteId: PropTypes.string,
        note: PropTypes.object,
    };

    state = {
        reloading: false,
    };

    checkNoteLoaded() {
        const { note, getNoteDetails } = this.props;

        if (!note.get('_loaded')) {
            getNoteDetails(note.get('id'));
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { note, push } = this.props;

        if (prevProps.noteId !== this.props.noteId) {
            this.setState(
                {
                    reloading: true,
                },
                () => this.setState({ reloading: false }),
            );
        }

        if (!note) {
            push('/notes');
            return;
        }

        if (this.props.note.get('id') !== prevProps.note.get('id')) {
            this.checkNoteLoaded();
        } else if (!this.props.note.get('_loaded') && prevProps.note.get('_loaded')) {
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
        const { reloading } = this.state;

        if (reloading) {
            return <span />;
        }

        if (!note) {
            return <span />;
        }

        if (!note.get('_loaded')) {
            return (
                <div className="loadingContainer">
                    <Spinner size={80} />
                </div>
            );
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
    },
)(PageContent);
