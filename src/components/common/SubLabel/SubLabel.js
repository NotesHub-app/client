import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.module.scss';

export default class SubLabel extends React.Component {
    static propTypes = {
        warning: PropTypes.bool,
        error: PropTypes.bool,
    };

    render() {
        const { children, warning, error } = this.props;

        return (
            <span
                className={classNames(styles.root, {
                    [styles.error]: error,
                    [styles.warning]: warning,
                })}
            >
                {children}
            </span>
        );
    }
}
