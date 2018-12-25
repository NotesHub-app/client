import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../fields/GroupUsersField/styles.module.scss';

export default class UserLabel extends React.Component {
    static propTypes = {
        userName: PropTypes.string,
        email: PropTypes.string,
        githubUrl: PropTypes.string,
        googleUrl: PropTypes.string,
        bold: PropTypes.bool,
    };

    renderUserDescription() {
        const { email, githubUrl, googleUrl } = this.props;

        let description;

        if (email) {
            description = email;
        } else if (githubUrl) {
            description = (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    {githubUrl}
                </a>
            );
        } else if (googleUrl) {
            description = (
                <a href={googleUrl} target="_blank" rel="noopener noreferrer">
                    {googleUrl}
                </a>
            );
        }

        if (description) {
            return <span className={styles.userDescription}>({description})</span>;
        }
        return null;
    }

    render() {
        const { bold, userName } = this.props;

        return (
            <span>
                <span style={{ fontWeight: bold ? 'bold' : undefined }}>{userName}</span>
                {this.renderUserDescription()}
            </span>
        );
    }
}
