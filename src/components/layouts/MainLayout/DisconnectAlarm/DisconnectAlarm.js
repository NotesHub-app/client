import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.module.scss';

export class DisconnectAlarm extends React.Component {
    static propTypes = {
        active: PropTypes.bool,
    };

    render() {
        const { active } = this.props;

        return (
            <div style={{ display: !active && 'none' }} className={styles.root}>
                <div className={classNames('bp3-card bp3-elevation-2', styles.card)}>
                    <div className={styles.message}>
                        Потеряно соединение с сервером! <br />
                        Идет повторное подключение...
                    </div>
                    <div className="bp3-progress-bar bp3-intent-danger">
                        <div className="bp3-progress-meter" style={{ width: '100%' }} />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        active: state.uiSettings.get('connectionProblem'),
    };
}

export default connect(
    mapStateToProps,
    {},
)(DisconnectAlarm);
