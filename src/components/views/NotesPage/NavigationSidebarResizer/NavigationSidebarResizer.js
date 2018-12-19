import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { setUiSettingsValues } from '../../../../redux/modules/uiSettings/actions';

export class NavigationSidebarResizer extends React.Component {
    state = {
        active: false,
    };

    initX = null;

    handleActivate = e => {
        const { navigationSidebarWidth } = this.props;

        this.initX = e.clientX;
        this.originalWidth = navigationSidebarWidth;

        this.setState({
            active: true,
        });
    };

    handleDeactivate = () => {
        this.setState({
            active: false,
        });
    };

    handleMove = e => {
        const { setUiSettingsValues } = this.props;

        const diffX = this.initX - e.clientX;

        let newWidth = this.originalWidth - diffX;
        newWidth = Math.max(180, newWidth);
        newWidth = Math.min(600, newWidth);

        setUiSettingsValues({ navigationSidebarWidth: newWidth });
    };

    render() {
        const { active } = this.state;

        return (
            <React.Fragment>
                <div
                    className={classNames(styles.root, { [styles.active]: active })}
                    onMouseDown={this.handleActivate}
                />
                {active && (
                    <div
                        className={styles.movingLayer}
                        onMouseLeave={this.handleDeactivate}
                        onMouseUp={this.handleDeactivate}
                        onMouseMove={this.handleMove}
                    />
                )}
            </React.Fragment>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        navigationSidebarWidth: state.uiSettings.get('navigationSidebarWidth'),
    };
}

export default connect(
    mapStateToProps,
    {
        setUiSettingsValues,
    },
)(NavigationSidebarResizer);
