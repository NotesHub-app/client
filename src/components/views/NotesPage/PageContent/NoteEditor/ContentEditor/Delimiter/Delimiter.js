import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { setUiSettingsValues } from '../../../../../../../redux/modules/uiSettings';

export class Delimiter extends React.Component {
    state = {
        active: false,
    };

    initX = null;

    handleActivate = e => {
        const el = ReactDOM.findDOMNode(this).parentElement;
        this.parentLeft = el.offsetLeft;
        this.parentWidth = el.offsetWidth;

        this.initX = e.clientX;

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

        let width = ((e.clientX - this.parentLeft) / this.parentWidth) * 100;

        if (width > 80) {
            width = 80;
        } else if (width < 20) {
            width = 20;
        }

        setUiSettingsValues({ noteEditorWidth: width });
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
    return {};
}

export default connect(
    mapStateToProps,
    {
        setUiSettingsValues,
    },
)(Delimiter);
