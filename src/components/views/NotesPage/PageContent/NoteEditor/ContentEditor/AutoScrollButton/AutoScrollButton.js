import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { setUiSettingsValues } from '../../../../../../../redux/modules/uiSettings/actions';

export class AutoScrollButton extends React.Component {
    handleToggleAutoScroll = () => {
        const { autoScroll, setUiSettingsValues } = this.props;
        setUiSettingsValues({ autoScroll: !autoScroll });
    };

    render() {
        const { viewMode, autoScroll } = this.props;

        if (viewMode !== 'combo') {
            return null;
        }

        return (
            <Button
                minimal
                small
                active={autoScroll}
                icon="double-caret-vertical"
                className="margin-right-5"
                onClick={this.handleToggleAutoScroll}
                title="Синхронизация скрола"
            />
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        viewMode: state.uiSettings.get('noteContentViewMode'),
        autoScroll: state.uiSettings.get('autoScroll'),
    };
}

export default connect(
    mapStateToProps,
    {
        setUiSettingsValues,
    },
)(AutoScrollButton);
