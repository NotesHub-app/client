import React from 'react';
import { NumericInput } from '@blueprintjs/core';
import FieldErrorLabel from '../../common/FieldErrorLabel/FieldErrorLabel';

export default class InputNumberField extends React.Component {
    static defaultProps = {
        input: {
            value: new Date(),
            onChange: () => {},
        },
    };

    handleChangeValue = val => {
        const {
            input: { onChange },
        } = this.props;
        onChange(val);
    };

    render() {
        const {
            input: { value },
        } = this.props;

        this.props.input.value = undefined;

        return (
            <div>
                <NumericInput
                    selectAllOnFocus
                    {...this.props}
                    {...this.props.input}
                    value={Number(value) || null}
                    onValueChange={this.handleChangeValue}
                />
                <FieldErrorLabel {...this.props} />
            </div>
        );
    }
}
