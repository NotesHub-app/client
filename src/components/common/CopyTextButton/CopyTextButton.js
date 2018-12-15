import React from 'react';
import { Button } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import { copyTextToBuffer } from '../../../utils/browser';

export default class CopyTextButton extends React.Component {
    static propTypes = {
        textToCopy: PropTypes.string.isRequired,
    };

    handleClick = e => {
        const { textToCopy } = this.props;

        copyTextToBuffer(textToCopy)
    };

    render() {
        const { textToCopy, ...btnProps } = this.props;
        return <Button {...btnProps} onClick={this.handleClick} />;
    }
}
