import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Redirect } from 'react-router-dom';
import LayoutNavbar from './LayoutNavbar';
import styles from './styles.module.scss';
import DisconnectAlarm from './DisconnectAlarm';
import { isElectron } from '../../../utils/electron-helpers';
import { userSelector } from '../../../redux/selectors';

export class MainLayout extends React.Component {
    render() {
        const { children, user } = this.props;

        if (!user) {
            return <Redirect to="/login" />;
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
    };
}

export default connect(mapStateToProps, {})(MainLayout);
