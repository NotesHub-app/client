import React from 'react';
import { Spinner } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.module.scss';

export default class LoadingPage extends React.Component {
    static propTypes = {
        label: PropTypes.string,
    };

    static defaultProps = {
        label: 'Загрузка...',
    };

    render() {
        const { label } = this.props;

        return (
            <div className={styles.root}>
                <div className={classNames('text-center bp3-card bp3-elevation-1', styles.card)}>
                    <div className={classNames('no-wrap', styles.label)}>{label}</div>
                    <Spinner />
                </div>
            </div>
        );
    }
}
