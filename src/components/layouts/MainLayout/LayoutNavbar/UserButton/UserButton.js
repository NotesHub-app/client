import React from 'react';
import { connect } from 'react-redux';
import { Popover, Menu, MenuItem, Position } from '@blueprintjs/core';
import { logout } from '../../../../../redux/modules/user/actions';
import UserSettingsDialog from '../../../../dialogs/UserSettingsDialog';

export class UserButton extends React.Component {
    state = {
        isOpenUserSettingsDialog: false,
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

    render() {
        const { user } = this.props;
        const { isOpenUserSettingsDialog } = this.state;

        return (
            <React.Fragment>
                <Popover
                    content={
                        <Menu>
                            <MenuItem icon="cog" text="Настройки" onClick={this.handleOpenSettings} />
                            <MenuItem icon="log-out" text="Выйти" onClick={this.handleLogout} />
                        </Menu>
                    }
                    position={Position.BOTTOM_RIGHT}
                    minimal
                >
                    <button className="bp3-button bp3-minimal bp3-icon-user">{user.get('email')}</button>
                </Popover>
                <UserSettingsDialog isOpen={isOpenUserSettingsDialog} onClose={this.handleCloseSettings} />
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
