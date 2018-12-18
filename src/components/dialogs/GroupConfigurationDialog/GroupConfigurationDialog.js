import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Dialog, Classes, Button, Intent, Label, Alert, Popover, Menu, MenuItem, Position } from '@blueprintjs/core';
import styles from './styles.module.scss';
import InputTextField from '../../fields/InputTextField/InputTextField';
import { getGroupDetails, getGroupInviteCode, updateGroup } from '../../../redux/modules/data/actions';
import { processServerValidationError } from '../../../utils/formValidation';
import GroupUsersField from '../../fields/GroupUsersField';
import config from '../../../config';

export class GroupConfigurationDialog extends React.Component {
    static defaultProps = {
        onClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
    };

    state = {
        isOpenCopyLinkAlert: false,
        linkToCopy: null,
    };

    handleCloseCopyLinkAlert = () => {
        this.setState({
            isOpenCopyLinkAlert: false,
            linkToCopy: false,
        });
    };

    handleCopyLink = () => {
        const input = this.copyTextInput;
        input.select();
        document.execCommand('copy');

        window.showToast({ message: 'Ссылка скопирована!', intent: Intent.PRIMARY, icon: 'clipboard' });
    };

    handleOpenCopyLinkAlert = linkToCopy => {
        this.setState(
            {
                isOpenCopyLinkAlert: true,
                linkToCopy,
            },
            () => {
                setTimeout(() => {
                    const input = this.copyTextInput;
                    input.select();
                }, 100);
            }
        );
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

    getInviteGroupUrl(code) {
        const { groupId } = this.props;
        return `${config.siteUrl}/#/joinGroup/${groupId}/${code}`;
    }

    handleInviteEditor = async () => {
        const { getGroupInviteCode, groupId } = this.props;
        const code = await getGroupInviteCode(groupId, 1);

        this.handleOpenCopyLinkAlert(this.getInviteGroupUrl(code));
    };

    handleInviteViewer = async () => {
        const { getGroupInviteCode, groupId } = this.props;
        const code = await getGroupInviteCode(groupId, 2);

        this.handleOpenCopyLinkAlert(this.getInviteGroupUrl(code));
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { getGroupDetails } = this.props;

        if (!prevProps.isOpen && this.props.isOpen) {
            // Когда открыли окно, но данные по группе не загружены
            const { groupLoaded, groupId } = this.props;
            if (!groupLoaded) {
                getGroupDetails(groupId);
            }
        } else if (this.props.isOpen) {
            // когда обнова группы прилетела по сокетам и открыто окно настроек группы
            if (prevProps.groupLoaded && !this.props.groupLoaded) {
                getGroupDetails(this.props.groupId);
            }
        }
    }

    render() {
        const { isOpen, handleSubmit, groupLoaded, dirty } = this.props;
        const { isOpenCopyLinkAlert, linkToCopy } = this.state;

        return (
            <>
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
                        <div className={Classes.DIALOG_FOOTER_ACTIONS} style={{ float: 'left' }}>
                            <Popover
                                content={
                                    <Menu>
                                        <MenuItem
                                            text="Для редактирования"
                                            icon="annotation"
                                            onClick={this.handleInviteEditor}
                                        />
                                        <MenuItem
                                            text="Только для чтения"
                                            icon="eye-open"
                                            onClick={this.handleInviteViewer}
                                        />
                                    </Menu>
                                }
                                position={Position.BOTTOM}
                            >
                                <Button icon="new-person" intent={Intent.PRIMARY}>
                                    Пригласить в группу
                                </Button>
                            </Popover>
                        </div>

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
                <Alert confirmButtonText="Закрыть" isOpen={isOpenCopyLinkAlert} onClose={this.handleCloseCopyLinkAlert}>
                    <div>
                        <div className={styles.copyTextMessage}>
                            Скопируйте ссылку и отправте её друзьям для приглашения в группу
                        </div>

                        <div className="bp3-input-group">
                            <input
                                type="text"
                                className="bp3-input"
                                readOnly
                                value={linkToCopy}
                                ref={i => (this.copyTextInput = i)}
                            />
                            <button className="bp3-button bp3-icon-clipboard" onClick={this.handleCopyLink} />
                        </div>
                    </div>
                </Alert>
            </>
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
        getGroupInviteCode,
    }
)(
    reduxForm({
        form: 'GroupConfiguration',
        enableReinitialize: true,
    })(GroupConfigurationDialog)
);
