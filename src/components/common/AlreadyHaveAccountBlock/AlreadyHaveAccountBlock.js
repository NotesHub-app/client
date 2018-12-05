import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

export default class AlreadyHaveAccountBlock extends React.Component {
    render() {
        return (
            <div className={classNames(styles.root)}>
                Уже есть аккаунт? <Link to="/login">Войти!</Link>
            </div>
        );
    }
}
