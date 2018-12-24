import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { push } from 'connected-react-router';
import { Intent } from '@blueprintjs/core';
import styles from './styles.module.scss';
import NotesNavigation from './NotesNavigation';
import NavigationSidebarResizer from './NavigationSidebarResizer';
import PageContent from './PageContent';
import NavigationFilter from './NavigationFilter';
import { setRemoveNoteAlertStatus } from '../../../redux/modules/uiSettings/actions';
import { removeNote } from '../../../redux/modules/data/actions';
import RemoveItemAlert from '../../dialogs/RemoveItemAlert';
import SelectNoteScreen from './SelectNoteScreen';
import NavigationHeader from './NavigationHeader';
import ws from '../../../ws';

export class NotesPage extends React.Component {
    handleConfirmRemoveAlert = () => {
        const { removeNote, removingNoteId } = this.props;

        try {
            removeNote(removingNoteId);
            window.showToast({ message: 'Удаление завершено!', intent: Intent.SUCCESS, icon: 'tick' });
        } catch (e) {
            console.error(e);
        }

        this.handleCloseRemoveAlert();
    };

    handleCloseRemoveAlert = () => {
        const { setRemoveNoteAlertStatus } = this.props;
        setRemoveNoteAlertStatus({
            isOpen: false,
            noteId: null,
        });
    };

    noteSubscribe() {
        const { noteId } = this.props;
        if (noteId) {
            ws.noteSubscribe(noteId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.noteId !== this.props.noteId) {
            this.noteSubscribe();
        }
    }

    componentDidMount() {
        this.noteSubscribe();
    }

    render() {
        const { navigationSidebarWidth, removingAlertIsOpen, ...contentProps } = this.props;
        const { noteId } = this.props;

        return (
            <div className={styles.root}>
                <div
                    className={classNames('bp3-card bp3-elevation-1', styles.navigationSidebar)}
                    style={{
                        width: navigationSidebarWidth,
                    }}
                >
                    <div className={styles.sidebarInner}>
                        <NavigationHeader />
                        <NavigationFilter />
                        <div style={{ flexGrow: 1 }}>
                            <NotesNavigation activeNoteId={noteId} />
                        </div>
                    </div>

                    <NavigationSidebarResizer />
                </div>
                <div className={styles.content} style={{ marginLeft: navigationSidebarWidth + 1 }}>
                    {noteId ? <PageContent {...contentProps} /> : <SelectNoteScreen />}
                </div>

                <RemoveItemAlert
                    isOpen={removingAlertIsOpen}
                    onConfirm={this.handleConfirmRemoveAlert}
                    onCancel={this.handleCloseRemoveAlert}
                    text="Точно хотите удалить выбранную заметку???"
                />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { id } = ownProps.match.params;
    return {
        noteId: id,
        navigationSidebarWidth: state.uiSettings.get('navigationSidebarWidth'),

        removingAlertIsOpen: state.uiSettings.getIn(['removeNoteAlert', 'isOpen']),
        removingNoteId: state.uiSettings.getIn(['removeNoteAlert', 'noteId']),
    };
}

export default connect(
    mapStateToProps,
    {
        setRemoveNoteAlertStatus,
        removeNote,
        push,
    },
)(NotesPage);
