import React from 'react';
import { Button } from '@blueprintjs/core';
import PropTypes from 'prop-types';

export default class CopyTextButton extends React.Component {
    static propTypes = {
        textToCopy: PropTypes.string.isRequired,
    };

    handleClick = e => {
        const { textToCopy } = this.props;

        const textField = document.createElement('textarea');
        textField.innerText = textToCopy;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    };

    render() {
        const { textToCopy, ...btnProps } = this.props;
        return <Button {...btnProps} onClick={this.handleClick} />;
    }
}
