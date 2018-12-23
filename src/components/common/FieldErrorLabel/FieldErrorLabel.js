import React from 'react';
import SubLabel from '../SubLabel';

export default class FieldErrorLabel extends React.Component {
    static defaultProps = {
        meta: {},
    };

    render() {
        const { meta } = this.props;

        return (
            <div>
                {(meta.error || meta.submitError) && meta.touched && (
                    <SubLabel error>{meta.error || meta.submitError}</SubLabel>
                )}
            </div>
        );
    }
}
