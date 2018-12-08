import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { setUiSettingsValues } from '../../../../../../../redux/modules/uiSettings/actions';

export class FooterResizer extends React.Component {
    state = {
        active: false,
    };

    initY = null;

    handleActivate = e => {
        const { footerContentHeight } = this.props;

        this.initY = e.clientY;
        this.originalHeight = footerContentHeight;

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

        const diffY = this.initY - e.clientY ;

        let newHeight = this.originalHeight + diffY;
        newHeight = Math.max(100, newHeight);
        newHeight = Math.min(600, newHeight);

        setUiSettingsValues({ footerContentHeight: newHeight });
    };

    render() {
        const { active } = this.state;
        const {footerContentHeight} = this.props;

        return (
            <React.Fragment>
                <div
                    className={classNames(styles.root, { [styles.active]: active })}
                    onMouseDown={this.handleActivate}
                    style={{bottom: footerContentHeight - 3}}
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
        footerContentHeight: state.uiSettings.get('footerContentHeight'),
    };
}

export default connect(
    mapStateToProps,
    {
        setUiSettingsValues,
    },
)(FooterResizer);
