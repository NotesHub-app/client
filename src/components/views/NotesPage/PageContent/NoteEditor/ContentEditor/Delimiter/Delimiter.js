import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { setUiSettingsValues } from '../../../../../../../redux/modules/uiSettings/actions';

export class Delimiter extends React.Component {
    state = {
        active: false,
    };

    initX = null;

    handleActivate = e => {
        const el = this.node.parentElement;

        const rect = el.getBoundingClientRect();
        this.parentLeft = rect.left;
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
                    ref={i => {
                        this.node = i;
                    }}
                    className={classNames(styles.root, { [styles.active]: active })}
                    onMouseDown={this.handleActivate}
                >
                    {active && (
                        <div
                            className={styles.movingLayer}
                            onMouseLeave={this.handleDeactivate}
                            onMouseUp={this.handleDeactivate}
                            onMouseMove={this.handleMove}
                        />
                    )}
                </div>
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
