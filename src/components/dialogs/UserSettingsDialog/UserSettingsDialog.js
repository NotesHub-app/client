import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Dialog, Classes, Button, Intent, Label } from '@blueprintjs/core';
import styles from './styles.module.scss';
import InputTextField from '../../fields/InputTextField/InputTextField';
import SelectButtonsField from '../../fields/SelectButtonsField/SelectButtonsField';

export class UserSettingsDialog extends React.Component {
    static defaultProps = {
        onClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
    };

    handleClose = () => {
        const { onClose } = this.props;
        onClose();
    };

    handleSubmit = params => {
        alert(1);
    };

    render() {
        const { isOpen, handleSubmit } = this.props;

        return (
            <Dialog
                className={styles.root}
                title="Настройки пользователя"
                icon="cog"
                isOpen={isOpen}
                onClose={this.handleClose}
            >
                <div className={Classes.DIALOG_BODY}>
                    <Label className="bp3-inline">
                        Описание
                        <Field name="title" component={InputTextField} />
                    </Label>

                    <Label className="bp3-inline">
                        Тема
                        <Field
                            name="theme"
                            component={SelectButtonsField}
                            options={[{ label: 'Темная', value: 'dark' }, { label: 'Светлая', value: 'light' }]}
                        />
                    </Label>
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this.handleClose}>Отмена</Button>

                        <Button intent={Intent.PRIMARY} onClick={handleSubmit(this.handleSubmit)}>
                            Сохранить
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
        initialValues: {},
    };
}

export default connect(
    mapStateToProps,
    {}
)(
    reduxForm({
        form: 'UserSettings',
        enableReinitialize: true,
    })(UserSettingsDialog)
);
