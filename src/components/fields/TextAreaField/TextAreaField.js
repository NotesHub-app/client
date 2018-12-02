import React from 'react';
import { TextArea } from '@blueprintjs/core';
import FieldErrorLabel from '../../common/FieldErrorLabel/FieldErrorLabel';

export default class TextAreaField extends React.Component {
    static defaultProps = {
        input: {
            value: false,
            onChange: () => {},
        },
    };

    render() {
        return (
            <div>
                <TextArea className="bp3-fill" large={true} rows="10" {...this.props} {...this.props.input} />
                <FieldErrorLabel {...this.props} />
            </div>
        );
    }
}
