import React from 'react';
import { connect } from 'react-redux';
import { Alert, Intent } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import { setRemoveNoteAlertStatus } from '../../../../redux/modules/uiSettings/actions';
import { removeNote } from '../../../../redux/modules/data/actions';

export class RemoveNoteAlert extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        noteId: PropTypes.string,
    };

    handleConfirm = () => {
        const { removeNote, noteId } = this.props;

        removeNote(noteId);

        this.handleClose();
    };

    handleClose = () => {
        const { setRemoveNoteAlertStatus } = this.props;
        setRemoveNoteAlertStatus({
            isOpen: false,
            noteId: null,
        });
    };

    render() {
        const { isOpen } = this.props;

        return (
            <Alert
                icon="trash"
                intent={Intent.DANGER}
                isOpen={isOpen}
                confirmButtonText="Удалить"
                cancelButtonText="Отмена"
                onConfirm={this.handleConfirm}
                onCancel={this.handleClose}
            >
                <p>Точно хотите удалить выбранную заметку???</p>
            </Alert>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        isOpen: state.uiSettings.getIn(['removeNoteAlert', 'isOpen']),
        noteId: state.uiSettings.getIn(['removeNoteAlert', 'noteId']),
    };
}

export default connect(
    mapStateToProps,
    {
        setRemoveNoteAlertStatus,
        removeNote,
    }
)(RemoveNoteAlert);
