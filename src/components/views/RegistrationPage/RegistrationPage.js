import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import classNames from 'classnames';
import { push } from 'connected-react-router';
import { userSelector } from '../../../redux/selectors';
import InputTextField from '../../fields/InputTextField';
import { registration, logout } from '../../../redux/modules/user/actions';
import * as formValidation from '../../../utils/formValidation';
import AlreadyHaveAccountBlock from '../../common/AlreadyHaveAccountBlock';

export class RegistrationPage extends Component {
    state = {
        showCodeBlock: false,
    };

    componentDidMount() {
        const { user, logout } = this.props;

        if (user !== null) {
            logout('/');
        }
    }

    onSubmit = async params => {
        const { registration, push } = this.props;
        const { showCodeBlock } = this.state;

        if (showCodeBlock) {
            if (!params.code) {
                throw new SubmissionError({ code: 'Требуется ввести код для продолжения' });
            }
            try {
                await registration(params);
                push(`/login?afterRegistration=1&email=${params.email}`);
            } catch (e) {
                throw new SubmissionError({ code: 'Указанный код неверный' });
            }
        } else {
            if (formValidation.minLength(8)(params.password)) {
                throw new SubmissionError({
                    password: 'Длина пароля должна быть не менее 8 символов',
                });
            }
            try {
                await registration(params);
                this.setState({ showCodeBlock: true });
            } catch (e) {
                // Если не прошла валидация
                if (e.status === 422) {
                    const errorObj = {};
                    e.response.body.errors.forEach(({ param, msg }) => {
                        errorObj[param] = 'Недопустимое значение';
                    });
                    throw new SubmissionError(errorObj);
                }
                console.error(e);
            }
        }
    };

    render() {
        const { handleSubmit, submitting } = this.props;
        const { showCodeBlock } = this.state;

        let submitBtnLabel = '';
        if (submitting) {
            submitBtnLabel = 'Регистрация...';
        } else if (showCodeBlock) {
            submitBtnLabel = 'Подтвердить регистрацию';
        } else {
            submitBtnLabel = 'Зарегистрироваться';
        }

        return (
            <div className="row full-height no-margin middle-xs">
                <form
                    onSubmit={handleSubmit(this.onSubmit)}
                    className="col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 col-xs"
                >
                    <div className={classNames('bp3-card bp3-elevation-2 no-padding app-loginForm')}>
                        <div className="app-formTitle">Регистрация</div>

                        <div className="app-content">
                            <Field
                                name="email"
                                component={InputTextField}
                                type="text"
                                placeholder="Email..."
                                disabled={showCodeBlock}
                                leftIcon="user"
                                className="bp3-form-group"
                                validate={[formValidation.required]}
                            />

                            <Field
                                name="password"
                                component={InputTextField}
                                type="password"
                                placeholder="Пароль..."
                                disabled={showCodeBlock}
                                leftIcon="lock"
                                className="bp3-form-group"
                            />

                            {showCodeBlock && (
                                <div className="app-confirmCodeDescription">
                                    Мы отправили Вам письмо с кодом. Введите его в указанное поле и подтвердите
                                    регистрацию.
                                </div>
                            )}

                            {showCodeBlock && (
                                <Field
                                    name="code"
                                    component={InputTextField}
                                    placeholder="Код подтверждения из письма..."
                                    leftIcon="confirm"
                                    className="bp3-form-group"
                                />
                            )}

                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{ marginTop: 5 }}
                                    className="bp3-button bp3-intent-success bp3-fill bp3-icon-follower"
                                >
                                    {submitBtnLabel}
                                </button>
                            </div>
                        </div>
                    </div>

                    <AlreadyHaveAccountBlock />
                </form>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        user: userSelector(state),
        initialValues: {},
    };
}

export default connect(
    mapStateToProps,
    {
        registration,
        push,
        logout,
    }
)(
    reduxForm({
        form: 'RegistrationForm',
    })(RegistrationPage)
);
