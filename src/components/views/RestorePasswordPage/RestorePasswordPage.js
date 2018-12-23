import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import { push } from 'connected-react-router';
import { Button, Intent } from '@blueprintjs/core';
import { userSelector } from '../../../redux/selectors';
import InputGroupField from '../../fields/InputGroupField';
import { restorePassword } from '../../../redux/modules/user/actions';
import AlreadyHaveAccountBlock from '../../common/AlreadyHaveAccountBlock';
import { processServerValidationError, minLength, required } from '../../../utils/formValidation';

export class RestorePasswordPage extends Component {
    state = {
        showCodeBlock: false,
    };

    componentDidMount() {
        const { user, push } = this.props;

        if (user !== null) {
            push('/');
        }
    }

    withCodeBlockSubmit = async params => {
        const { restorePassword, push } = this.props;
        if (!params.code) {
            return { code: 'Требуется ввести код для продолжения' };
        }
        if (minLength(8)(params.password)) {
            return {
                password: 'Длина пароля должна быть не менее 8 символов',
            };
        }
        try {
            await restorePassword(params);
            push(`/login?afterRestorePassword=1&email=${params.email}`);
        } catch (e) {
            const serverValidationResult = processServerValidationError(e);
            if (serverValidationResult) {
                return serverValidationResult;
            }

            console.error(e);
            throw e;
        }
    };

    withoutCodeBlockSubmit = async params => {
        const { restorePassword } = this.props;
        try {
            await restorePassword(params);
            this.setState({ showCodeBlock: true });
        } catch (e) {
            // Если не прошла валидация
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
            submitBtnLabel = 'Восстановление...';
        } else if (showCodeBlock) {
            submitBtnLabel = 'Назначить новый пароль';
        } else {
            submitBtnLabel = 'Восстановить пароль';
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
                                    <div className="app-formTitle">Восстановление пароля</div>

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

                                        {showCodeBlock && (
                                            <div>
                                                <div className="app-confirmCodeDescription">
                                                    Мы отправили Вам письмо с кодом. <br />
                                                    Введите его вместе с <i>новым</i> паролем!
                                                </div>

                                                <Field
                                                    name="code"
                                                    component={InputGroupField}
                                                    placeholder="Код подтверждения из письма..."
                                                    leftIcon="confirm"
                                                />

                                                <Field
                                                    name="password"
                                                    component={InputGroupField}
                                                    type="password"
                                                    placeholder="Новый пароль..."
                                                    leftIcon="lock"
                                                />
                                            </div>
                                        )}

                                        <div className="text-center">
                                            <Button
                                                intent={Intent.WARNING}
                                                fill
                                                icon="predictive-analysis"
                                                type="submit"
                                                disabled={submitting}
                                                style={{ marginTop: 5 }}
                                            >
                                                {this.getSubmitBtnLabel(submitting)}
                                            </Button>
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
        initialValues: {},
    };
}

export default connect(
    mapStateToProps,
    {
        restorePassword,
        push,
    },
)(RestorePasswordPage);
