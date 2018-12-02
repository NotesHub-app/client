import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FieldErrorLabel from '../../common/FieldErrorLabel/FieldErrorLabel';

export default class CheckboxField extends React.Component {
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
            label,
        } = this.props;

        return (
            <div>
                <label className={classNames('bp3-control bp3-checkbox', { 'bp3-large': large })}>
                    <input {...this.props.input} type="checkbox" checked={value} />
                    <span className="bp3-control-indicator" />
                    {label}
                </label>
                <FieldErrorLabel {...this.props} />
            </div>
        );
    }
}
