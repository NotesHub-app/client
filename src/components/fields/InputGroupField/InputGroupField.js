import React from 'react';
import { InputGroup } from '@blueprintjs/core';
import FieldErrorLabel from '../../common/FieldErrorLabel/FieldErrorLabel';

export default class InputGroupField extends React.Component {
    render() {
        const { meta, input, placeholder, leftIcon, disabled, type } = this.props;

        return (
            <div className="bp3-form-group">
                <InputGroup {...input} leftIcon={leftIcon} placeholder={placeholder} disabled={disabled} type={type} />
                <FieldErrorLabel meta={meta} />
            </div>
        );
    }
}
