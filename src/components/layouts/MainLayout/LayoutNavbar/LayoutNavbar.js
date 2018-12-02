import React from 'react';
import { connect } from 'react-redux';
import { Alignment, Navbar, NavbarHeading, NavbarGroup, NavbarDivider, Button } from '@blueprintjs/core';
import { push } from 'connected-react-router';
import classNames from 'classnames';
import startsWith from 'lodash/startsWith';
import get from 'lodash/get';
import styles from './styles.module.scss';
import { isElectron } from '../../../../utils/electron-helpers';
import ElectronAppControls from './ElectronAppControls';
import { tc } from '../../../../utils/helpers';
import ElectronNavigation from './ElectronNavigation';

export class LayoutNavbar extends React.Component {
    render() {
        const { push, activePathname } = this.props;

        return (
            <Navbar
                className={classNames('bp3-fixed-top bp3-dark layout', styles.root, { [styles.electron]: isElectron() })}
            >
                <div className={styles.leftColorBorder} />
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading className={classNames(styles.heading, tc('logo'))} onClick={() => push('/devices')}>
                        NotesHub
                    </NavbarHeading>
                    <NavbarDivider />
                    {isElectron() && <ElectronNavigation />}
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button
                        className={classNames(
                            'bp3-minimal',
                            {
                                [styles.activeButton]: startsWith(activePathname, '/settings'),
                            },
                            tc('settingsNavButton'),
                        )}
                        icon="settings"
                        text="Пользовательские настройки"
                        onClick={() => {
                            push('/settings');
                        }}
                    />

                    {isElectron() && <ElectronAppControls />}
                </NavbarGroup>
            </Navbar>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const activePathname = get(state, 'router.location.pathname');

    return {
        activePathname,
    };
}

export default connect(mapStateToProps, {
    push,
})(LayoutNavbar);
