import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Redirect } from 'react-router-dom';
import LayoutNavbar from './LayoutNavbar';
import styles from './styles.module.scss';
import DisconnectAlarm from './DisconnectAlarm';
import { isElectron } from '../../../utils/electron-helpers';
import { dataReadySelector, userSelector } from '../../../redux/selectors';
import LoadingPage from '../../views/LoadingPage';

export class MainLayout extends React.Component {
    render() {
        const { children, user, dataReady } = this.props;

        if (!user) {
            return <Redirect to="/login" />;
        }

        if (!dataReady) {
            return <LoadingPage/>;
        }

        return (
            <div className={classNames(styles.root, { [styles.electron]: isElectron() })}>
                {isElectron() ? <div className={styles.borderLayer} /> : ''}
                <DisconnectAlarm />
                <LayoutNavbar />
                {children}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        user: userSelector(state),
        dataReady: dataReadySelector(state),
    };
}

export default connect(mapStateToProps, {})(MainLayout);
