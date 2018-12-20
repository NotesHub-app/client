import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Dialog, Classes, Button, Intent, Label } from '@blueprintjs/core';
import styles from './styles.module.scss';
import InputTextField from '../../fields/InputTextField/InputTextField';
import { processServerValidationError } from '../../../utils/formValidation';
import { updateUser } from '../../../redux/modules/user/actions';

export class UserSettingsDialog extends React.Component {
    static defaultProps = {
        onClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
    };

    handleClose = () => {
        const { onClose } = this.props;
        onClose();
    };

    handleSubmit = async params => {
        const { updateUser, user, reset } = this.props;

        if (params.newPassword) {
            if (!params.oldPassword) {
                throw new SubmissionError({ code: 'Требуется указать старый пароль' });
            }
            if (!params.confirmPassword) {
                throw new SubmissionError({ code: 'Требуется подтвердить введенный пароль' });
            }

            if (params.confirmPassword !== params.newPassword) {
                throw new SubmissionError({ code: 'Подтверждение пароля не совпадает' });
            }
        }

        try {
            await updateUser(user.get('id'), params);
            window.showToast({ message: 'Пользовательские данные обновлены!', intent: Intent.SUCCESS, icon: 'tick' });

            reset();
            this.handleClose();
        } catch (e) {
            processServerValidationError(e);

            console.error(e);
            window.showToast({
                message: 'При сохранении возникли проблемы!',
                intent: Intent.DANGER,
                icon: 'error',
            });
        }
    };

    render() {
        const { isOpen, handleSubmit, dirty } = this.props;

        return (
            <Dialog
                className={styles.root}
                title="Настройки пользователя"
                icon="cog"
                isOpen={isOpen}
                onClose={this.handleClose}
            >
                <div className={Classes.DIALOG_BODY}>
                    <div className="bp3-form-group bp3-inline row">
                        <div className="col-xs-5 end-xs no-padding">
                            <Label>Имя пользователя:</Label>
                        </div>
                        <div className="col-xs-7">
                            <Field name="userName" component={InputTextField} />
                        </div>
                    </div>

                    <header>Смена пароля</header>

                    <div className="bp3-form-group bp3-inline row">
                        <div className="col-xs-5 end-xs no-padding">
                            <Label>Старый пароль:</Label>
                        </div>
                        <div className="col-xs-7">
                            <Field name="oldPassword" component={InputTextField} type="password" />
                        </div>
                    </div>

                    <div className="bp3-form-group bp3-inline row">
                        <div className="col-xs-5 end-xs no-padding">
                            <Label>Новый пароль:</Label>
                        </div>
                        <div className="col-xs-7">
                            <Field name="newPassword" component={InputTextField} type="password" />
                        </div>
                    </div>

                    <div className="bp3-form-group bp3-inline row">
                        <div className="col-xs-5 end-xs no-padding">
                            <Label>Подтверждение пароля:</Label>
                        </div>
                        <div className="col-xs-7">
                            <Field name="confirmPassword" component={InputTextField} type="password" />
                        </div>
                    </div>
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this.handleClose}>Отмена</Button>

                        <Button intent={Intent.SUCCESS} onClick={handleSubmit(this.handleSubmit)} disabled={!dirty}>
                            Сохранить настройки
                        </Button>
                    </div>
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { user } = state;
    return {
        user,
        initialValues: {
            userName: user.get('userName'),
        },
    };
}

export default connect(
    mapStateToProps,
    {
        updateUser,
    }
)(
    reduxForm({
        form: 'UserSettings',
        enableReinitialize: true,
    })(UserSettingsDialog)
);
