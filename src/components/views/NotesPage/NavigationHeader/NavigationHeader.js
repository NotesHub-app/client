import React from 'react';
import classNames from 'classnames';
import { Alert, Button } from '@blueprintjs/core';
import styles from './styles.module.scss';
import UserButton from './UserButton/UserButton';

export default class NavigationHeader extends React.Component {
    state = {
        isOpenAboutAlert: false,
    };

    handleOpenAboutAlert = () => {
        this.setState({
            isOpenAboutAlert: true,
        });
    };

    handleCloseAboutAlert = () => {
        this.setState({
            isOpenAboutAlert: false,
        });
    };

    render() {
        const { isOpenAboutAlert } = this.state;

        return (
            <div className={classNames(styles.root, 'bp3-dark')}>
                <div className={classNames(styles.headerGroup, styles.left)}>
                    <Button minimal icon="annotation" className="margin-right-5" onClick={this.handleOpenAboutAlert} />
                    <div className={styles.logo}>
                        Notes<span className="hub">Hub</span>
                    </div>
                </div>
                <div className={classNames(styles.headerGroup, styles.right)}>
                    <div>
                        <UserButton />
                    </div>
                </div>

                <Alert
                    isOpen={isOpenAboutAlert}
                    onClose={this.handleCloseAboutAlert}
                    confirmButtonText="Закрыть"
                    canEscapeKeyCancel
                >
                    <div>
                        NotesHub <br />© Avin Grape, 2018. Все права защищены.
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <a href="https://github.com/NotesHub-app" target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                    </div>
                </Alert>
            </div>
        );
    }
}
