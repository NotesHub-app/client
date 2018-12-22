import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { FORM_ERROR } from 'final-form';
import styles from './styles.module.scss';
import { loginFormUrlParamsSelector, userSelector } from '../../../redux/selectors';
import { login } from '../../../redux/modules/user/actions';
import CheckboxField from '../../fields/CheckboxField/CheckboxField';
import config from '../../../config';
import { processServerValidationError } from '../../../utils/formValidation';
import InputGroupField from '../../fields/InputGroupField';

export class LoginPage extends Component {
    componentDidMount() {
        const { user, push } = this.props;

        if (user !== null) {
            push('/');
        }
    }

    handleSubmit = async params => {
        const { login, push, back } = this.props;

        try {
            localStorage.setItem('noteshub:lastEmail', params.email);

            await login(params);

            if (back) {
                push(back);
            } else {
                push('/');
            }
        } catch (e) {
            if (e.status === 401) {
                return { [FORM_ERROR]: 'Неверный логин или пароль!' };
            }
            const serverValidationResult = processServerValidationError(e);
            if (serverValidationResult) {
                return serverValidationResult;
            }

            console.error(e);
            throw e;
        }
    };

    render() {
        const { afterRegistration, afterRestorePassword, initialValues } = this.props;

        return (
            <div className="row full-height no-margin middle-xs">
                <div className="col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 col-xs">
                    <Form
                        onSubmit={this.handleSubmit}
                        initialValues={initialValues}
                        render={({ handleSubmit, pristine, invalid, submitting, submitError }) => (
                            <form onSubmit={handleSubmit}>
                                <div className={classNames('bp3-card bp3-elevation-2 no-padding app-loginForm')}>
                                    <div className="app-formTitle">NotesHub</div>

                                    <div className="app-content">
                                        {afterRegistration && (
                                            <div className={styles.afterMessage}>
                                                Спасибо за регистрацию!
                                                <br /> Теперь вы можете авторизоваться.
                                            </div>
                                        )}
                                        {afterRestorePassword && (
                                            <div className={styles.afterMessage}>
                                                Пароль успешно восстановлен. <br /> Используйте его для входа в систему.
                                            </div>
                                        )}

                                        <Field
                                            name="email"
                                            component={InputGroupField}
                                            type="text"
                                            placeholder="Email..."
                                            leftIcon="envelope"
                                        />

                                        <Field
                                            name="password"
                                            component={InputGroupField}
                                            type="password"
                                            placeholder="Пароль..."
                                            leftIcon="lock"
                                            autoFocus={afterRegistration || afterRestorePassword}
                                        />

                                        <div className="row">
                                            <div className="col-xs-6">
                                                <Field
                                                    name="remember"
                                                    component={CheckboxField}
                                                    type="checkbox"
                                                    label="Запомнить меня"
                                                />
                                            </div>
                                            <div className="col-xs-6 end-xs">
                                                <Link to="/restore-password">Восстановить пароль</Link>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                style={{ marginTop: 5 }}
                                                className="bp3-button bp3-intent-primary bp3-fill bp3-icon-log-in"
                                            >
                                                {submitting ? 'Вход...' : 'Войти'}
                                            </button>
                                        </div>

                                        {submitError ? (
                                            <div className={classNames('text-danger text-center', styles.errorText)}>
                                                <strong>{submitError}</strong>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </form>
                        )}
                    />

                    <div className={classNames(styles.noAccountBlock)}>
                        Нет аккаунта? <Link to="/registration">Зарегистрироваться!</Link>
                        <div className="text-muted" style={{ marginTop: 20 }}>
                            &mdash; или войти через &mdash;
                        </div>
                        <div className={styles.externalAuthServices}>
                            <a href={`${config.apiUrl}/auth/google`} className="item">
                                <img
                                    src="/static/icons/google.svg"
                                    alt="_"
                                    className={classNames(styles.icon, styles.googleIcon)}
                                />
                                <br />
                                Google
                            </a>

                            <a href={`${config.apiUrl}/auth/github`} className="item">
                                <img
                                    src="/static/icons/github.svg"
                                    alt="_"
                                    className={classNames(styles.icon, styles.githubIcon)}
                                />
                                <br />
                                Github
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const loginFormUrlParams = loginFormUrlParamsSelector(window.location.href);
    const lastEmail = localStorage.getItem('noteshub:lastEmail') || '';
    return {
        ...loginFormUrlParams,
        user: userSelector(state),
        initialValues: {
            remember: true,
            email: loginFormUrlParams.email || lastEmail,
        },
    };
}

export default connect(mapStateToProps, {
    login,
    push,
})(LoginPage);
