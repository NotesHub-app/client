import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { Dialog, Classes, Button, Intent, Label } from '@blueprintjs/core';
import styles from './styles.module.scss';
import InputGroupField from '../../fields/InputGroupField';
import { processServerValidationError } from '../../../utils/formValidation';
import { updateUser } from '../../../redux/modules/user/actions';

const UserSettingsInlineTextField = ({ label, name }) => (
    <label className="bp3-form-group bp3-inline row">
        <div className="col-xs-5 end-xs no-padding label">
            <Label>{label}:</Label>
        </div>
        <div className="col-xs-7">
            <Field name={name} component={InputGroupField} />
        </div>
    </label>
);

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
        const { updateUser, user } = this.props;

        if (params.newPassword) {
            if (!params.oldPassword) {
                return { oldPassword: 'Требуется указать старый пароль' };
            }
            if (!params.confirmPassword) {
                return { confirmPassword: 'Требуется подтвердить введенный пароль' };
            }

            if (params.confirmPassword !== params.newPassword) {
                return { confirmPassword: 'Подтверждение пароля не совпадает' };
            }
        }

        try {
            await updateUser(user.get('id'), params);
            window.showToast({ message: 'Пользовательские данные обновлены!', intent: Intent.SUCCESS, icon: 'tick' });

            this.handleClose();
        } catch (e) {
            const serverValidationResult = processServerValidationError(e);
            if (serverValidationResult) {
                return serverValidationResult;
            }

            console.error(e);
            window.showToast({
                message: 'При сохранении возникли проблемы!',
                intent: Intent.DANGER,
                icon: 'error',
            });
        }
    };

    render() {
        const { isOpen, initialValues } = this.props;

        return (
            <Dialog
                className={styles.root}
                title="Настройки пользователя"
                icon="cog"
                isOpen={isOpen}
                onClose={this.handleClose}
            >
                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={initialValues}
                    render={({ handleSubmit, dirty }) => (
                        <form onSubmit={handleSubmit}>
                            <div className={Classes.DIALOG_BODY}>
                                <UserSettingsInlineTextField label="Имя пользователя" name="userName" />

                                <header>Смена пароля</header>

                                <UserSettingsInlineTextField label="Старый пароль" name="oldPassword" />
                                <UserSettingsInlineTextField label="Новый пароль" name="newPassword" />
                                <UserSettingsInlineTextField label="Подтверждение пароля" name="confirmPassword" />
                            </div>

                            <div className={Classes.DIALOG_FOOTER}>
                                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                    <Button onClick={this.handleClose}>Отмена</Button>

                                    <Button intent={Intent.SUCCESS} type="submit" disabled={!dirty}>
                                        Сохранить настройки
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                />
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
)(UserSettingsDialog);
