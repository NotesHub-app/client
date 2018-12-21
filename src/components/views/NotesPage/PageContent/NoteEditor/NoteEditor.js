import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { Button, Popover, Position } from '@blueprintjs/core';
import { push } from 'connected-react-router';
import styles from './styles.module.scss';
import ContentEditor from './ContentEditor';
import SelectIconField from '../../../../fields/SelectIconField';
import SelectColorField from '../../../../fields/SelectColorField';
import { createNote, updateNote } from '../../../../../redux/modules/data/actions';
import ViewModeSelect from './ViewModeSelect';
import NoteMenu from '../../../../menus/NoteMenu';
import { expendNavigationTreeNode, setRemoveNoteAlertStatus } from '../../../../../redux/modules/uiSettings/actions';
import Footer from './Footer';
import DragFileArea from './DragFileArea';
import InputGroupField from '../../../../fields/InputGroupField';
import AutoSave from './AutoSave';

export class NoteEditor extends React.Component {
    static propTypes = {
        note: PropTypes.object.isRequired,
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.noteId !== nextProps.noteId) {
            this.submit();
        }
    }

    handleSubmit = async values => {
        const { updateNote, noteId } = this.props;
        try {
            await updateNote(noteId, values);
        } catch (e) {
            console.warn(e.message);
        }
    };

    render() {
        const { noteId, note, setRemoveNoteAlertStatus, expendNavigationTreeNode, createNote, push } = this.props;
        return (
            <Form
                onSubmit={this.handleSubmit}
                initialValues={{
                    title: note.get('title'),
                    icon: note.get('icon'),
                    iconColor: note.get('iconColor'),
                    content: note.get('content'),
                }}
                subscription={{}}
                render={({ handleSubmit, dirty }) => {
                    this.submit = handleSubmit;
                    return (
                        <div className={styles.root} onSubmit={handleSubmit}>
                            <AutoSave debounce={1000} save={this.handleSubmit} />

                            <DragFileArea noteId={noteId} />
                            <div className={styles.header}>
                                <div>
                                    <Field name="icon" component={SelectIconField} />
                                </div>

                                <div>
                                    <Field name="iconColor" component={SelectColorField} />
                                </div>

                                <div style={{ flexGrow: 1 }}>
                                    <Field
                                        name="title"
                                        component={InputGroupField}
                                        placeholder="Заголовок заметки..."
                                    />
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
                                                note={note}
                                            />
                                        }
                                    >
                                        <Button icon="chevron-down" minimal />
                                    </Popover>
                                </div>

                                <div>
                                    <ViewModeSelect />
                                </div>
                            </div>
                            <Field name="content" component={ContentEditor} noteId={noteId} />
                            <Footer noteId={noteId} />
                        </div>
                    );
                }}
            />
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { note } = ownProps;
    return {
        noteId: note.get('id'),
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
    }
)(NoteEditor);
