import React from 'react';
import { InputGroup } from '@blueprintjs/core';
import FieldErrorLabel from '../../common/FieldErrorLabel/FieldErrorLabel';

export default class InputTextField extends React.Component {
    static defaultProps = {
        input: {
            value: false,
            onChange: () => {},
        },
    };

    render() {
        const {className, ...props} = this.props;
        return (
            <div className={className}>
                <InputGroup {...props} {...props.input} />
                <FieldErrorLabel {...props} />
            </div>
        );
    }
}
