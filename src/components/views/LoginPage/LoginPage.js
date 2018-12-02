import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import classNames from 'classnames';
import { push } from 'connected-react-router';
import styles from './styles.module.scss';
import { userSelector } from '../../../redux/selectors';
import { login } from '../../../redux/modules/user';
import InputTextField from '../../fields/InputTextField';

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
            await login(params);
            push('/');
        } catch (e) {
            throw new SubmissionError({ _error: 'Неверный логин или пароль!' });
        }
    };

    render() {
        const { handleSubmit, pristine, submitting, error } = this.props;

        return (
            <div className="row full-height no-margin middle-xs">
                <form
                    onSubmit={handleSubmit(this.onSubmit)}
                    className="col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 col-xs"
                >
                    <div className={classNames('bp3-card bp3-elevation-3 no-padding', styles.form)}>
                        <div className={styles.formTitle}>NotesHub</div>

                        <div className={styles.content}>
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
                            />

                            <hr className={styles.separator} />

                            <button
                                type="submit"
                                disabled={false && (pristine || submitting)}
                                className="bp3-button bp3-intent-primary bp3-fill bp3-icon-log-in"
                            >
                                {submitting ? 'Вход...' : 'Войти'}
                            </button>

                            {error ? (
                                <div className={classNames('text-danger text-center', styles.errorText)}>
                                    <strong>{error}</strong>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        user: userSelector(state),
        initialValues: {
            email: 'admin@email.com',
            password: 'password',
        },
    };
}

export default connect(mapStateToProps, {
    login,
    push,
})(
    reduxForm({
        form: 'LoginForm',
    })(LoginPage),
);
