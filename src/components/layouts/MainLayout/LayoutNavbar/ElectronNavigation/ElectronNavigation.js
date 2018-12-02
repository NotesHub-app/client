import React from 'react';
import { connect } from 'react-redux';
import { goBack, goForward } from 'connected-react-router';
import classNames from 'classnames';
import styles from './styles.module.scss';

export class ElectronNavigation extends React.Component {
    state = {
        canGoBack: false,
        canGoForward: false,
    };

    componentDidUpdate(prevProps) {
        const { routerAction } = this.props;

        if (routerAction !== 'REPLACE' && prevProps.pathname !== this.props.pathname) {
            const mainWindow = window.remote.getCurrentWindow();
            if (mainWindow && mainWindow.webContents) {
                this.setState({
                    canGoBack: mainWindow.webContents.canGoBack(),
                    canGoForward: mainWindow.webContents.canGoForward(),
                });
            }
        }
    }

    handleGoBack = () => {
        const { goBack } = this.props;
        goBack();
    };

    handleGoForward = () => {
        const { goForward } = this.props;
        goForward();
    };

    render() {
        const { canGoBack, canGoForward } = this.state;
        return (
            <div className={classNames(styles.root, 'bp3-card')}>
                <button
                    type="button"
                    className="bp3-button bp3-minimal bp3-small bp3-icon-arrow-left"
                    onClick={this.handleGoBack}
                    disabled={!canGoBack}
                />
                <button
                    type="button"
                    className="bp3-button bp3-minimal bp3-small bp3-icon-arrow-right"
                    onClick={this.handleGoForward}
                    disabled={!canGoForward}
                />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        pathname: state.router.location.pathname,
        routerAction: state.router.action,
    };
}

export default connect(
    mapStateToProps,
    {
        goBack,
        goForward,
    },
)(ElectronNavigation);
