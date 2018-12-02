import React from 'react';
import SubLabel from '../SubLabel';

export default class FieldErrorLabel extends React.Component {
    render() {
        const { meta: { touched, error, warning } = {} } = this.props;

        return (
            <div>
                {touched &&
                    ((error && <SubLabel error>{error}</SubLabel>) ||
                        (warning && <SubLabel warning>{error}</SubLabel>))}
            </div>
        );
    }
}
