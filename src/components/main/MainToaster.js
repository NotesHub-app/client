import React from 'react';
import { Position, Toaster } from '@blueprintjs/core';

export default class MainToaster extends React.Component {
    refHandlers = {
        toaster: ref => {
            this.toaster = ref;
        },
    };

    addToast = toast => {
        this.toaster.show({ timeout: 3000, ...toast });
    };

    componentDidMount() {
        window.showToast = this.addToast;
    }

    render() {
        return (
            <div>
                <Toaster position={Position.BOTTOM_RIGHT} ref={this.refHandlers.toaster} />
            </div>
        );
    }
}
