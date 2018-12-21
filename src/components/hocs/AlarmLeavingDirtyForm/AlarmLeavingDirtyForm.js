import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';

export default function AlarmLeavingDirtyForm(WrappedComponent) {
    return class extends React.Component {
        state = {
            isOpenLeaveConfirmDialog: false,
            active: true,
        };

        setRouterLeaveConfirm = () => {
            this.unblock = this.props.history.block(nextLocation => {
                if (!this.disabledConfirm && this.props.dirty) {
                    this.openLeaveConfirmDialog(nextLocation.pathname);
                    return false;
                }
            });
        };

        componentDidMount() {
            const { asDialog } = this.props;
            if (!asDialog) {
                this.setRouterLeaveConfirm();
            }
        }

        componentWillUnmount() {
            this.unblock();
        }

        openLeaveConfirmDialog = nextPath => {
            this.nextPath = nextPath;
            this.setState({
                isOpenLeaveConfirmDialog: true,
            });
        };

        closeLeaveConfirmDialog = () => {
            this.setState({
                isOpenLeaveConfirmDialog: false,
            });
        };

        applyLeaveConfirmDialog = () => {
            this.closeLeaveConfirmDialog();

            this.disabledConfirm = true;
            this.props.history.push(this.nextPath);
        };

        disableLeaveConfirm = () => {
            this.disabledConfirm = true;
        };

        render() {
            const { isOpenLeaveConfirmDialog } = this.state;

            return (
                <React.Fragment>
                    <WrappedComponent {...this.props} disableLeaveConfirm={this.disableLeaveConfirm} />

                    <Alert
                        icon="warning-sign"
                        intent={Intent.WARNING}
                        isOpen={isOpenLeaveConfirmDialog}
                        confirmButtonText="Продолжить без сохранения"
                        cancelButtonText="Остаться"
                        onConfirm={this.applyLeaveConfirmDialog}
                        onCancel={this.closeLeaveConfirmDialog}
                    >
                        <p>Содержимое было изменено. Несохраненные данные будут потеряны!</p>
                    </Alert>
                </React.Fragment>
            );
        }
    };
}
