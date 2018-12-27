import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import history from '../../../../../history';
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
        history.goBack();
    };

    handleGoForward = () => {
        history.goForward();
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
    {},
)(ElectronNavigation);
