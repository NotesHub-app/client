import React from 'react';
import { connect } from 'react-redux';
import { Slider, Checkbox } from '@blueprintjs/core';
import classNames from 'classnames';
import { setUiSettingsValues } from '../../../../../../../../redux/modules/uiSettings/actions';
import styles from './styles.module.scss';

export class NarrowChanger extends React.Component {
    handleChange = value => {
        const { setUiSettingsValues } = this.props;
        setUiSettingsValues({ previewNarrowValue: value });
    };

    handleEnabledChange = e => {
        const { setUiSettingsValues } = this.props;
        setUiSettingsValues({ previewNarrowEnabled: e.currentTarget.checked });
    };

    render() {
        const { previewNarrowValue, previewNarrowEnabled } = this.props;

        return (
            <div className={classNames(styles.root, { [styles.activeRoot]: previewNarrowEnabled })}>
                <Checkbox
                    className={styles.checkbox}
                    checked={previewNarrowEnabled}
                    label="Сужение"
                    onChange={this.handleEnabledChange}
                />
                <Slider
                    className={styles.slider}
                    labelRenderer={false}
                    min={0}
                    max={45}
                    value={previewNarrowValue}
                    onChange={this.handleChange}
                    disabled={!previewNarrowEnabled}
                />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        previewNarrowValue: state.uiSettings.get('previewNarrowValue'),
        previewNarrowEnabled: state.uiSettings.get('previewNarrowEnabled'),
    };
}

export default connect(
    mapStateToProps,
    {
        setUiSettingsValues,
    },
)(NarrowChanger);
