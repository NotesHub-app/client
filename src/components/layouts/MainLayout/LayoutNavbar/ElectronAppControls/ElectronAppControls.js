import React from 'react';
import { connect } from 'react-redux';
import { Button, NavbarDivider } from '@blueprintjs/core';
import classNames from 'classnames';

export class ElectronAppControls extends React.Component {
    state = {
        maximized: false,
    };

    componentDidMount() {
        const mainWidow = window.remote.getCurrentWindow();
        mainWidow.on('maximize', this.handleMaximize);
        mainWidow.on('unmaximize', this.handleUnMaximize);

        this.setState({
            maximized: mainWidow.isMaximized(),
        });
    }

    handleMaximize = () => {
        this.setState({
            maximized: true,
        });
    };

    handleUnMaximize = () => {
        this.setState({
            maximized: false,
        });
    };

    render() {
        const { maximized } = this.state;

        return (
            <React.Fragment>
                <NavbarDivider />

                <button
                    type="button"
                    className="bp3-button bp3-minimal bp3-icon-minus"
                    title="Свернуть"
                    onClick={() => {
                        const mainWidow = window.remote.getCurrentWindow();
                        mainWidow.minimize();
                    }}
                />

                <button
                    type="button"
                    className={classNames('bp3-button bp3-minimal', {
                        'bp3-icon-maximize': !maximized,
                        'bp3-icon-minimize': maximized,
                    })}
                    title="Развернуть"
                    onClick={() => {
                        const mainWidow = window.remote.getCurrentWindow();
                        mainWidow.isMaximized() ? mainWidow.unmaximize() : mainWidow.maximize();
                    }}
                />

                <Button
                    type="button"
                    className="bp3-button bp3-minimal bp3-icon-cross"
                    title="Закрыть"
                    onClick={() => {
                        const mainWidow = window.remote.getCurrentWindow();
                        mainWidow.close();
                    }}
                />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(mapStateToProps, {})(ElectronAppControls);
