import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import styles from './styles.module.scss';
import { loginFormUrlParamsSelector, userSelector } from '../../../redux/selectors';
import { login } from '../../../redux/modules/user';
import InputTextField from '../../fields/InputTextField';
import CheckboxField from '../../fields/CheckboxField/CheckboxField';

export class LoginPage extends Component {
    state = {
        wrong: false,
    };

    componentDidMount() {
        const { user, push } = this.props;

        if (user !== null) {
            push('/');
        }
    }

    onSubmit = async params => {
        const { login, push } = this.props;

        try {
            localStorage.setItem('noteshub:lastEmail', params.email);

            await login(params);
            push('/');
        } catch (e) {
            throw new SubmissionError({ _error: 'Неверный логин или пароль!' });
        }
    };

    render() {
        const { handleSubmit, submitting, error, afterRegistration, afterRestorePassword } = this.props;

        return (
            <div className="row full-height no-margin middle-xs">
                <form
                    onSubmit={handleSubmit(this.onSubmit)}
                    className="col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 col-xs"
                >
                    <div className={classNames('bp3-card bp3-elevation-2 no-padding app-loginForm')}>
                        <div className="app-formTitle">NotesHub</div>

                        <div className="app-content">
                            {afterRegistration && (
                                <div className={styles.afterMessage}>
                                    Спасибо за регистрацию!<br /> Теперь вы можете авторизоваться.
                                </div>
                            )}
                            {afterRestorePassword && (
                                <div className={styles.afterMessage}>
                                    Пароль успешно восстановлен. <br /> Используйте его для входа в систему.
                                </div>
                            )}

                            <Field
                                name="email"
                                component={InputTextField}
                                type="text"
                                placeholder="Email..."
                                leftIcon="user"
                                className="bp3-form-group"
                            />

                            <Field
                                name="password"
                                component={InputTextField}
                                type="password"
                                placeholder="Пароль..."
                                leftIcon="lock"
                                className="bp3-form-group"
                                autoFocus={afterRegistration || afterRestorePassword}
                            />

                            <div className="row">
                                <div className="col-xs-6">
                                    <Field name="remember" component={CheckboxField} label="Запомнить меня" />
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

                            {error ? (
                                <div className={classNames('text-danger text-center', styles.errorText)}>
                                    <strong>{error}</strong>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className={classNames(styles.noAccountBlock)}>
                        Нет аккаунта? <Link to="/registration">Зарегистрироваться!</Link>
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const loginFormUrlParams = loginFormUrlParamsSelector(window.location.href);
    const lastEmail = localStorage.getItem('noteshub:lastEmail') || '';
    return {
        user: userSelector(state),
        afterRegistration: loginFormUrlParams.afterRegistration,
        afterRestorePassword: loginFormUrlParams.afterRestorePassword,
        initialValues: {
            email: loginFormUrlParams.email || lastEmail,
        },
    };
}

export default connect(
    mapStateToProps,
    {
        login,
        push,
    }
)(
    reduxForm({
        form: 'LoginForm',
    })(LoginPage)
);
