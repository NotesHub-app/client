import React from 'react';
import FieldErrorLabel from '../../common/FieldErrorLabel/FieldErrorLabel';

export default class CheckboxField extends React.Component {
    render() {
        const { input, meta, label } = this.props;

        return (
            <div>
                <label className="bp3-control bp3-checkbox">
                    <input {...input} type="checkbox" />
                    <span className="bp3-control-indicator" />
                    {label}
                </label>
                <FieldErrorLabel meta={meta} />
            </div>
        );
    }
}
