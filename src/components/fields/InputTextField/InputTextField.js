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
        return (
            <div>
                <InputGroup {...this.props} {...this.props.input} />
                <FieldErrorLabel {...this.props} />
            </div>
        );
    }
}
