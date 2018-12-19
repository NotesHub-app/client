import React from 'react';
import classNames from 'classnames';
import { Button } from '@blueprintjs/core';
import styles from './styles.module.scss';
import UserButton from './UserButton/UserButton';

export default class NavigationHeader extends React.Component {
    render() {
        return (
            <div className={classNames(styles.root, 'bp3-dark')}>
                <div className={classNames(styles.headerGroup, styles.left)}>
                    <Button minimal icon="annotation" className="margin-right-10" />
                    <div className={styles.logo}>NotesHub</div>
                </div>
                <div className={classNames(styles.headerGroup, styles.right)}>
                    <div>
                        <UserButton />
                    </div>
                </div>
            </div>
        );
    }
}
