import React from 'react';
import { connect } from 'react-redux';
import { Alignment, Navbar, NavbarHeading, NavbarGroup, NavbarDivider } from '@blueprintjs/core';
import classNames from 'classnames';
import get from 'lodash/get';
import styles from './styles.module.scss';
import { isElectron } from '../../../../utils/electron-helpers';
import ElectronAppControls from './ElectronAppControls';
import { tc } from '../../../../utils/helpers';
import ElectronNavigation from './ElectronNavigation';

export class LayoutNavbar extends React.Component {
    render() {
        return (
            <Navbar
                className={classNames('bp3-fixed-top bp3-dark layout', {
                    [styles.electron]: isElectron(),
                })}
            >
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading className={tc('logo')}>NotesHub</NavbarHeading>
                    <NavbarDivider />
                    {isElectron() && <ElectronNavigation />}
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>{isElectron() && <ElectronAppControls />}</NavbarGroup>
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

export default connect(
    mapStateToProps,
    {},
)(LayoutNavbar);
