import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Button, Intent, Popover, Position } from '@blueprintjs/core';
import { push } from 'connected-react-router';
import styles from './styles.module.scss';
import ContentEditor from './ContentEditor';
import InputTextField from '../../../../fields/InputTextField';
import SelectIconField from '../../../../fields/SelectIconField';
import SelectColorField from '../../../../fields/SelectColorField';
import AlarmLeavingDirtyForm from '../../../../hocs/AlarmLeavingDirtyForm';
import { createNote, updateNote } from '../../../../../redux/modules/data/actions';
import ViewModeSelect from './ViewModeSelect';
import NoteMenu from '../../../../menus/NoteMenu';
import { expendNavigationTreeNode, setRemoveNoteAlertStatus } from '../../../../../redux/modules/uiSettings/actions';
import Footer from './Footer';
import DragFileArea from './DragFileArea';

export class NoteEditor extends React.Component {
    static propTypes = {
        note: PropTypes.object.isRequired,
    };

    onSubmit = async values => {
        const { disableLeaveConfirm, updateNote, noteId } = this.props;
        try {
            disableLeaveConfirm();

            await updateNote(noteId, values);

            window.showToast({ message: 'Заметка сохранена!', intent: Intent.SUCCESS, icon: 'tick' });
        } catch (e) {
            console.warn(e.message);
        }
    };

    render() {
        const {
            noteId,
            note,
            handleSubmit,
            dirty,
            setRemoveNoteAlertStatus,
            expendNavigationTreeNode,
            createNote,
            push,
        } = this.props;
        return (
            <form className={styles.root} onSubmit={handleSubmit(this.onSubmit)}>
                <DragFileArea noteId={noteId}/>
                <div className={styles.header}>
                    <div>
                        <Field name="icon" component={SelectIconField} />
                    </div>

                    <div>
                        <Field name="iconColor" component={SelectColorField} />
                    </div>

                    <div style={{ flexGrow: 1 }}>
                        <Field name="title" component={InputTextField} placeholder="Заголовок заметки..." />
                    </div>

                    <div>
                        <Popover
                            position={Position.BOTTOM}
                            content={
                                <NoteMenu
                                    {...{
                                        setRemoveNoteAlertStatus,
                                        expendNavigationTreeNode,
                                        createNote,
                                        push,
                                    }}
                                    noteId={note.get('id')}
                                />
                            }
                        >
                            <Button icon="chevron-down" minimal />
                        </Popover>
                    </div>

                    <div>
                        <Button type="submit" intent={Intent.SUCCESS} icon="floppy-disk" disabled={!dirty}>
                            Сохранить
                        </Button>
                    </div>
                    <div className={styles.separator} />
                    <div>
                        <ViewModeSelect />
                    </div>
                </div>
                <Field name="content" component={ContentEditor} noteId={noteId} />
                <Footer noteId={noteId}/>
            </form>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { note } = ownProps;
    return {
        noteId: note.get('id'),
        initialValues: {
            title: note.get('title'),
            icon: note.get('icon'),
            iconColor: note.get('iconColor'),
            content: note.get('content'),
        },
    };
}

export default connect(
    mapStateToProps,
    {
        updateNote,

        setRemoveNoteAlertStatus,
        expendNavigationTreeNode,
        createNote,
        push,
    },
)(
    reduxForm({
        form: 'NoteEditor',
        enableReinitialize: true,
    })(AlarmLeavingDirtyForm(NoteEditor)),
);
