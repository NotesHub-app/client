import React from 'react';
import { Alert, Intent } from '@blueprintjs/core';
import PropTypes from 'prop-types';

export default class RemoveItemAlert extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onConfirm: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        text: PropTypes.string,
    };

    static defaultProps = {
        text: 'Точно хотите удалить выбранную запись???',
    };

    render() {
        const { isOpen, text, onConfirm, onCancel } = this.props;

        return (
            <Alert
                icon="trash"
                intent={Intent.DANGER}
                isOpen={isOpen}
                confirmButtonText="Удалить"
                cancelButtonText="Отмена"
                onConfirm={onConfirm}
                onCancel={onCancel}
            >
                <p>{text}</p>
            </Alert>
        );
    }
}
