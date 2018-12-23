import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { setUiSettingsValues } from '../../../../../../redux/modules/uiSettings/actions';

export class ViewModeSelect extends React.Component {
    handleSelectMode = e => {
        const { setUiSettingsValues } = this.props;
        const { mode } = e.currentTarget.dataset;

        setUiSettingsValues({ noteContentViewMode: mode });
    };

    render() {
        const { viewMode } = this.props;
        return (
            <ButtonGroup minimal={false}>
                {[
                    { icon: 'code', mode: 'editor' },
                    { icon: 'panel-stats', mode: 'combo' },
                    { icon: 'font', mode: 'preview' },
                ].map(({ icon, mode }) => (
                    <Button
                        key={mode}
                        icon={icon}
                        active={viewMode === mode}
                        data-mode={mode}
                        onClick={this.handleSelectMode}
                    />
                ))}
            </ButtonGroup>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        viewMode: state.uiSettings.get('noteContentViewMode'),
    };
}

export default connect(
    mapStateToProps,
    {
        setUiSettingsValues,
    },
)(ViewModeSelect);
