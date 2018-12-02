import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class SelectButtons extends React.Component {
    static propTypes = {
        value: PropTypes.any,
        vertical: PropTypes.bool,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                label: PropTypes.string,
                value: PropTypes.any,
                style: PropTypes.object,
                className: PropTypes.string,
            }),
        ),
        onChange: PropTypes.func,
    };

    static defaultProps = {
        onChange: f => f,
    };

    handleClick = selectedValue => {
        let { value } = this.props;
        const { multiple, onChange } = this.props;

        if (!multiple) {
            onChange(selectedValue);
        } else {
            value = value || [];
            if (value.includes(selectedValue)) {
                value = value.filter(i => i !== selectedValue);
            } else {
                value = [...value, selectedValue];
            }
            onChange(value);
        }
    };

    renderButton({ key, value, label, className, style = {} }) {
        const propValue = this.props.value;
        const { multiple } = this.props;

        let selected;
        if (multiple) {
            if (propValue) {
                selected = propValue.includes(value);
            }
        } else {
            selected = propValue === value;
        }

        return (
            <button
                type="button"
                key={key || value}
                className={classNames('bp3-button', { 'bp3-intent-primary bp3-active': selected }, className)}
                onClick={() => this.handleClick(value)}
                style={{ ...style }}
            >
                {label}
            </button>
        );
    }

    render() {
        const { options, vertical, className } = this.props;

        return (
            <div className={classNames('bp3-button-group', { 'bp3-vertical': vertical }, className)}>
                {options.map(option => this.renderButton(option))}
            </div>
        );
    }
}
