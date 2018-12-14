import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import FieldErrorLabel from '../../common/FieldErrorLabel/FieldErrorLabel';

export default class SwitchField extends React.Component {
    static propTypes = {
        large: PropTypes.bool,
    };

    static defaultProps = {
        input: {
            value: false,
            onChange: () => {},
        },
    };

    render() {
        const {
            large,
            input: { value },
        } = this.props;

        return (
            <div>
                <label
                    className={classNames('bp3-control bp3-switch', { 'bp3-large': large }, styles.root)}
                >
                    <input {...this.props.input} type="checkbox" checked={value} />
                    <span className="bp3-control-indicator" />
                </label>
                <FieldErrorLabel {...this.props} />
            </div>
        );
    }
}
