import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Dialog, Classes, Button, Intent, Label } from '@blueprintjs/core';
import styles from './styles.module.scss';
import InputTextField from '../../fields/InputTextField/InputTextField';
import { createGroup } from '../../../redux/modules/data/actions';
import { processServerValidationError } from '../../../utils/formValidation';

export class AddGroupDialog extends React.Component {
    static defaultProps = {
        onClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
    };

    handleClose = () => {
        const { onClose } = this.props;
        onClose();
    };

    handleSubmit = async params => {
        const { createGroup } = this.props;
        try {
            await createGroup(params);
            window.showToast({ message: 'Создание группы завершено!', intent: Intent.SUCCESS, icon: 'tick' });
            this.handleClose();
        } catch (e) {
            processServerValidationError(e);

            console.error(e);
            window.showToast({
                message: 'При создании группы возникли проблемы!',
                intent: Intent.DANGER,
                icon: 'error',
            });
        }
    };

    render() {
        const { isOpen, handleSubmit } = this.props;

        return (
            <Dialog
                className={styles.root}
                title="Добавление группы заметок"
                icon="plus"
                isOpen={isOpen}
                onClose={this.handleClose}
            >
                <div className={Classes.DIALOG_BODY}>
                    <Label style={{marginBottom: 0}}>
                        Название группы
                        <Field name="title" component={InputTextField} />
                    </Label>
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this.handleClose}>Отмена</Button>

                        <Button intent={Intent.PRIMARY} onClick={handleSubmit(this.handleSubmit)}>
                            Создать группу
                        </Button>
                    </div>
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        user: state.user,
        initialValues: {
            title: 'Новая группа'
        },
    };
}

export default connect(
    mapStateToProps,
    {
        createGroup,
    }
)(
    reduxForm({
        form: 'AddGroup',
        enableReinitialize: true,
    })(AddGroupDialog)
);
