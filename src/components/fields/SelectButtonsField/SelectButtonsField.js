import React from 'react';
import SelectButtons from '../../common/SelectButtons';
import FieldErrorLabel from '../../common/FieldErrorLabel/FieldErrorLabel';

export default class SelectButtonsField extends React.Component {
    render() {
        return (
            <React.Fragment>
                <SelectButtons {...this.props} {...this.props.input} />
                <FieldErrorLabel {...this.props} />
            </React.Fragment>
        );
    }
}
