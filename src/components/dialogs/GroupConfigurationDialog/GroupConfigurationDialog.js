import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Dialog, Classes, Button, Intent, Label } from '@blueprintjs/core';
import styles from './styles.module.scss';
import InputTextField from '../../fields/InputTextField/InputTextField';
import { getGroupDetails, updateGroup } from '../../../redux/modules/data/actions';
import { processServerValidationError } from '../../../utils/formValidation';
import GroupUsersField from '../../fields/GroupUsersField';

export class GroupConfigurationDialog extends React.Component {
    static defaultProps = {
        onClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
    };

    handleClose = () => {
        const { onClose } = this.props;
        onClose();
    };

    handleSubmit = async params => {
        const { updateGroup, groupId } = this.props;
        try {
            await updateGroup(groupId, params);
            window.showToast({ message: 'Настройки группы обновлены!', intent: Intent.SUCCESS, icon: 'tick' });
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.isOpen && this.props.isOpen) {
            const { groupLoaded, groupId } = this.props;
            if (!groupLoaded) {
                const { getGroupDetails } = this.props;
                getGroupDetails(groupId);
            }
        }
    }

    render() {
        const { isOpen, handleSubmit, groupLoaded, dirty } = this.props;

        return (
            <Dialog
                className={styles.root}
                title="Настройки группы"
                icon="cog"
                isOpen={isOpen}
                onClose={this.handleClose}
            >
                {groupLoaded && isOpen ? (
                    <div className={Classes.DIALOG_BODY}>
                        <Label>
                            Название группы
                            <Field name="title" component={InputTextField} />
                        </Label>

                        <Field name="users" component={GroupUsersField} />
                    </div>
                ) : (
                    <div className={Classes.DIALOG_BODY}>Загрузка группы...</div>
                )}

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this.handleClose}>Отмена</Button>

                        <Button
                            intent={Intent.SUCCESS}
                            onClick={handleSubmit(this.handleSubmit)}
                            icon="floppy-disk"
                            disabled={!groupLoaded || !dirty}
                        >
                            Сохранить
                        </Button>
                    </div>
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { groupId } = ownProps;
    const group = state.data.getIn(['groups', groupId]);
    const groupLoaded = !!(group && group.get('_loaded'));
    return {
        user: state.user,
        groupLoaded,
        initialValues: {
            title: groupLoaded && group.get('title'),
            users: groupLoaded && group.get('users').toJS(),
        },
    };
}

export default connect(
    mapStateToProps,
    {
        updateGroup,
        getGroupDetails,
    }
)(
    reduxForm({
        form: 'AddGroup',
        enableReinitialize: true,
    })(GroupConfigurationDialog)
);
