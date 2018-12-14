import React from 'react';
import { connect } from 'react-redux';
import { Popover, Menu, MenuItem, Position, MenuDivider } from '@blueprintjs/core';
import { logout } from '../../../../../redux/modules/user/actions';
import UserSettingsDialog from '../../../../dialogs/UserSettingsDialog';
import AddGroupDialog from '../../../../dialogs/AddGroupDialog';

export class UserButton extends React.Component {
    state = {
        isOpenUserSettingsDialog: false,
        isOpenAddGroupDialog: false,
    };

    handleLogout = () => {
        const { logout } = this.props;
        logout();
    };

    handleOpenSettings = () => {
        this.setState({ isOpenUserSettingsDialog: true });
    };

    handleCloseSettings = () => {
        this.setState({ isOpenUserSettingsDialog: false });
    };

    handleOpenAddGroupDialog = () => {
        this.setState({ isOpenAddGroupDialog: true });
    };

    handleCloseAddGroupDialog = () => {
        this.setState({ isOpenAddGroupDialog: false });
    };

    render() {
        const { user } = this.props;
        const { isOpenUserSettingsDialog, isOpenAddGroupDialog } = this.state;

        return (
            <React.Fragment>
                <Popover
                    content={
                        <Menu>
                            <MenuItem icon="cog" text="Персональные настройки" onClick={this.handleOpenSettings} />
                            <MenuItem icon="plus" text="Создать группу заметок" onClick={this.handleOpenAddGroupDialog} />
                            <MenuDivider />
                            <MenuItem icon="log-out" text="Выйти" onClick={this.handleLogout} />
                        </Menu>
                    }
                    position={Position.BOTTOM}
                >
                    <button className="bp3-button bp3-minimal bp3-icon-user">{user.get('email')}</button>
                </Popover>
                <UserSettingsDialog isOpen={isOpenUserSettingsDialog} onClose={this.handleCloseSettings} />
                <AddGroupDialog isOpen={isOpenAddGroupDialog} onClose={this.handleCloseAddGroupDialog} />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        user: state.user,
    };
}

export default connect(
    mapStateToProps,
    {
        logout,
    }
)(UserButton);
