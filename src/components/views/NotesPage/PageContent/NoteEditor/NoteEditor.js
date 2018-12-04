import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Button, Intent } from '@blueprintjs/core';
import styles from './styles.module.scss';
import ContentEditor from './ContentEditor';
import InputTextField from '../../../../fields/InputTextField';
import SelectIconField from '../../../../fields/SelectIconField';
import SelectColorField from '../../../../fields/SelectColorField';
import AlarmLeavingDirtyForm from '../../../../hocs/AlarmLeavingDirtyForm';
import { updateNote } from '../../../../../redux/modules/data/actions';

export class NoteEditor extends React.Component {
    static propTypes = {
        note: PropTypes.object.isRequired,
    };

    onSubmit =  async values => {
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
        const { noteId, handleSubmit, dirty } = this.props;
        return (
            <form className={styles.root} onSubmit={handleSubmit(this.onSubmit)}>
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
                        <Button type="submit" intent={Intent.SUCCESS} icon="floppy-disk" disabled={!dirty}>
                            Сохранить
                        </Button>
                    </div>
                </div>
                <Field name="content" component={ContentEditor} noteId={noteId} />
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
        updateNote
    }
)(
    reduxForm({
        form: 'NoteEditor',
        enableReinitialize: true,
    })(AlarmLeavingDirtyForm(NoteEditor))
);
