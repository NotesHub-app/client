import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Intent } from '@blueprintjs/core';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { userSelector } from '../../../redux/selectors';
import { registration, logout } from '../../../redux/modules/user/actions';
import AlreadyHaveAccountBlock from '../../common/AlreadyHaveAccountBlock';
import { processServerValidationError, minLength, required } from '../../../utils/formValidation';
import InputGroupField from '../../fields/InputGroupField';
import config from '../../../config';
import history from '../../../history';

export class RegistrationPage extends Component {
    state = {
        showCodeBlock: false,
    };

    componentDidMount() {
        const { user, logout } = this.props;

        if (user !== null) {
            logout('/');
        }

        // Если сервер требует рекапчу - подгружаем скрипт рекапчи с сайта гугла
        if (config.serverConfiguration.useRecaptcha) {
            const tag = document.createElement('script');
            tag.src = `https://www.google.com/recaptcha/api.js?render=${config.serverConfiguration.recaptchaClientKey}`;
            document.getElementsByTagName('head')[0].appendChild(tag);
        }
    }

    withCodeBlockSubmit = async params => {
        const { registration } = this.props;
        if (!params.code) {
            return { code: 'Требуется ввести код для продолжения' };
        }
        try {
            await registration(params);
            history.push(`/login?afterRegistration=1&email=${params.email}`);
        } catch (e) {
            return { code: 'Указанный код неверный' };
        }
    };

    withoutCodeBlockSubmit = async params => {
        const { registration } = this.props;
        if (minLength(8)(params.password)) {
            return {
                password: 'Длина пароля должна быть не менее 8 символов',
            };
        }
        try {
            if (config.serverConfiguration.useRecaptcha) {
                params.recaptchaToken = await window.grecaptcha.execute(config.serverConfiguration.recaptchaClientKey, {
                    action: 'registration',
                });
            }

            await registration(params);

            if (config.serverConfiguration.emailRegistrationConfirmation) {
                this.setState({ showCodeBlock: true });
            } else {
                history.push(`/login?afterRegistration=1&email=${params.email}`);
            }
        } catch (e) {
            // Если проверка капчи не удалась
            if (e.status === 403) {
                const errMessage = 'Зафиксированная подозрительная активность. Регистрация невозможна!';
                window.showToast({ message: errMessage, intent: Intent.DANGER, icon: 'lock' });
                return {
                    [FORM_ERROR]: errMessage,
                };
            }
            const serverValidationResult = processServerValidationError(e);
            if (serverValidationResult) {
                return serverValidationResult;
            }

            console.error(e);
            throw e;
        }
    };

    handleSubmit = async params => {
        const { showCodeBlock } = this.state;

        if (showCodeBlock) {
            return this.withCodeBlockSubmit(params);
        }

        return this.withoutCodeBlockSubmit(params);
    };

    getSubmitBtnLabel(submitting) {
        const { showCodeBlock } = this.state;
        let submitBtnLabel = '';

        if (submitting) {
            submitBtnLabel = 'Регистрация...';
        } else if (showCodeBlock) {
            submitBtnLabel = 'Подтвердить регистрацию';
        } else {
            submitBtnLabel = 'Зарегистрироваться';
        }

        return submitBtnLabel;
    }

    render() {
        const { initialValues } = this.props;
        const { showCodeBlock } = this.state;

        return (
            <div className="row full-height no-margin middle-xs">
                <div className="col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 col-xs">
                    <Form
                        onSubmit={this.handleSubmit}
                        initialValues={initialValues}
                        render={({ handleSubmit, pristine, invalid, submitting }) => (
                            <form onSubmit={handleSubmit}>
                                <div className={classNames('bp3-card bp3-elevation-2 no-padding app-loginForm')}>
                                    <div className="app-formTitle">Регистрация</div>

                                    <div className="app-content">
                                        <Field
                                            name="email"
                                            component={InputGroupField}
                                            type="text"
                                            placeholder="Email..."
                                            disabled={showCodeBlock}
                                            leftIcon="envelope"
                                            validate={required}
                                        />

                                        <Field
                                            name="userName"
                                            component={InputGroupField}
                                            type="text"
                                            placeholder="Имя пользователя..."
                                            disabled={showCodeBlock}
                                            leftIcon="user"
                                            validate={required}
                                        />

                                        <Field
                                            name="password"
                                            component={InputGroupField}
                                            type="password"
                                            placeholder="Пароль..."
                                            disabled={showCodeBlock}
                                            leftIcon="lock"
                                        />

                                        {showCodeBlock && (
                                            <div className="app-confirmCodeDescription">
                                                Мы отправили Вам письмо с кодом. Введите его в указанное поле и
                                                подтвердите регистрацию.
                                            </div>
                                        )}

                                        {showCodeBlock && (
                                            <Field
                                                name="code"
                                                component={InputGroupField}
                                                placeholder="Код подтверждения из письма..."
                                                leftIcon="confirm"
                                            />
                                        )}

                                        <div className="text-center">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                style={{ marginTop: 5 }}
                                                className="bp3-button bp3-intent-success bp3-fill bp3-icon-follower"
                                            >
                                                {this.getSubmitBtnLabel(submitting)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    />

                    <AlreadyHaveAccountBlock />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        user: userSelector(state),
    };
}

export default connect(
    mapStateToProps,
    {
        registration,
        logout,
    },
)(RegistrationPage);
